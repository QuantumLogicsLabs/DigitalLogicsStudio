import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { Navbar } from "../Home/Navbar";
import Footer from "../Home/Footer";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import progressService from "../../services/progressService";
import apiClient from "../../services/apiClient";
import "./Auth.css";
import "./ProfileDashboard.css";

// ─── Colour palette ───────────────────────────────────────────────────────────
const COLORS = {
  blue: "#3b82f6",
  purple: "#8b5cf6",
  green: "#10b981",
  amber: "#f59e0b",
  pink: "#ec4899",
  cyan: "#06b6d4",
  red: "#ef4444",
  indigo: "#6366f1",
};
const PIE_COLORS = [
  COLORS.blue,
  COLORS.purple,
  COLORS.green,
  COLORS.amber,
  COLORS.pink,
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function getDayName(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });
}

function getWeekLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, accent, trend }) {
  return (
    <div className="pd-stat-card" style={{ "--accent": accent }}>
      <div className="pd-stat-icon">{icon}</div>
      <div className="pd-stat-body">
        <span className="pd-stat-value">{value}</span>
        <span className="pd-stat-label">{label}</span>
        {sub && <span className="pd-stat-sub">{sub}</span>}
        {trend !== undefined && (
          <span
            className={`pd-stat-trend ${trend >= 0 ? "pd-stat-trend--up" : "pd-stat-trend--down"}`}
          >
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}% vs last week
          </span>
        )}
      </div>
    </div>
  );
}

function SkillBar({ label, pct, color }) {
  return (
    <div className="pd-skill-row">
      <div className="pd-skill-meta">
        <span className="pd-skill-label">{label}</span>
        <span className="pd-skill-pct">{pct}%</span>
      </div>
      <div className="pd-skill-track">
        <div
          className="pd-skill-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ─── GitHub-style full-year activity calendar ─────────────────────────────────
function buildYearGrid(activityMap) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start from 52 weeks ago, on the most recent Sunday
  const start = new Date(today);
  start.setDate(start.getDate() - 52 * 7);
  // Roll back to Sunday
  start.setDate(start.getDate() - start.getDay());

  const toKey = (d) => d.toISOString().slice(0, 10);

  // Build flat list of all days from start → today
  const days = [];
  const cursor = new Date(start);
  while (cursor <= today) {
    const key = toKey(cursor);
    const data = activityMap[key] || { solved: 0, attempts: 0, topicsCompleted: 0, topicsOpened: 0 };
    const total = (data.solved || 0) + (data.attempts || 0) + (data.topicsCompleted || 0);
    const intensity = total === 0 ? 0 : total === 1 ? 1 : total <= 3 ? 2 : total <= 6 ? 3 : 4;
    days.push({ date: key, intensity, ...data, total, isFuture: false });
    cursor.setDate(cursor.getDate() + 1);
  }

  // Pad to fill last week (so grid is always full columns)
  while (days.length % 7 !== 0) {
    const padDate = new Date(cursor);
    days.push({ date: toKey(padDate), intensity: -1, total: 0, isFuture: true });
    cursor.setDate(cursor.getDate() + 1);
  }

  // Group into weeks (columns of 7)
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Build month label positions
  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const firstReal = week.find((d) => !d.isFuture);
    if (!firstReal) return;
    const m = new Date(firstReal.date).getMonth();
    if (m !== lastMonth) {
      monthLabels.push({
        col: wi,
        label: new Date(firstReal.date).toLocaleDateString("en-US", { month: "short" }),
      });
      lastMonth = m;
    }
  });

  return { weeks, monthLabels };
}

