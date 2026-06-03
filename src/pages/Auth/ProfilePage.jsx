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

function Badge({ icon, title, desc, earned, progress, rarity }) {
  const getRarityColor = (r) => {
    switch (r) {
      case "legendary":
        return "#f59e0b";
      case "epic":
        return "#a855f7";
      case "rare":
        return "#3b82f6";
      default:
        return "#10b981";
    }
  };

  const accent = getRarityColor(rarity);

  return (
    <div
      className={`pd-badge-premium ${earned ? "pd-badge-premium--earned" : "pd-badge-premium--locked"}`}
      style={{ "--badge-accent": accent }}
    >
      <div className="pd-badge-premium-glow"></div>
      <div className="pd-badge-premium-icon-ring">
        <div className="pd-badge-premium-icon">{icon}</div>
      </div>
      <div className="pd-badge-premium-content">
        <div className="pd-badge-premium-header">
          <h3 className="pd-badge-premium-title">{title}</h3>
          {rarity && (
            <span
              className="pd-badge-premium-rarity"
              style={{
                color: accent,
                border: `1px solid ${accent}40`,
                background: `${accent}15`,
              }}
            >
              {rarity}
            </span>
          )}
        </div>
        <p className="pd-badge-premium-desc">{desc}</p>
        <div className="pd-badge-premium-progress-wrapper">
          <div className="pd-badge-premium-progress-bar">
            <div
              className="pd-badge-premium-progress-fill"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: accent,
              }}
            ></div>
          </div>
          <span className="pd-badge-premium-progress-text">
            {earned ? "Completed" : `${Math.min(progress, 100)}%`}
          </span>
        </div>
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

            {/* Topic accuracy bar chart */}
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
        {activeTab === "achievements" && (
          <div className="pd-section">
            {/* Summary row */}
            <div className="pd-stats-grid">
              <StatCard
                icon="🏅"
                label="Badges Earned"
                value={badges.filter((b) => b.earned).length}
                sub={`of ${badges.length} total`}
                accent={COLORS.amber}
              />
              <StatCard
                icon="🌟"
                label="Legendary"
                value={
                  badges.filter((b) => b.earned && b.rarity === "legendary")
                    .length
                }
                sub="legendary badges"
                accent={COLORS.purple}
              />
              <StatCard
                icon="💎"
                label="Epic"
                value={
                  badges.filter((b) => b.earned && b.rarity === "epic").length
                }
                sub="epic badges"
                accent={COLORS.blue}
              />
              <StatCard
                icon="🔥"
                label="Streak Record"
                value={`${streakLongest}d`}
                sub="longest streak"
                accent={COLORS.amber}
              />
            </div>

            <div className="pd-card pd-card--transparent">
              <div className="pd-achievements-header">
                <h2 className="pd-card-title">Trophy Cabinet</h2>
                <p className="pd-card-sub">
                  Your earned accolades and progress toward new ranks
                </p>
              </div>
              <div className="pd-badges-premium-grid">
                {badges.map((b) => (
                  <Badge key={b.title} {...b} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ ENGAGEMENT TAB ══════════════ */}
        {activeTab === "engagement" && (
          <div className="pd-section">
            {/* ── Top KPI row ── */}
            <div className="pd-stats-grid">
              <StatCard
                icon="📅"
                label="Active Days"
                value={activeDays}
                sub="total days studied"
                accent={COLORS.blue}
              />
              <StatCard
                icon="🔥"
                label="Current Streak"
                value={`${streakCurrent}d`}
                sub={`Best: ${streakLongest}d`}
                accent={COLORS.amber}
              />
              <StatCard
                icon="🏅"
                label="Badges Earned"
                value={badges.filter((b) => b.earned).length}
                sub={`of ${badges.length} total`}
                accent={COLORS.purple}
              />
              <StatCard
                icon="🎯"
                label="Accuracy"
                value={
                  solvedCount > 0
                    ? `${Math.round((solvedCount / Math.max(attemptedCount, 1)) * 100)}%`
                    : "—"
                }
                sub="solve rate"
                accent={COLORS.green}
              />
            </div>

            {/* ── Learning Tips — expressive bullet list (first) ── */}
            <div className="pd-card pd-tips-card">
              <div className="pd-tips-header">
                <div>
                  <h2 className="pd-card-title">Learning Tips</h2>
                  <p className="pd-card-sub">Personalised suggestions based on your progress</p>
                </div>
                <span className="pd-tips-badge">✨ For You</span>
              </div>

              <div className="pd-tips-list">
                {[
                  {
                    icon: "💡",
                    color: COLORS.amber,
                    number: "01",
                    title: "Spaced Repetition",
                    tip: "Review topics you completed more than 3 days ago. Your brain retains information far better when you revisit it at increasing intervals.",
                    action: "Go to Problems",
                    path: "/problems",
                    tag: "Memory",
                  },
                  {
                    icon: "🔥",
                    color: COLORS.blue,
                    number: "02",
                    title: streakCurrent > 0 ? `Keep your ${streakCurrent}-day streak alive` : "Build a daily habit",
                    tip: streakCurrent > 0
                      ? `You're ${streakCurrent} days in. Even one problem today locks in your streak and compounds your progress over time.`
                      : "Study every day — even 10 minutes. Consistency compounds. The first week is the hardest.",
                    action: "Study Now",
                    path: "/problems",
                    tag: "Habit",
                  },
                  {
                    icon: "🎯",
                    color: COLORS.purple,
                    number: "03",
                    title: "Strengthen Your Weakest Area",
                    tip: `Your least-explored topic is ${
                      Object.entries(topicStats).sort((a,b) => a[1]-b[1])[0]?.[0]?.replace(/([A-Z])/g," $1").trim() || "unknown"
                    }. Closing that gap will round out your digital logic foundation and boost your overall score.`,
                    action: "Explore Topics",
                    path: "/problems",
                    tag: "Weakness",
                  },
                  {
                    icon: "⚡",
                    color: COLORS.green,
                    number: "04",
                    title: "Chase the Next Milestone",
                    tip: `You've solved ${solvedCount} problem${solvedCount !== 1 ? "s" : ""}. Your next milestone is ${Math.ceil((solvedCount + 1) / 5) * 5}. Each problem you solve increases your acceptance rate and unlocks harder challenges.`,
                    action: "Solve Problems",
                    path: "/problems",
                    tag: "Progress",
                  },
                  {
                    icon: "🧠",
                    color: COLORS.pink,
                    number: "05",
                    title: "Connect Concepts, Don't Memorise",
                    tip: "Digital logic builds on itself. When you understand why a K-Map works, Boolean simplification becomes intuitive. Focus on the why, not just the how.",
                    action: "Open K-Map",
                    path: "/kmapgenerator",
                    tag: "Mindset",
                  },
                ].map((tip, i) => (
                  <div key={tip.number} className="pd-tip-row" style={{ "--tip-color": tip.color }}>
                    <div className="pd-tip-number">{tip.number}</div>
                    <div className="pd-tip-content">
                      <div className="pd-tip-top">
                        <span className="pd-tip-icon">{tip.icon}</span>
                        <span className="pd-tip-title">{tip.title}</span>
                        <span className="pd-tip-tag" style={{ color: tip.color, background: `${tip.color}18`, border: `1px solid ${tip.color}30` }}>{tip.tag}</span>
                      </div>
                      <p className="pd-tip-text">{tip.tip}</p>
                      <Link to={tip.path} className="pd-tip-cta" style={{ color: tip.color }}>
                        {tip.action} <span className="pd-tip-arrow">→</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Notifications + Feedback side by side (second) ── */}
            <div className="pd-two-col">
              {/* Daily Quests */}
              <div className="pd-card">
                <div className="pd-eng-card-header">
                  <div>
                    <h2 className="pd-card-title">Daily Quests</h2>
                    <p className="pd-card-sub" style={{ margin: 0 }}>
                      Complete quests to earn bonus XP
                    </p>
                  </div>
                  <span
                    className="pd-eng-notif-count"
                    style={{ background: COLORS.amber }}
                  >
                    3
                  </span>
                </div>
                <ul className="pd-eng-notif-list">
                  <li className="pd-eng-notif-item pd-eng-notif-item--achievement">
                    <div className="pd-eng-notif-icon-wrap">
                      <span className="pd-eng-notif-icon">🔥</span>
                    </div>
                    <div className="pd-eng-notif-body">
                      <span className="pd-eng-notif-msg">
                        Maintain a 3-day streak
                      </span>
                      <span className="pd-eng-notif-time">
                        {streakCurrent}/3 Days
                      </span>
                    </div>
                  </li>
                  <li className="pd-eng-notif-item pd-eng-notif-item--info">
                    <div className="pd-eng-notif-icon-wrap">
                      <span className="pd-eng-notif-icon">🎯</span>
                    </div>
                    <div className="pd-eng-notif-body">
                      <span className="pd-eng-notif-msg">Solve 5 problems</span>
                      <span className="pd-eng-notif-time">
                        {Math.min(solvedCount, 5)}/5 Solved
                      </span>
                    </div>
                  </li>
                  <li className="pd-eng-notif-item pd-eng-notif-item--badge">
                    <div className="pd-eng-notif-icon-wrap">
                      <span className="pd-eng-notif-icon">📚</span>
                    </div>
                    <div className="pd-eng-notif-body">
                      <span className="pd-eng-notif-msg">
                        Start a new topic
                      </span>
                      <span className="pd-eng-notif-time">0/1 Completed</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Feedback widget */}
              <div className="pd-card">
                <div className="pd-eng-card-header">
                  <div>
                    <h2 className="pd-card-title">Rate Your Experience</h2>
                    <p className="pd-card-sub" style={{ margin: 0 }}>
                      Help us improve the platform
                    </p>
                  </div>
                  <span className="pd-eng-feedback-badge">Feedback</span>
                </div>
                {feedbackDone ? (
                  <div className="pd-eng-feedback-done">
                    <div className="pd-eng-feedback-done-icon">🙏</div>
                    <span className="pd-eng-feedback-done-title">
                      Thank you!
                    </span>
                    <span className="pd-eng-feedback-done-sub">
                      Your feedback helps us build a better learning experience.
                    </span>
                  </div>
                ) : (
                  <FeedbackWidget
                    onSubmit={({ rating, comment }) => {
                      localStorage.setItem(
                        `pd_feedback_${user?.id || user?.email}`,
                        "1",
                      );
                      setFeedbackDone(true);
                    }}
                  />
                )}
              </div>
            </div>

            {/* ── Skill Mastery Showcase ── */}
            <div className="pd-card pd-card--transparent pd-mastery-container">
              <h2 className="pd-card-title">Skill Specializations</h2>
              <p className="pd-card-sub">
                Professional credentials earned through topic mastery
              </p>
              <div className="pd-cert-grid">
                {[
                  {
                    id: "cert-boolean",
                    title: "Boolean Architect",
                    level: "Intermediate",
                    icon: "⚡",
                    color: COLORS.blue,
                    progress: topicStats.booleanAlgebra || 0,
                    unlocked: (topicStats.booleanAlgebra || 0) >= 100,
                  },
                  {
                    id: "cert-kmap",
                    title: "K-Map Master",
                    level: "Advanced",
                    icon: "🗺️",
                    color: COLORS.purple,
                    progress: topicStats.kmap || 0,
                    unlocked: (topicStats.kmap || 0) >= 100,
                  },
                  {
                    id: "cert-seq",
                    title: "Sequential Systems",
                    level: "Expert",
                    icon: "⏱️",
                    color: COLORS.green,
                    progress: topicStats.sequential || 0,
                    unlocked: (topicStats.sequential || 0) >= 100,
                  },
                ].map((cert) => (
                  <div
                    key={cert.id}
                    className={`pd-cert-card ${cert.unlocked ? "pd-cert-card--unlocked" : "pd-cert-card--locked"}`}
                    style={{ "--cert-color": cert.color }}
                  >
                    <div className="pd-cert-glow"></div>
                    <div className="pd-cert-seal">{cert.icon}</div>
                    <div className="pd-cert-content">
                      <span className="pd-cert-level">{cert.level}</span>
                      <h3 className="pd-cert-title">{cert.title}</h3>
                      <div className="pd-cert-progress-wrapper">
                        <div className="pd-cert-progress-bar">
                          <div
                            className="pd-cert-progress-fill"
                            style={{
                              width: `${cert.progress}%`,
                              background: cert.color,
                            }}
                          ></div>
                        </div>
                        <span className="pd-cert-progress-text">
                          {cert.unlocked ? "Certified" : `${cert.progress}%`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