function GithubCalendar({ activityMap, streakCurrent, streakLongest, activeDays, totalContributions }) {
  const [tooltip, setTooltip] = React.useState(null);
  const { weeks, monthLabels } = React.useMemo(() => buildYearGrid(activityMap), [activityMap]);

  const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const CELL = 13; // px per cell
  const GAP = 3;   // px gap

  return (
    <div className="ghcal-wrap">
      {/* ── Stats row ── */}
      <div className="ghcal-stats">
        <div className="ghcal-stat">
          <strong>{totalContributions}</strong>
          <span>contributions this year</span>
        </div>
        <div className="ghcal-stat">
          <strong>{streakCurrent}d</strong>
          <span>current streak</span>
        </div>
        <div className="ghcal-stat">
          <strong>{streakLongest}d</strong>
          <span>longest streak</span>
        </div>
        <div className="ghcal-stat">
          <strong>{activeDays}</strong>
          <span>active days</span>
        </div>
      </div>

      {/* ── Calendar grid ── */}
      <div className="ghcal-scroll">
        <div className="ghcal-inner" style={{ "--cell": `${CELL}px`, "--gap": `${GAP}px` }}>

          {/* Month labels row */}
          <div className="ghcal-month-row">
            <div className="ghcal-day-spacer" /> {/* spacer for day labels */}
            <div className="ghcal-months">
              {monthLabels.map((m) => (
                <span
                  key={`${m.label}-${m.col}`}
                  className="ghcal-month-label"
                  style={{ gridColumn: m.col + 1 }}
                >
                  {m.label}
                </span>
              ))}
            </div>
          </div>

          {/* Day labels + grid */}
          <div className="ghcal-body">
            {/* Day-of-week labels */}
            <div className="ghcal-day-labels">
              {DAY_LABELS.map((d, i) => (
                <span key={d} className="ghcal-day-label" style={{ gridRow: i + 1 }}>
                  {i % 2 === 1 ? d : ""}
                </span>
              ))}
            </div>

            {/* Weeks grid */}
            <div className="ghcal-grid">
              {weeks.map((week, wi) =>
                week.map((day, di) => {
                  if (day.isFuture) {
                    return (
                      <div
                        key={`${wi}-${di}`}
                        className="ghcal-cell ghcal-cell--future"
                        style={{ gridColumn: wi + 1, gridRow: di + 1 }}
                      />
                    );
                  }
                  return (
                    <div
                      key={day.date}
                      className={`ghcal-cell ghcal-cell--${day.intensity}`}
                      style={{ gridColumn: wi + 1, gridRow: di + 1 }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({ day, x: rect.left + rect.width / 2, y: rect.top - 8 });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="ghcal-legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={`ghcal-cell ghcal-cell--${i} ghcal-legend-cell`} />
        ))}
        <span>More</span>
      </div>

      {/* ── Tooltip ── */}
      {tooltip && (
        <div
          className="ghcal-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <strong>{tooltip.day.date}</strong>
          {tooltip.day.total === 0 ? (
            <span>No activity</span>
          ) : (
            <>
              {tooltip.day.solved > 0 && <span>✅ {tooltip.day.solved} solved</span>}
              {tooltip.day.attempts > 0 && <span>⚡ {tooltip.day.attempts} attempts</span>}
              {tooltip.day.topicsCompleted > 0 && <span>📚 {tooltip.day.topicsCompleted} topics done</span>}
              {tooltip.day.topicsOpened > 0 && <span>📖 {tooltip.day.topicsOpened} topics opened</span>}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function TrackCard({
  trackType,
  title,
  progress,
  lessonsCount,
  totalLessons,
  xp,
  totalXp,
  streak,
  saved,
  nextLesson,
  accent,
  link,
}) {
  return (
    <div className="pd-track-card">
      <div className="pd-track-header">
        <span className="pd-track-type" style={{ color: accent }}>
          {trackType}
        </span>
        <span className="pd-track-pct" style={{ color: accent }}>
          {progress}%
        </span>
      </div>
      <h3 className="pd-track-title">{title}</h3>
      <div className="pd-track-stats">
        <div className="pd-track-stat">
          <span className="pd-track-stat-label">LESSONS</span>
          <span className="pd-track-stat-val">
            {lessonsCount}/{totalLessons}
          </span>
        </div>
        <div className="pd-track-stat">
          <span className="pd-track-stat-label">XP</span>
          <span className="pd-track-stat-val">
            {xp}/{totalXp}
          </span>
        </div>
        <div className="pd-track-stat">
          <span className="pd-track-stat-label">STREAK</span>
          <span className="pd-track-stat-val">{streak} days</span>
        </div>
        <div className="pd-track-stat">
          <span className="pd-track-stat-label">SAVED</span>
          <span className="pd-track-stat-val">{saved}</span>
        </div>
      </div>
      <div className="pd-track-footer">
        <div className="pd-track-next">
          <span className="pd-track-next-label">NEXT LESSON</span>
          <span className="pd-track-next-title">{nextLesson}</span>
        </div>
        <Link
          to={link}
          className="pd-btn pd-track-btn"
          style={{ backgroundColor: accent, color: "#000" }}
        >
          Continue
        </Link>
      </div>
    </div>
  );
}

// ─── Feedback Widget ──────────────────────────────────────────────────────────
function FeedbackWidget({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) return;
    onSubmit({ rating, comment });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pd-feedback-thanks">
        <span className="pd-feedback-thanks-icon">🙏</span>
        <span>Thanks for your feedback!</span>
      </div>
    );
  }

  return (
    <form className="pd-feedback-form" onSubmit={handleSubmit}>
      <p className="pd-feedback-prompt">Rate your learning experience</p>
      <div className="pd-feedback-stars">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            className={`pd-feedback-star${s <= (hovered || rating) ? " pd-feedback-star--active" : ""}`}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setRating(s)}
            aria-label={`${s} star`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        className="pd-feedback-textarea"
        placeholder="Any comments? (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
      />
      <button
        type="submit"
        className="pd-btn pd-btn--primary pd-btn--sm"
        disabled={!rating}
      >
        Submit Feedback
      </button>
    </form>
  );
}

// ─── Custom Tooltip for charts ────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="pd-chart-tooltip">
      <p className="pd-chart-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="pd-chart-tooltip-val">
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

// ─── Build weekly trend data from calendar ────────────────────────────────────
function buildWeeklyTrend(calendar) {
  if (!calendar || calendar.length === 0) return [];
  const weeks = [];
  for (let i = 0; i < calendar.length; i += 7) {
    const chunk = calendar.slice(i, i + 7);
    const solved = chunk.reduce((s, d) => s + (d.solved || 0), 0);
    const attempts = chunk.reduce((s, d) => s + (d.attempts || 0), 0);
    const label = chunk[0]?.date
      ? getWeekLabel(chunk[0].date)
      : `W${Math.floor(i / 7) + 1}`;
    weeks.push({ week: label, solved, attempts });
  }
  return weeks;
}

// ─── Build daily activity for last 7 days ────────────────────────────────────
function buildDailyActivity(calendar) {
  if (!calendar || calendar.length === 0) return [];
  return calendar.slice(-7).map((d) => ({
    day: d.date ? getDayName(d.date) : "?",
    solved: d.solved || 0,
    attempts: d.attempts || 0,
    topics: (d.topicsCompleted || 0) + (d.topicsOpened || 0),
  }));
}

// ─── Build pie data ───────────────────────────────────────────────────────────
function buildPieData(topicStats) {
  return [
    { name: "Boolean Algebra", value: topicStats.booleanAlgebra || 0 },
    { name: "K-Map", value: topicStats.kmap || 0 },
    { name: "Sequential", value: topicStats.sequential || 0 },
    { name: "Number Systems", value: topicStats.numberSystems || 0 },
    { name: "Arithmetic", value: topicStats.arithmetic || 0 },
  ].filter((d) => d.value > 0);
}

// ─── Build radar data ─────────────────────────────────────────────────────────
function buildRadarData(topicStats) {
  return [
    { subject: "Boolean", A: topicStats.booleanAlgebra || 0 },
    { subject: "K-Map", A: topicStats.kmap || 0 },
    { subject: "Sequential", A: topicStats.sequential || 0 },
    { subject: "Numbers", A: topicStats.numberSystems || 0 },
    { subject: "Arithmetic", A: topicStats.arithmetic || 0 },
  ];
}

// ─── Most active day ─────────────────────────────────────────────────────────
function getMostActiveDay(calendar) {
  if (!calendar || calendar.length === 0) return "—";
  const byDay = {};
  calendar.forEach((d) => {
    if (!d.date) return;
    const day = new Date(d.date).toLocaleDateString("en-US", {
      weekday: "long",
    });
    byDay[day] = (byDay[day] || 0) + (d.solved || 0) + (d.attempts || 0);
  });
  const sorted = Object.entries(byDay).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || "—";
}

// ─── Week-over-week comparison ────────────────────────────────────────────────
function getWeekComparison(calendar) {
  if (!calendar || calendar.length < 14)
    return { thisWeek: 0, lastWeek: 0, delta: 0 };
  const last7 = calendar.slice(-7);
  const prev7 = calendar.slice(-14, -7);
  const thisWeek = last7.reduce(
    (s, d) => s + (d.solved || 0) + (d.attempts || 0),
    0,
  );
  const lastWeek = prev7.reduce(
    (s, d) => s + (d.solved || 0) + (d.attempts || 0),
    0,
  );
  const delta =
    lastWeek === 0 ? 0 : Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
  return { thisWeek, lastWeek, delta };
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [logoutError] = useState("");
  const [progressData, setProgressData] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [backendOk, setBackendOk] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Feedback
  const [feedbackDone, setFeedbackDone] = useState(
    () =>
      localStorage.getItem(`pd_feedback_${user?.id || user?.email}`) === "1",
  );

  // ── Load progress ───────────────────────────────────────────────────────────
  const loadProgress = useCallback(async () => {
    if (!user) return;
    setLoadingProgress(true);
    try {
      const userKey = progressService.getUserKey(user);
      await progressService.loadFromDB(userKey);
      const snap = progressService.getSnapshot(userKey);
      setProgressData(snap);
      setBackendOk(true);
    } catch {
      setBackendOk(false);
    } finally {
      setLoadingProgress(false);
    }
  }, [user]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // ── Backend health ──────────────────────────────────────────────────────────
  useEffect(() => {
    const check = async () => {
      try {
        await apiClient.get("/health");
        setBackendOk(true);
      } catch {
        setBackendOk(false);
      }
    };
    check();
  }, []);

  // ── Derived stats ───────────────────────────────────────────────────────────
  const summary = progressData?.summary || {};
  const recentEvents = progressData?.recentEvents || [];
  const calendarDots = progressData?.calendar || [];
  const state = progressData?.state || {};

  const solvedCount = summary.solvedProblems || 0;
  const attemptedCount = summary.attemptedProblems || 0;
  const completedTopics = summary.completedTopics || 0;
  const streakCurrent = summary.streaks?.current || 0;
  const streakLongest = summary.streaks?.longest || 0;
  const activeDays = summary.streaks?.activeDays || 0;

  const topicEntries = Object.entries(state.topics || {});
  const avgPct = (arr) =>
    !arr.length
      ? 0
      : Math.round(
          arr.reduce((s, [, v]) => s + (v.completionPercentage || 0), 0) /
            arr.length,
        );

  const topicStats = {
    booleanAlgebra: avgPct(
      topicEntries.filter(([id]) => id.startsWith("boolean")),
    ),
    kmap: avgPct(
      topicEntries.filter(
        ([id]) => id.startsWith("kmap") || id.includes("kmap"),
      ),
    ),
    sequential: avgPct(
      topicEntries.filter(
        ([id]) => id.startsWith("seq") || id.startsWith("sequential"),
      ),
    ),
    numberSystems: avgPct(
      topicEntries.filter(
        ([id]) => id.startsWith("number") || id.startsWith("ns"),
      ),
    ),
    arithmetic: avgPct(
      topicEntries.filter(
        ([id]) => id.startsWith("arith") || id.startsWith("arithmetic"),
      ),
    ),
  };

  // ── Badges ──────────────────────────────────────────────────────────────────
  const badges = [
    {
      icon: "🧠",
      title: "Logic Master",
      desc: "Solve 20+ problems",
      earned: solvedCount >= 20,
      progress: Math.min((solvedCount / 20) * 100, 100),
      rarity: "rare",
    },
    {
      icon: "⚡",
      title: "Circuit Creator",
      desc: "Visit Circuit Forge",
      earned: recentEvents.some((e) => e.type === "topic_opened"),
      progress: recentEvents.some((e) => e.type === "topic_opened") ? 100 : 0,
      rarity: "common",
    },
    {
      icon: "🗺️",
      title: "K-Map Pro",
      desc: "Complete K-Map topics",
      earned: topicStats.kmap >= 80,
      progress: topicStats.kmap,
      rarity: "epic",
    },
    {
      icon: "🔥",
      title: "Streak Keeper",
      desc: "Maintain a 7-day streak",
      earned: streakCurrent >= 7,
      progress: Math.min((streakCurrent / 7) * 100, 100),
      rarity: "rare",
    },
    {
      icon: "🏆",
      title: "Topic Champion",
      desc: "Complete 3+ topics",
      earned: completedTopics >= 3,
      progress: Math.min((completedTopics / 3) * 100, 100),
      rarity: "common",
    },
    {
      icon: "🎯",
      title: "Problem Solver",
      desc: "Attempt 10+ problems",
      earned: attemptedCount >= 10,
      progress: Math.min((attemptedCount / 10) * 100, 100),
      rarity: "common",
    },
    {
      icon: "🌟",
      title: "Quiz Champion",
      desc: "Solve 50+ problems",
      earned: solvedCount >= 50,
      progress: Math.min((solvedCount / 50) * 100, 100),
      rarity: "legendary",
    },
    {
      icon: "🔬",
      title: "Logic Explorer",
      desc: "Open 10+ different topics",
      earned: topicEntries.length >= 10,
      progress: Math.min((topicEntries.length / 10) * 100, 100),
      rarity: "rare",
    },
    {
      icon: "💎",
      title: "Perfect Score",
      desc: "100% accuracy in a session",
      earned: solvedCount > 0 && solvedCount === attemptedCount,
      progress:
        solvedCount > 0
          ? Math.round((solvedCount / Math.max(attemptedCount, 1)) * 100)
          : 0,
      rarity: "legendary",
    },
  ];

  // ── Chart data ──────────────────────────────────────────────────────────────
  const weeklyTrend = buildWeeklyTrend(calendarDots);
  const dailyActivity = buildDailyActivity(calendarDots);
  const pieData = buildPieData(topicStats);
  const radarData = buildRadarData(topicStats);
  const weekComp = getWeekComparison(calendarDots);
  const mostActiveDay = getMostActiveDay(calendarDots);

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";
  const lastLogin = recentEvents[0]?.createdAt
    ? timeAgo(recentEvents[0].createdAt)
    : "—";

  const TABS = [
    "overview",
    "analytics",
    "skills",
    "activity",
    "achievements",
    "engagement",
  ];

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="auth-page-shell">
      <div className="grid-background" />
      <Navbar toggleTheme={toggleTheme} theme={theme} />

      <main className="pd-main">
        {/* ── Hero ── */}
        <section className="pd-hero">
          <div className="pd-hero-left">
            <div className="pd-avatar" aria-hidden="true">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="pd-hero-info">
              <div className="pd-hero-badges-row">
                {streakCurrent >= 3 && (
                  <span className="pd-status-badge pd-status-badge--fire">
                    🔥 {streakCurrent}-day streak
                  </span>
                )}
              </div>
              <h1 className="pd-hero-name">{user?.name || "Learner"}</h1>
              <p className="pd-hero-email">{user?.email}</p>
              <div className="pd-hero-meta">
                <span>Joined {joinDate}</span>
                <span className="pd-dot">·</span>
                <span>Last active {lastLogin}</span>
                <span className="pd-dot">·</span>
                <span
                  className={`pd-role-chip pd-role-chip--${backendOk === false ? "warn" : "ok"}`}
                >
                  {backendOk === null
                    ? "Checking…"
                    : backendOk
                      ? "● Active"
                      : "⚠ Offline"}
                </span>
                <span className="pd-dot">·</span>
                <span className="pd-role-chip pd-role-chip--green">
                  {badges.filter((b) => b.earned).length} badges
                </span>
              </div>
            </div>
          </div>
          <div className="pd-hero-actions">
            <button
              type="button"
              className="pd-btn pd-btn--primary"
              onClick={() => navigate("/boolforge")}
            >
              Circuit Forge
            </button>
          </div>
        </section>

        {/* ── Tabs ── */}
        <nav className="pd-tabs" aria-label="Dashboard sections">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`pd-tab${activeTab === tab ? " pd-tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        {logoutError && <p className="auth-error pd-error">{logoutError}</p>}

        {/* ══════════════ OVERVIEW TAB ══════════════ */}
        {activeTab === "overview" && (
          <div className="pd-section">
            {/* ── Stat cards ── */}
            {loadingProgress ? (
              <div className="pd-stats-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="pd-stat-card pd-stat-card--skeleton">
                    <div className="pd-skeleton pd-skeleton--icon" />
                    <div className="pd-stat-body">
                      <div className="pd-skeleton pd-skeleton--val" />
                      <div className="pd-skeleton pd-skeleton--label" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="pd-stats-grid">
                {/* Row 1 */}
                <StatCard
                  icon="✅"
                  label="Problems Solved"
                  value={solvedCount}
                  sub={
                    summary.totalProblems
                      ? `of ${summary.totalProblems} total`
                      : "keep going!"
                  }
                  accent={COLORS.green}
                />
                <StatCard
                  icon="⚡"
                  label="Attempts Made"
                  value={attemptedCount}
                  sub={
                    solvedCount > 0
                      ? `${Math.round((solvedCount / attemptedCount) * 100)}% solve rate`
                      : "no attempts yet"
                  }
                  accent={COLORS.blue}
                />
                <StatCard
                  icon="📚"
                  label="Topics Completed"
                  value={completedTopics}
                  sub={
                    summary.totalTopics
                      ? `of ${summary.totalTopics} topics`
                      : "modules finished"
                  }
                  accent={COLORS.purple}
                />
                <StatCard
                  icon="🎯"
                  label="Completion Rate"
                  value={`${summary.completionRate || 0}%`}
                  sub={
                    summary.totalProblems
                      ? `${solvedCount} of ${summary.totalProblems} problems`
                      : "problems solved"
                  }
                  accent={COLORS.pink}
                />
                {/* Row 2 */}
                <StatCard
                  icon="🔥"
                  label="Current Streak"
                  value={streakCurrent > 0 ? `${streakCurrent}d` : "0d"}
                  sub={
                    streakCurrent > 0
                      ? `Longest: ${streakLongest}d`
                      : "Start studying today!"
                  }
                  accent={COLORS.amber}
                />
                <StatCard
                  icon="📅"
                  label="Active Days"
                  value={activeDays}
                  sub={
                    activeDays > 0
                      ? `Longest streak: ${streakLongest}d`
                      : "no activity yet"
                  }
                  accent={COLORS.cyan}
                />
                <StatCard
                  icon="📆"
                  label="Most Active Day"
                  value={mostActiveDay}
                  sub="highest activity day"
                  accent={COLORS.indigo}
                />
                <StatCard
                  icon="📊"
                  label="This Week"
                  value={weekComp.thisWeek}
                  sub={
                    weekComp.lastWeek > 0
                      ? `Last week: ${weekComp.lastWeek} · ${weekComp.delta >= 0 ? "▲" : "▼"} ${Math.abs(weekComp.delta)}%`
                      : "actions this week"
                  }
                  accent={COLORS.blue}
                  trend={weekComp.lastWeek > 0 ? weekComp.delta : undefined}
                />
              </div>
            )}

            {/* Learning Tracks */}
            <div className="pd-card pd-card--transparent">
              <h2 className="pd-card-title">Learning Tracks</h2>
              <p className="pd-card-sub">Pick up where you left off</p>
              <div className="pd-tracks-grid">
                <TrackCard
                  trackType="SYNCED TRACK"
                  title="Boolean Algebra"
                  progress={topicStats.booleanAlgebra || 0}
                  lessonsCount={Math.round(
                    ((topicStats.booleanAlgebra || 0) / 100) * 12,
                  )}
                  totalLessons={12}
                  xp={Math.round(
                    ((topicStats.booleanAlgebra || 0) / 100) * 500,
                  )}
                  totalXp={500}
                  streak={streakCurrent}
                  saved={2}
                  nextLesson="Logic Gates Overview"
                  accent={COLORS.blue}
                  link="/boolean/overview"
                />
                <TrackCard
                  trackType="SYNCED TRACK"
                  title="K-Map Simplification"
                  progress={topicStats.kmap || 0}
                  lessonsCount={Math.round(((topicStats.kmap || 0) / 100) * 8)}
                  totalLessons={8}
                  xp={Math.round(((topicStats.kmap || 0) / 100) * 350)}
                  totalXp={350}
                  streak={streakCurrent}
                  saved={0}
                  nextLesson="Grouping Rules"
                  accent={COLORS.purple}
                  link="/kmapgenerator"
                />
                <TrackCard
                  trackType="SYNCED TRACK"
                  title="Sequential Circuits"
                  progress={topicStats.sequential || 0}
                  lessonsCount={Math.round(
                    ((topicStats.sequential || 0) / 100) * 15,
                  )}
                  totalLessons={15}
                  xp={Math.round(((topicStats.sequential || 0) / 100) * 800)}
                  totalXp={800}
                  streak={streakCurrent}
                  saved={5}
                  nextLesson="Latches vs Flip-Flops"
                  accent={COLORS.green}
                  link="/sequential/intro"
                />
              </div>
            </div>

            <div className="pd-insights-full">
              {/* Performance Insights — full width, rich layout */}
              {loadingProgress ? (
                <div className="pd-card pd-loading">Loading insights…</div>
              ) : (
                <div className="pd-card pd-perf-card">
                  <div className="pd-perf-header">
                    <div>
                      <h2 className="pd-card-title">Performance Insights</h2>
                      <p className="pd-card-sub">A deep look at your learning health</p>
                    </div>
                    <span className={`pd-perf-status ${backendOk ? "pd-perf-status--ok" : "pd-perf-status--warn"}`}>
                      {backendOk === null ? "Checking…" : backendOk ? "● Synced" : "⚠ Offline"}
                    </span>
                  </div>

                  {/* ── Metric rows with bar indicators ── */}
                  <div className="pd-perf-metrics">

                    {/* Accuracy Trend */}
                    <div className="pd-perf-metric">
                      <div className="pd-perf-metric-head">
                        <span className="pd-perf-metric-label">Accuracy Trend</span>
                        <span className={`pd-perf-metric-val ${weekComp.delta >= 0 ? "pd-perf-metric-val--green" : "pd-perf-metric-val--red"}`}>
                          {weekComp.thisWeek === 0 && weekComp.lastWeek === 0
                            ? "No data yet"
                            : weekComp.delta > 0 ? `↑ +${weekComp.delta}% this week`
                            : weekComp.delta < 0 ? `↓ ${weekComp.delta}% this week`
                            : "→ Steady"}
                        </span>
                      </div>
                      <div className="pd-perf-bar-track">
                        <div className="pd-perf-bar-fill" style={{
                          width: `${Math.min(Math.max(50 + weekComp.delta / 2, 5), 100)}%`,
                          background: weekComp.delta >= 0 ? "linear-gradient(90deg,#10b981,#34d399)" : "linear-gradient(90deg,#ef4444,#f87171)"
                        }}/>
                      </div>
                    </div>

                    {/* Strongest Area */}
                    {(() => {
                      const best = Object.entries(topicStats).filter(([,v]) => v > 0).sort((a,b) => b[1]-a[1])[0];
                      return (
                        <div className="pd-perf-metric">
                          <div className="pd-perf-metric-head">
                            <span className="pd-perf-metric-label">Strongest Area</span>
                            <span className="pd-perf-metric-val pd-perf-metric-val--purple">
                              {best ? best[0].replace(/([A-Z])/g," $1").trim() : "—"}{best ? ` · ${best[1]}%` : ""}
                            </span>
                          </div>
                          <div className="pd-perf-bar-track">
                            <div className="pd-perf-bar-fill" style={{ width: `${best?.[1] || 0}%`, background: "linear-gradient(90deg,#8b5cf6,#a78bfa)" }}/>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Needs Attention */}
                    {(() => {
                      const weak = Object.entries(topicStats).filter(([,v]) => v < 100).sort((a,b) => a[1]-b[1])[0];
                      return (
                        <div className="pd-perf-metric">
                          <div className="pd-perf-metric-head">
                            <span className="pd-perf-metric-label">Needs Attention</span>
                            <span className="pd-perf-metric-val pd-perf-metric-val--amber">
                              {weak ? `${weak[0].replace(/([A-Z])/g," $1").trim()} · ${weak[1]}%` : "All strong 🎉"}
                            </span>
                          </div>
                          <div className="pd-perf-bar-track">
                            <div className="pd-perf-bar-fill" style={{ width: `${weak?.[1] || 100}%`, background: "linear-gradient(90deg,#f59e0b,#fbbf24)" }}/>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Topics In Progress */}
                    <div className="pd-perf-metric">
                      <div className="pd-perf-metric-head">
                        <span className="pd-perf-metric-label">Topics In Progress</span>
                        <span className="pd-perf-metric-val pd-perf-metric-val--blue">
                          {topicEntries.filter(([,t]) => t.status === "in_progress").length} active
                        </span>
                      </div>
                      <div className="pd-perf-bar-track">
                        <div className="pd-perf-bar-fill" style={{
                          width: `${Math.min((topicEntries.filter(([,t]) => t.status === "in_progress").length / Math.max(summary.totalTopics || 8, 1)) * 100, 100)}%`,
                          background: "linear-gradient(90deg,#3b82f6,#60a5fa)"
                        }}/>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* ── Account & System Status ── */}
            <div className="pd-card pd-status-card">
              <div className="pd-status-header">
                <div>
                  <h2 className="pd-card-title">Account & System Status</h2>
                  <p className="pd-card-sub">Your session details and connection health</p>
                </div>
                <span className={`pd-status-pill ${backendOk ? "pd-status-pill--ok" : "pd-status-pill--warn"}`}>
                  {backendOk === null ? "⏳ Checking" : backendOk ? "● All Systems Go" : "⚠ Degraded"}
                </span>
              </div>

              <div className="pd-status-grid">
                <div className="pd-status-item">
                  <span className="pd-status-icon pd-status-icon--ok">🔐</span>
                  <div className="pd-status-body">
                    <span className="pd-status-label">Session</span>
                    <span className="pd-status-val pd-status-val--ok">JWT Active</span>
                  </div>
                </div>

                <div className="pd-status-item">
                  <span className={`pd-status-icon ${backendOk ? "pd-status-icon--ok" : "pd-status-icon--warn"}`}>🌐</span>
                  <div className="pd-status-body">
                    <span className="pd-status-label">Backend</span>
                    <span className={`pd-status-val ${backendOk ? "pd-status-val--ok" : "pd-status-val--warn"}`}>
                      {backendOk === null ? "Checking…" : backendOk ? "Connected" : "Offline"}
                    </span>
                  </div>
                </div>

                <div className="pd-status-item">
                  <span className="pd-status-icon pd-status-icon--blue">⏱️</span>
                  <div className="pd-status-body">
                    <span className="pd-status-label">Last Activity</span>
                    <span className="pd-status-val">{lastLogin}</span>
                  </div>
                </div>

                <div className="pd-status-item">
                  <span className="pd-status-icon pd-status-icon--blue">📅</span>
                  <div className="pd-status-body">
                    <span className="pd-status-label">Member Since</span>
                    <span className="pd-status-val">{joinDate}</span>
                  </div>
                </div>

                <div className="pd-status-item">
                  <span className="pd-status-icon pd-status-icon--purple">✉️</span>
                  <div className="pd-status-body">
                    <span className="pd-status-label">Email</span>
                    <span className="pd-status-val pd-status-val--mono">{user?.email}</span>
                  </div>
                </div>

                <div className="pd-status-item">
                  <span className="pd-status-icon pd-status-icon--purple">🎓</span>
                  <div className="pd-status-body">
                    <span className="pd-status-label">Role</span>
                    <span className="pd-status-val pd-status-val--purple">Student</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ══════════════ ANALYTICS TAB ══════════════ */}
        {activeTab === "analytics" && (
          <div className="pd-section">
            {/* Weekly trend line chart */}
            <div className="pd-card">
              <h2 className="pd-card-title">Weekly Learning Trends</h2>
              <p className="pd-card-sub">
                Problems solved and attempted per week
              </p>
              {weeklyTrend.length === 0 ? (
                <p className="pd-empty">
                  No data yet — start learning to see trends!
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart
                    data={weeklyTrend}
                    margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(148,163,184,0.15)"
                    />
                    <XAxis
                      dataKey="week"
                      tick={{ fontSize: 12, fill: "var(--secondary-text)" }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "var(--secondary-text)" }}
                      allowDecimals={false}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "0.82rem" }} />
                    <Line
                      type="monotone"
                      dataKey="solved"
                      stroke={COLORS.green}
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                      name="Solved"
                    />
                    <Line
                      type="monotone"
                      dataKey="attempts"
                      stroke={COLORS.blue}
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                      name="Attempts"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Daily activity bar chart */}
            <div className="pd-two-col">
              <div className="pd-card">
                <h2 className="pd-card-title">Last 7 Days Activity</h2>
                <p className="pd-card-sub">
                  Daily breakdown of learning actions
                </p>
                {dailyActivity.length === 0 ? (
                  <p className="pd-empty">No recent activity.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={dailyActivity}
                      margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(148,163,184,0.15)"
                      />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 12, fill: "var(--secondary-text)" }}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: "var(--secondary-text)" }}
                        allowDecimals={false}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend wrapperStyle={{ fontSize: "0.82rem" }} />
                      <Bar
                        dataKey="solved"
                        fill={COLORS.green}
                        name="Solved"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="attempts"
                        fill={COLORS.blue}
                        name="Attempts"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="topics"
                        fill={COLORS.purple}
                        name="Topics"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Skill radar chart */}
              <div className="pd-card">
                <h2 className="pd-card-title">Skill Radar</h2>
                <p className="pd-card-sub">
                  Completion % across all topic areas
                </p>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart
                    data={radarData}
                    margin={{ top: 8, right: 24, left: 24, bottom: 8 }}
                  >
                    <PolarGrid stroke="rgba(148,163,184,0.2)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fontSize: 11, fill: "var(--secondary-text)" }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fontSize: 10, fill: "var(--secondary-text)" }}
                    />
                    <Radar
                      name="Completion %"
                      dataKey="A"
                      stroke={COLORS.blue}
                      fill={COLORS.blue}
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                    <Tooltip content={<ChartTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Topic completion pie chart */}
            <div className="pd-two-col">
              <div className="pd-card">
                <h2 className="pd-card-title">Topic Completion Ratio</h2>
                <p className="pd-card-sub">
                  Proportion of completion per subject area
                </p>
                {pieData.length === 0 ? (
                  <p className="pd-empty">Start topics to see the breakdown.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                        labelLine={false}
                      >
                        {pieData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `${v}%`} />
                      <Legend wrapperStyle={{ fontSize: "0.82rem" }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Week comparison card */}
              <div className="pd-card">
                <h2 className="pd-card-title">Week-over-Week Comparison</h2>
                <p className="pd-card-sub">Current vs previous 7 days</p>
                <div className="pd-week-compare">
                  <div className="pd-week-col">
                    <span className="pd-week-label">This Week</span>
                    <span className="pd-week-val pd-week-val--blue">
                      {weekComp.thisWeek}
                    </span>
                    <span className="pd-week-sub">actions</span>
                  </div>
                  <div
                    className={`pd-week-delta ${weekComp.delta >= 0 ? "pd-week-delta--up" : "pd-week-delta--down"}`}
                  >
                    {weekComp.delta >= 0 ? "▲" : "▼"} {Math.abs(weekComp.delta)}
                    %
                  </div>
                  <div className="pd-week-col">
                    <span className="pd-week-label">Last Week</span>
                    <span className="pd-week-val">{weekComp.lastWeek}</span>
                    <span className="pd-week-sub">actions</span>
                  </div>
                </div>
                <div className="pd-insight-list" style={{ marginTop: "1rem" }}>
                  <div className="pd-insight-row">
                    <span className="pd-insight-label">Most Active Day</span>
                    <span className="pd-insight-val pd-insight-val--purple">
                      {mostActiveDay}
                    </span>
                  </div>
                  <div className="pd-insight-row">
                    <span className="pd-insight-label">Longest Streak</span>
                    <span className="pd-insight-val pd-insight-val--blue">
                      {streakLongest} days
                    </span>
                  </div>
                  <div className="pd-insight-row">
                    <span className="pd-insight-label">Current Streak</span>
                    <span className="pd-insight-val pd-insight-val--green">
                      {streakCurrent} days 🔥
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ SKILLS TAB ══════════════ */}
        {activeTab === "skills" && (
          <div className="pd-section">
            {/* Topic accuracy bar chart — shown first */}
            <div className="pd-card">
              <h2 className="pd-card-title">Topic-wise Accuracy</h2>
              <p className="pd-card-sub">
                Completion percentage per subject area
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={[
                    { topic: "Boolean", pct: topicStats.booleanAlgebra },
                    { topic: "K-Map", pct: topicStats.kmap },
                    { topic: "Sequential", pct: topicStats.sequential },
                    { topic: "Numbers", pct: topicStats.numberSystems },
                    { topic: "Arithmetic", pct: topicStats.arithmetic },
                  ]}
                  margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148,163,184,0.15)"
                  />
                  <XAxis
                    dataKey="topic"
                    tick={{ fontSize: 12, fill: "var(--secondary-text)" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fill: "var(--secondary-text)" }}
                    unit="%"
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    formatter={(v) => `${v}%`}
                  />
                  <Bar dataKey="pct" name="Completion %" radius={[6, 6, 0, 0]}>
                    {PIE_COLORS.map((c, i) => (
                      <Cell key={i} fill={c} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Cards below the graph */}
            <div className="pd-two-col">
              <div className="pd-card">
                <h2 className="pd-card-title">Skill Progress Tracker</h2>
                <p className="pd-card-sub">
                  Topic completion across all learning areas
                </p>
                <div className="pd-skills-list">
                  <SkillBar
                    label="Boolean Algebra"
                    pct={topicStats.booleanAlgebra}
                    color={COLORS.blue}
                  />
                  <SkillBar
                    label="K-Map Simplification"
                    pct={topicStats.kmap}
                    color={COLORS.purple}
                  />
                  <SkillBar
                    label="Sequential Circuits"
                    pct={topicStats.sequential}
                    color={COLORS.green}
                  />
                  <SkillBar
                    label="Number Systems"
                    pct={topicStats.numberSystems}
                    color={COLORS.amber}
                  />
                  <SkillBar
                    label="Arithmetic Functions"
                    pct={topicStats.arithmetic}
                    color={COLORS.pink}
                  />
                </div>
              </div>

              <div className="pd-card">
                <h2 className="pd-card-title">Topic Breakdown</h2>
                <p className="pd-card-sub">Detailed status per topic</p>
                {topicEntries.length === 0 ? (
                  <p className="pd-empty">
                    No topics started yet. Explore the Problems section!
                  </p>
                ) : (
                  <ul className="pd-topic-list">
                    {topicEntries.slice(0, 10).map(([id, t]) => (
                      <li key={id} className="pd-topic-item">
                        <div className="pd-topic-header">
                          <span className="pd-topic-name">{t.title || id}</span>
                          <span
                            className={`pd-topic-status pd-topic-status--${t.status}`}
                          >
                            {t.status?.replace("_", " ")}
                          </span>
                        </div>
                        <div className="pd-skill-track">
                          <div
                            className="pd-skill-fill"
                            style={{
                              width: `${t.completionPercentage || 0}%`,
                              background:
                                t.status === "completed"
                                  ? COLORS.green
                                  : COLORS.blue,
                            }}
                          />
                        </div>
                        <span className="pd-topic-pct">
                          {t.completionPercentage || 0}%
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ ACTIVITY TAB ══════════════ */}
        {activeTab === "activity" && (
          <div className="pd-section">
            <div className="pd-card">
              <h2 className="pd-card-title">Activity Calendar</h2>
              <p className="pd-card-sub">
                Your learning contributions over the past year
              </p>
              <GithubCalendar
                activityMap={state.activity || {}}
                streakCurrent={streakCurrent}
                streakLongest={streakLongest}
                activeDays={activeDays}
                totalContributions={Object.values(state.activity || {}).reduce(
                  (sum, d) => sum + (d.solved || 0) + (d.attempts || 0) + (d.topicsCompleted || 0),
                  0,
                )}
              />
            </div>

            {/* Timeline view */}
            <div className="pd-card">
              <h2 className="pd-card-title">Learning Timeline</h2>
              <p className="pd-card-sub">Your recent activity, grouped by day</p>
              {loadingProgress ? (
                <div className="pd-loading">Loading…</div>
              ) : recentEvents.length === 0 ? (
                <div className="pd-tl-empty">
                  <span className="pd-tl-empty-icon">🚀</span>
                  <span className="pd-tl-empty-msg">No activity yet</span>
                  <span className="pd-tl-empty-sub">Start solving problems — your history will appear here.</span>
                </div>
              ) : (
                <div className="pd-tl-feed">
                  {(() => {
                    // ── Group by date, deduplicate consecutive identical events ──
                    const grouped = {};
                    recentEvents.forEach((ev) => {
                      const date = ev.createdAt
                        ? new Date(ev.createdAt).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
                        : "Unknown date";
                      if (!grouped[date]) grouped[date] = [];
                      grouped[date].push(ev);
                    });

                    const TYPE_CONFIG = {
                      problem_solved:   { label: "Solved",         icon: "✅", accent: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.25)" },
                      problem_attempted:{ label: "Attempted",      icon: "⚡", accent: "#3b82f6", bg: "rgba(59,130,246,0.10)",  border: "rgba(59,130,246,0.22)" },
                      topic_opened:     { label: "Started topic",  icon: "📖", accent: "#8b5cf6", bg: "rgba(139,92,246,0.10)",  border: "rgba(139,92,246,0.22)" },
                      topic_completed:  { label: "Completed topic", icon: "🏆", accent: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.28)" },
                    };

                    return Object.entries(grouped).map(([date, evs]) => {
                      // Collapse consecutive identical (type + title) into one with a count
                      const collapsed = [];
                      evs.forEach((ev) => {
                        const last = collapsed[collapsed.length - 1];
                        if (last && last.type === ev.type && last.title === ev.title) {
                          last.count += 1;
                        } else {
                          collapsed.push({ ...ev, count: 1 });
                        }
                      });

                      return (
                        <div key={date} className="pd-tl-day">
                          <div className="pd-tl-day-label">
                            <span className="pd-tl-day-dot" />
                            {date}
                          </div>
                          <div className="pd-tl-events">
                            {collapsed.map((ev, i) => {
                              const cfg = TYPE_CONFIG[ev.type] || {
                                label: ev.type, icon: "•", accent: "#94a3b8",
                                bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.18)"
                              };
                              return (
                                <div
                                  key={ev.id || `${ev.type}-${i}`}
                                  className="pd-tl-event"
                                  style={{ "--ev-accent": cfg.accent, "--ev-bg": cfg.bg, "--ev-border": cfg.border }}
                                >
                                  <span className="pd-tl-event-icon">{cfg.icon}</span>
                                  <div className="pd-tl-event-body">
                                    <span className="pd-tl-event-label">{cfg.label}</span>
                                    {ev.title && (
                                      <span className="pd-tl-event-title">{ev.title}</span>
                                    )}
                                  </div>
                                  <div className="pd-tl-event-right">
                                    {ev.count > 1 && (
                                      <span className="pd-tl-event-count">×{ev.count}</span>
                                    )}
                                    <span className="pd-tl-event-time">
                                      {ev.createdAt ? timeAgo(ev.createdAt) : ""}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════ ACHIEVEMENTS TAB ══════════════ */}
        {activeTab === "achievements" && (() => {
          // ── Tier system ──────────────────────────────────────────
          const totalXP = solvedCount * 15 + completedTopics * 25 + streakLongest * 5 + activeDays * 3;
          const TIERS = [
            { name: "Novice",    min: 0,   max: 100,  color: "#94a3b8", icon: "🌱" },
            { name: "Explorer",  min: 100, max: 250,  color: "#3b82f6", icon: "🔭" },
            { name: "Builder",   min: 250, max: 500,  color: "#10b981", icon: "⚙️"  },
            { name: "Architect", min: 500, max: 900,  color: "#f59e0b", icon: "🏛️" },
            { name: "Master",    min: 900, max: 1500, color: "#8b5cf6", icon: "⚡" },
            { name: "Legend",    min: 1500,max: 9999, color: "#ec4899", icon: "🏆" },
          ];
          const currentTier  = TIERS.findLast((t) => totalXP >= t.min) || TIERS[0];
          const nextTier      = TIERS[TIERS.indexOf(currentTier) + 1];
          const tierPct       = nextTier
            ? Math.round(((totalXP - currentTier.min) / (nextTier.min - currentTier.min)) * 100)
            : 100;

          // ── Milestone definitions ────────────────────────────────
          const MILESTONES = [
            {
              id: "first_step",   icon: "👣", label: "First Step",
              desc: "Attempt your very first problem",
              xp: 15, category: "Problems",
              unlocked: attemptedCount >= 1,
              progress: Math.min(attemptedCount, 1), total: 1,
            },
            {
              id: "problem5",     icon: "✅", label: "Problem Solver",
              desc: "Solve 5 problems",
              xp: 75, category: "Problems",
              unlocked: solvedCount >= 5,
              progress: Math.min(solvedCount, 5), total: 5,
            },
            {
              id: "problem20",    icon: "🧩", label: "Logic Craftsman",
              desc: "Solve 20 problems",
              xp: 300, category: "Problems",
              unlocked: solvedCount >= 20,
              progress: Math.min(solvedCount, 20), total: 20,
            },
            {
              id: "problem50",    icon: "🏅", label: "Half-Century",
              desc: "Solve 50 problems",
              xp: 750, category: "Problems",
              unlocked: solvedCount >= 50,
              progress: Math.min(solvedCount, 50), total: 50,
            },
            {
              id: "topic1",       icon: "📖", label: "Knowledge Seeker",
              desc: "Complete your first topic",
              xp: 25, category: "Topics",
              unlocked: completedTopics >= 1,
              progress: Math.min(completedTopics, 1), total: 1,
            },
            {
              id: "topic5",       icon: "📚", label: "Curriculum Runner",
              desc: "Complete 5 topics",
              xp: 125, category: "Topics",
              unlocked: completedTopics >= 5,
              progress: Math.min(completedTopics, 5), total: 5,
            },
            {
              id: "streak3",      icon: "🔥", label: "On Fire",
              desc: "Maintain a 3-day streak",
              xp: 45, category: "Streaks",
              unlocked: streakCurrent >= 3,
              progress: Math.min(streakCurrent, 3), total: 3,
            },
            {
              id: "streak7",      icon: "⚡", label: "Week Warrior",
              desc: "Maintain a 7-day streak",
              xp: 105, category: "Streaks",
              unlocked: streakCurrent >= 7,
              progress: Math.min(streakCurrent, 7), total: 7,
            },
            {
              id: "streak30",     icon: "🌟", label: "Ironclad",
              desc: "Maintain a 30-day streak",
              xp: 450, category: "Streaks",
              unlocked: streakLongest >= 30,
              progress: Math.min(streakLongest, 30), total: 30,
            },
            {
              id: "accuracy100",  icon: "🎯", label: "Perfect Aim",
              desc: "Achieve 100% accuracy session",
              xp: 200, category: "Accuracy",
              unlocked: solvedCount > 0 && solvedCount === attemptedCount,
              progress: solvedCount > 0 ? Math.round((solvedCount / Math.max(attemptedCount,1))*100) : 0,
              total: 100, isPercent: true,
            },
            {
              id: "active20",     icon: "📅", label: "Dedicated",
              desc: "Study on 20 different days",
              xp: 200, category: "Consistency",
              unlocked: activeDays >= 20,
              progress: Math.min(activeDays, 20), total: 20,
            },
          ];

          const earned       = MILESTONES.filter((m) => m.unlocked);
          const inProgress   = MILESTONES.filter((m) => !m.unlocked && m.progress > 0);
          const locked       = MILESTONES.filter((m) => !m.unlocked && m.progress === 0);
          const earnedXP     = earned.reduce((s, m) => s + m.xp, 0);
          const nextUnlock   = inProgress.sort((a,b) => (b.progress/b.total) - (a.progress/a.total))[0]
                                || locked[0];

          const CAT_COLORS = {
            Problems: COLORS.blue, Topics: COLORS.purple,
            Streaks: COLORS.amber, Accuracy: COLORS.green,
            Consistency: COLORS.cyan,
          };

          return (
            <div className="pd-section">

              {/* ── Tier banner ── */}
              <div className="ach-tier-banner" style={{ "--tier-color": currentTier.color }}>
                <div className="ach-tier-left">
                  <span className="ach-tier-icon">{currentTier.icon}</span>
                  <div>
                    <div className="ach-tier-label">Current Rank</div>
                    <div className="ach-tier-name" style={{ color: currentTier.color }}>
                      {currentTier.name}
                    </div>
                  </div>
                </div>

                <div className="ach-tier-center">
                  <div className="ach-tier-xp-row">
                    <span className="ach-tier-xp-val">{totalXP} XP</span>
                    {nextTier && (
                      <span className="ach-tier-xp-next">
                        {nextTier.min - totalXP} XP to {nextTier.icon} {nextTier.name}
                      </span>
                    )}
                  </div>
                  <div className="ach-tier-bar-track">
                    <div
                      className="ach-tier-bar-fill"
                      style={{ width: `${tierPct}%`, background: currentTier.color }}
                    />
                  </div>
                  <div className="ach-tier-bar-labels">
                    <span>{currentTier.name}</span>
                    {nextTier && <span>{nextTier.name}</span>}
                  </div>
                </div>

                <div className="ach-tier-right">
                  <div className="ach-tier-stat">
                    <strong>{earned.length}</strong>
                    <span>Unlocked</span>
                  </div>
                  <div className="ach-tier-divider" />
                  <div className="ach-tier-stat">
                    <strong>{earnedXP}</strong>
                    <span>XP Earned</span>
                  </div>
                  <div className="ach-tier-divider" />
                  <div className="ach-tier-stat">
                    <strong>{TIERS.indexOf(currentTier) + 1}/{TIERS.length}</strong>
                    <span>Tier</span>
                  </div>
                </div>
              </div>

              {/* ── Next unlock spotlight ── */}
              {nextUnlock && (
                <div className="ach-spotlight" style={{ "--spot-color": CAT_COLORS[nextUnlock.category] || COLORS.blue }}>
                  <div className="ach-spotlight-label">🎯 Next Unlock</div>
                  <div className="ach-spotlight-body">
                    <span className="ach-spotlight-icon">{nextUnlock.icon}</span>
                    <div className="ach-spotlight-info">
                      <div className="ach-spotlight-name">{nextUnlock.label}</div>
                      <div className="ach-spotlight-desc">{nextUnlock.desc}</div>
                      <div className="ach-spotlight-bar-wrap">
                        <div className="ach-spotlight-bar-track">
                          <div
                            className="ach-spotlight-bar-fill"
                            style={{
                              width: `${Math.round((nextUnlock.progress / nextUnlock.total) * 100)}%`,
                              background: CAT_COLORS[nextUnlock.category] || COLORS.blue,
                            }}
                          />
                        </div>
                        <span className="ach-spotlight-bar-txt">
                          {nextUnlock.isPercent
                            ? `${nextUnlock.progress}% / 100%`
                            : `${nextUnlock.progress} / ${nextUnlock.total}`}
                        </span>
                      </div>
                    </div>
                    <div className="ach-spotlight-xp">+{nextUnlock.xp} XP</div>
                  </div>
                </div>
              )}

              {/* ── Milestone journey ── */}
              <div className="ach-journey">
                {/* Earned */}
                {earned.length > 0 && (
                  <div className="ach-group">
                    <div className="ach-group-header">
                      <span className="ach-group-dot ach-group-dot--earned" />
                      <span className="ach-group-title">Unlocked ({earned.length})</span>
                    </div>
                    <div className="ach-milestone-grid">
                      {earned.map((m) => (
                        <div key={m.id} className="ach-card ach-card--earned"
                          style={{ "--m-color": CAT_COLORS[m.category] || COLORS.blue }}>
                          <div className="ach-card-glow" />
                          <div className="ach-card-top">
                            <span className="ach-card-icon">{m.icon}</span>
                            <span className="ach-card-cat"
                              style={{ color: CAT_COLORS[m.category], background: `${CAT_COLORS[m.category]}18`, border: `1px solid ${CAT_COLORS[m.category]}30` }}>
                              {m.category}
                            </span>
                          </div>
                          <div className="ach-card-label">{m.label}</div>
                          <div className="ach-card-desc">{m.desc}</div>
                          <div className="ach-card-footer">
                            <span className="ach-card-xp">+{m.xp} XP</span>
                            <span className="ach-card-check">✓</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* In progress */}
                {inProgress.length > 0 && (
                  <div className="ach-group">
                    <div className="ach-group-header">
                      <span className="ach-group-dot ach-group-dot--progress" />
                      <span className="ach-group-title">In Progress ({inProgress.length})</span>
                    </div>
                    <div className="ach-milestone-grid">
                      {inProgress.map((m) => {
                        const pct = Math.round((m.progress / m.total) * 100);
                        return (
                          <div key={m.id} className="ach-card ach-card--progress"
                            style={{ "--m-color": CAT_COLORS[m.category] || COLORS.blue }}>
                            <div className="ach-card-top">
                              <span className="ach-card-icon ach-card-icon--dim">{m.icon}</span>
                              <span className="ach-card-cat"
                                style={{ color: CAT_COLORS[m.category], background: `${CAT_COLORS[m.category]}12`, border: `1px solid ${CAT_COLORS[m.category]}25` }}>
                                {m.category}
                              </span>
                            </div>
                            <div className="ach-card-label">{m.label}</div>
                            <div className="ach-card-desc">{m.desc}</div>
                            <div className="ach-card-progress-wrap">
                              <div className="ach-card-progress-track">
                                <div className="ach-card-progress-fill"
                                  style={{ width: `${pct}%`, background: CAT_COLORS[m.category] }} />
                              </div>
                              <span className="ach-card-progress-txt">
                                {m.isPercent ? `${m.progress}%` : `${m.progress}/${m.total}`}
                              </span>
                            </div>
                            <div className="ach-card-footer">
                              <span className="ach-card-xp ach-card-xp--muted">+{m.xp} XP</span>
                              <span className="ach-card-pct-badge">{pct}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Locked */}
                {locked.length > 0 && (
                  <div className="ach-group">
                    <div className="ach-group-header">
                      <span className="ach-group-dot ach-group-dot--locked" />
                      <span className="ach-group-title">Locked ({locked.length})</span>
                    </div>
                    <div className="ach-milestone-grid">
                      {locked.map((m) => (
                        <div key={m.id} className="ach-card ach-card--locked">
                          <div className="ach-card-top">
                            <span className="ach-card-icon ach-card-icon--locked">🔒</span>
                            <span className="ach-card-cat ach-card-cat--locked">{m.category}</span>
                          </div>
                          <div className="ach-card-label ach-card-label--locked">{m.label}</div>
                          <div className="ach-card-desc ach-card-desc--locked">{m.desc}</div>
                          <div className="ach-card-footer">
                            <span className="ach-card-xp ach-card-xp--locked">+{m.xp} XP</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ══════════════ ENGAGEMENT TAB ══════════════ */}
        {activeTab === "engagement" && (() => {
          const accuracy = solvedCount > 0
            ? Math.round((solvedCount / Math.max(attemptedCount, 1)) * 100)
            : 0;

          const weakestTopic = Object.entries(topicStats)
            .sort((a, b) => a[1] - b[1])[0];
          const weakestLabel = weakestTopic
            ? weakestTopic[0].replace(/([A-Z])/g, " $1").trim()
            : "a new topic";

          const PORTALS = [
            { icon: "⊕", label: "Circuit Forge",    desc: "Build & simulate logic circuits",   path: "/boolforge",                    color: COLORS.blue   },
            { icon: "◈", label: "K-Map Studio",      desc: "Simplify Boolean expressions",      path: "/kmapgenerator",                 color: COLORS.purple },
            { icon: "#", label: "Number Systems",    desc: "Convert & calculate across bases",  path: "/number-systems/calculator",     color: COLORS.green  },
            { icon: "≡", label: "Flip-Flops",        desc: "Sequential circuit deep dive",      path: "/sequential/flip-flops",         color: COLORS.amber  },
            { icon: "∿", label: "Timing Diagrams",   desc: "Visualise signal propagation",      path: "/timing-diagrams",               color: COLORS.cyan   },
            { icon: "✦", label: "Problems",          desc: "Practice & reinforce concepts",     path: "/problems",                      color: COLORS.pink   },
          ];

          const SIGNAL_TOPICS = [
            { label: "Boolean",    pct: topicStats.booleanAlgebra, color: COLORS.blue   },
            { label: "K-Map",      pct: topicStats.kmap,           color: COLORS.purple },
            { label: "Sequential", pct: topicStats.sequential,     color: COLORS.green  },
            { label: "Numbers",    pct: topicStats.numberSystems,  color: COLORS.amber  },
            { label: "Arithmetic", pct: topicStats.arithmetic,     color: COLORS.pink   },
          ];

          const STUDY_PLAN = [
            {
              phase: "01", label: "Warm Up",
              task: `Review ${weakestLabel} for 5 min`,
              icon: "🔥", color: COLORS.amber, done: activeDays > 0,
            },
            {
              phase: "02", label: "Solve",
              task: `Attempt ${Math.max(1, 5 - (solvedCount % 5))} new problem${Math.max(1, 5 - (solvedCount % 5)) > 1 ? "s" : ""}`,
              icon: "🎯", color: COLORS.blue, done: solvedCount > 0,
            },
            {
              phase: "03", label: "Explore",
              task: completedTopics < 3 ? "Open an unvisited topic" : "Revisit a completed topic",
              icon: "📖", color: COLORS.purple, done: completedTopics > 0,
            },
            {
              phase: "04", label: "Reflect",
              task: "Check your Skill tab — spot any gaps",
              icon: "🔬", color: COLORS.green, done: false,
            },
          ];

          return (
            <div className="pd-section">

              {/* ── Status strip ── */}
              <div className="eng-status-strip">
                {[
                  { label: "Active Days",     value: activeDays,          icon: "📅", color: COLORS.blue   },
                  { label: "Current Streak",  value: `${streakCurrent}d`, icon: "🔥", color: COLORS.amber  },
                  { label: "Best Streak",     value: `${streakLongest}d`, icon: "⚡", color: COLORS.purple },
                  { label: "Accuracy",        value: accuracy > 0 ? `${accuracy}%` : "—", icon: "🎯", color: COLORS.green  },
                  { label: "Problems Solved", value: solvedCount,          icon: "✅", color: COLORS.cyan   },
                ].map((s) => (
                  <div key={s.label} className="eng-status-pill" style={{ "--pill-color": s.color }}>
                    <span className="eng-status-icon">{s.icon}</span>
                    <span className="eng-status-val">{s.value}</span>
                    <span className="eng-status-label">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* ── Main grid: signal + study plan ── */}
              <div className="eng-main-grid">

                {/* Signal strength panel */}
                <div className="eng-panel eng-signal-panel">
                  <div className="eng-panel-header">
                    <div className="eng-panel-dot" style={{ background: COLORS.green }} />
                    <h2 className="eng-panel-title">Topic Signal Strength</h2>
                  </div>
                  <p className="eng-panel-sub">How strong is your coverage in each area?</p>
                  <div className="eng-signals">
                    {SIGNAL_TOPICS.map((t) => {
                      const bars = 5;
                      const filled = Math.round((t.pct / 100) * bars);
                      return (
                        <div key={t.label} className="eng-signal-row">
                          <span className="eng-signal-label">{t.label}</span>
                          <div className="eng-signal-bars">
                            {Array.from({ length: bars }).map((_, i) => (
                              <div
                                key={i}
                                className="eng-signal-bar"
                                style={{
                                  background: i < filled ? t.color : "rgba(148,163,184,0.12)",
                                  height: `${10 + i * 4}px`,
                                  opacity: i < filled ? 1 : 0.35,
                                  boxShadow: i < filled ? `0 0 6px ${t.color}` : "none",
                                }}
                              />
                            ))}
                          </div>
                          <span className="eng-signal-pct" style={{ color: t.color }}>
                            {t.pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Today's study plan */}
                <div className="eng-panel eng-plan-panel">
                  <div className="eng-panel-header">
                    <div className="eng-panel-dot" style={{ background: COLORS.amber }} />
                    <h2 className="eng-panel-title">Today's Study Plan</h2>
                  </div>
                  <p className="eng-panel-sub">A focused 4-step session for today</p>
                  <div className="eng-plan-steps">
                    {STUDY_PLAN.map((step) => (
                      <div
                        key={step.phase}
                        className={`eng-step${step.done ? " eng-step--done" : ""}`}
                        style={{ "--step-color": step.color }}
                      >
                        <div className="eng-step-phase">{step.phase}</div>
                        <div className="eng-step-body">
                          <div className="eng-step-top">
                            <span className="eng-step-icon">{step.icon}</span>
                            <span className="eng-step-label">{step.label}</span>
                            {step.done && <span className="eng-step-tick">✓</span>}
                          </div>
                          <p className="eng-step-task">{step.task}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Tool portals ── */}
              <div className="eng-portals-wrap">
                <div className="eng-portals-header">
                  <h2 className="eng-section-title">Quick Launch</h2>
                  <p className="eng-section-sub">Jump straight into any tool</p>
                </div>
                <div className="eng-portals-grid">
                  {PORTALS.map((p) => (
                    <Link key={p.path} to={p.path} className="eng-portal" style={{ "--portal-color": p.color }}>
                      <div className="eng-portal-glow" />
                      <span className="eng-portal-icon">{p.icon}</span>
                      <span className="eng-portal-label">{p.label}</span>
                      <span className="eng-portal-desc">{p.desc}</span>
                      <span className="eng-portal-arrow">→</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* ── Feedback terminal ── */}
              <div className="eng-terminal">
                <div className="eng-terminal-bar">
                  <span className="eng-terminal-dot eng-terminal-dot--red" />
                  <span className="eng-terminal-dot eng-terminal-dot--amber" />
                  <span className="eng-terminal-dot eng-terminal-dot--green" />
                  <span className="eng-terminal-title">feedback.exe</span>
                </div>
                <div className="eng-terminal-body">
                  <p className="eng-terminal-prompt">
                    <span className="eng-terminal-chevron">&gt;</span> Rate your learning experience
                  </p>
                  {feedbackDone ? (
                    <div className="eng-terminal-thanks">
                      <span className="eng-terminal-ok">[OK]</span> Thank you — your feedback helps us improve Boolforge.
                    </div>
                  ) : (
                    <FeedbackWidget
                      onSubmit={() => {
                        localStorage.setItem(`pd_feedback_${user?.id || user?.email}`, "1");
                        setFeedbackDone(true);
                      }}
                    />
                  )}
                </div>
              </div>

            </div>
          );
        })()}

      </main>
      <Footer />
    </div>
  );
}
