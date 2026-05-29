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

function ActivityDot({ intensity, date }) {
  const labels = ["No activity", "Low", "Medium", "High", "Very high"];
  return (
    <div
      className={`pd-cal-dot pd-cal-dot--${intensity}`}
      title={`${date}: ${labels[intensity] || "No activity"}`}
    />
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

// ─── Event meta ───────────────────────────────────────────────────────────────
const EVENT_META = {
  problem_solved: { label: "Solved a problem", color: COLORS.green, icon: "✓" },
  problem_attempted: {
    label: "Attempted a problem",
    color: COLORS.blue,
    icon: "⚡",
  },
  topic_opened: { label: "Started a topic", color: COLORS.purple, icon: "📖" },
  topic_completed: {
    label: "Completed a topic",
    color: COLORS.amber,
    icon: "🏆",
  },
};

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
    "saved",
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

            <div className="pd-two-col">
              {/* Performance Insights */}
              <div className="pd-card">
                <h2 className="pd-card-title">Performance Insights</h2>
                {loadingProgress ? (
                  <div className="pd-loading">Loading insights…</div>
                ) : (
                  <div className="pd-insight-list">
                    <div className="pd-insight-row">
                      <span className="pd-insight-label">Solve Rate</span>
                      <span className="pd-insight-val pd-insight-val--blue">
                        {attemptedCount > 0
                          ? `${Math.round((solvedCount / attemptedCount) * 100)}%`
                          : "—"}
                      </span>
                    </div>
                    <div className="pd-insight-row">
                      <span className="pd-insight-label">Accuracy Trend</span>
                      <span
                        className={`pd-insight-val ${weekComp.delta >= 0 ? "pd-insight-val--green" : "pd-insight-val--amber"}`}
                      >
                        {weekComp.thisWeek === 0 && weekComp.lastWeek === 0
                          ? "—"
                          : weekComp.delta > 0
                            ? `↑ +${weekComp.delta}% vs last week`
                            : weekComp.delta < 0
                              ? `↓ ${weekComp.delta}% vs last week`
                              : "→ Same as last week"}
                      </span>
                    </div>
                    <div className="pd-insight-row">
                      <span className="pd-insight-label">Strongest Area</span>
                      <span className="pd-insight-val pd-insight-val--purple">
                        {Object.entries(topicStats)
                          .filter(([, v]) => v > 0)
                          .sort((a, b) => b[1] - a[1])[0]
                          ? Object.entries(topicStats)
                              .filter(([, v]) => v > 0)
                              .sort((a, b) => b[1] - a[1])[0][0]
                              .replace(/([A-Z])/g, " $1")
                              .trim()
                          : "—"}
                      </span>
                    </div>
                    <div className="pd-insight-row">
                      <span className="pd-insight-label">Needs Attention</span>
                      <span className="pd-insight-val pd-insight-val--amber">
                        {Object.entries(topicStats)
                          .filter(([, v]) => v < 100)
                          .sort((a, b) => a[1] - b[1])[0]
                          ? Object.entries(topicStats)
                              .filter(([, v]) => v < 100)
                              .sort((a, b) => a[1] - b[1])[0][0]
                              .replace(/([A-Z])/g, " $1")
                              .trim()
                          : "All areas strong 🎉"}
                      </span>
                    </div>
                    <div className="pd-insight-row">
                      <span className="pd-insight-label">
                        Topics In Progress
                      </span>
                      <span className="pd-insight-val pd-insight-val--blue">
                        {
                          topicEntries.filter(
                            ([, t]) => t.status === "in_progress",
                          ).length
                        }
                      </span>
                    </div>
                    <div className="pd-insight-row">
                      <span className="pd-insight-label">Longest Streak</span>
                      <span className="pd-insight-val pd-insight-val--green">
                        {streakLongest > 0 ? `${streakLongest} days` : "—"}
                      </span>
                    </div>
                    <div className="pd-insight-row">
                      <span className="pd-insight-label">Backend</span>
                      <span
                        className={`pd-insight-val ${backendOk ? "pd-insight-val--green" : "pd-insight-val--amber"}`}
                      >
                        {backendOk === null
                          ? "Checking…"
                          : backendOk
                            ? "● Connected"
                            : "⚠ Offline"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Activity Feed */}
              <div className="pd-card">
                <h2 className="pd-card-title">Recent Activity</h2>
                {loadingProgress ? (
                  <div className="pd-loading">Loading activity…</div>
                ) : recentEvents.length === 0 ? (
                  <div className="pd-overview-empty">
                    <span className="pd-overview-empty-icon">🚀</span>
                    <span className="pd-overview-empty-msg">
                      No activity yet
                    </span>
                    <span className="pd-overview-empty-sub">
                      Start solving problems to see your activity here.
                    </span>
                    <Link
                      to="/problems"
                      className="pd-btn pd-btn--primary pd-btn--sm"
                      style={{ marginTop: "0.5rem" }}
                    >
                      Go to Problems →
                    </Link>
                  </div>
                ) : (
                  <ul className="pd-feed">
                    {recentEvents.slice(0, 8).map((ev) => {
                      const meta = EVENT_META[ev.type] || {
                        label: ev.type,
                        color: "#94a3b8",
                        icon: "•",
                      };
                      return (
                        <li
                          key={ev.id || ev.createdAt}
                          className="pd-feed-item"
                        >
                          <span
                            className="pd-feed-dot"
                            style={{ background: meta.color }}
                          >
                            {meta.icon}
                          </span>
                          <div className="pd-feed-body">
                            <span className="pd-feed-label">{meta.label}</span>
                            {ev.title && (
                              <span className="pd-feed-title">
                                "{ev.title}"
                              </span>
                            )}
                          </div>
                          <span className="pd-feed-time">
                            {timeAgo(ev.createdAt)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
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
                Your learning activity over the past month
              </p>
              <div className="pd-cal-legend">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className={`pd-cal-dot pd-cal-dot--${i}`} />
                ))}
                <span>More</span>
              </div>
              <div className="pd-cal-grid">
                {calendarDots.map((day) => (
                  <ActivityDot
                    key={day.date}
                    intensity={day.intensity}
                    date={day.date}
                  />
                ))}
              </div>
              <div className="pd-cal-stats">
                <span>
                  🔥 Current streak: <strong>{streakCurrent} days</strong>
                </span>
                <span>
                  🏆 Longest streak: <strong>{streakLongest} days</strong>
                </span>
                <span>
                  📅 Active days: <strong>{activeDays}</strong>
                </span>
                <span>
                  📆 Most active: <strong>{mostActiveDay}</strong>
                </span>
              </div>
            </div>

            {/* Timeline view */}
            <div className="pd-card">
              <h2 className="pd-card-title">Learning Timeline</h2>
              <p className="pd-card-sub">
                Your activity history in chronological order
              </p>
              {loadingProgress ? (
                <div className="pd-loading">Loading…</div>
              ) : recentEvents.length === 0 ? (
                <p className="pd-empty">No activity recorded yet.</p>
              ) : (
                <div className="pd-timeline">
                  {recentEvents.map((ev, idx) => {
                    const meta = EVENT_META[ev.type] || {
                      label: ev.type,
                      color: "#94a3b8",
                      icon: "•",
                    };
                    return (
                      <div
                        key={ev.id || ev.createdAt}
                        className="pd-timeline-item"
                      >
                        <div
                          className="pd-timeline-line"
                          style={{
                            background:
                              idx === recentEvents.length - 1
                                ? "transparent"
                                : "var(--border-color)",
                          }}
                        />
                        <div
                          className="pd-timeline-dot"
                          style={{ background: meta.color }}
                        >
                          {meta.icon}
                        </div>
                        <div className="pd-timeline-content">
                          <span className="pd-timeline-label">
                            {meta.label}
                          </span>
                          {ev.title && (
                            <span className="pd-timeline-title">
                              "{ev.title}"
                            </span>
                          )}
                          <span className="pd-timeline-time">
                            {timeAgo(ev.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
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

            {/* ── Notifications + Feedback side by side ── */}
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

            {/* ── Learning tips ── */}
            <div className="pd-card">
              <h2 className="pd-card-title">Learning Tips</h2>
              <p className="pd-card-sub">
                Personalised suggestions based on your progress
              </p>
              <div className="pd-eng-tips-grid">
                {[
                  {
                    icon: "💡",
                    color: COLORS.amber,
                    title: "Spaced Repetition",
                    tip: "Review topics you completed more than 3 days ago to reinforce memory retention.",
                    action: "Go to Problems",
                    path: "/problems",
                  },
                  {
                    icon: "🎯",
                    color: COLORS.blue,
                    title:
                      streakCurrent > 0
                        ? `Keep your ${streakCurrent}-day streak!`
                        : "Start a streak",
                    tip:
                      streakCurrent > 0
                        ? "You're on a roll. Study at least one topic today to maintain momentum."
                        : "Study every day to build a streak. Even 10 minutes counts!",
                    action: "Study Now",
                    path: "/problems",
                  },
                  {
                    icon: "🔬",
                    color: COLORS.purple,
                    title: "Weakest Area",
                    tip: `Focus on ${
                      Object.entries(topicStats)
                        .sort((a, b) => a[1] - b[1])[0]?.[0]
                        ?.replace(/([A-Z])/g, " $1")
                        .trim() || "your weakest topic"
                    } to balance your skill profile.`,
                    action: "Explore Topics",
                    path: "/problems",
                  },
                  {
                    icon: "⚡",
                    color: COLORS.green,
                    title: "Practice Makes Perfect",
                    tip: `You've solved ${solvedCount} problem${solvedCount !== 1 ? "s" : ""}. Aim for ${Math.ceil((solvedCount + 1) / 5) * 5} to unlock the next milestone.`,
                    action: "Solve Problems",
                    path: "/problems",
                  },
                ].map((tip) => (
                  <div
                    key={tip.title}
                    className="pd-eng-tip-card"
                    style={{ "--tip-color": tip.color }}
                  >
                    <div className="pd-eng-tip-icon">{tip.icon}</div>
                    <div className="pd-eng-tip-body">
                      <span className="pd-eng-tip-title">{tip.title}</span>
                      <span className="pd-eng-tip-text">{tip.tip}</span>
                    </div>
                    <Link to={tip.path} className="pd-eng-tip-action">
                      {tip.action} →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ SAVED TAB ══════════════ */}
        {activeTab === "saved" && (
          <div className="pd-section">
            <div className="pd-card">
              <div className="pd-saved-header">
                <h2 className="pd-card-title">Saved Work</h2>
                <div className="pd-saved-actions">
                  <button
                    type="button"
                    className="pd-btn pd-btn--primary pd-btn--sm"
                    onClick={() => navigate("/boolforge")}
                  >
                    + New Circuit
                  </button>
                  <button
                    type="button"
                    className="pd-btn pd-btn--ghost pd-btn--sm"
                    onClick={() => navigate("/kmapgenerator")}
                  >
                    + New K-Map
                  </button>
                </div>
              </div>
              <div className="pd-saved-grid">
                <div
                  className="pd-saved-card"
                  onClick={() => navigate("/boolforge")}
                >
                  <div className="pd-saved-thumb pd-saved-thumb--circuit">
                    <span>⚡</span>
                  </div>
                  <div className="pd-saved-info">
                    <span className="pd-saved-name">Circuit Forge</span>
                    <span className="pd-saved-type">Logic circuit builder</span>
                  </div>
                  <button
                    type="button"
                    className="pd-btn pd-btn--ghost pd-btn--sm"
                  >
                    Open
                  </button>
                </div>
                <div
                  className="pd-saved-card"
                  onClick={() => navigate("/kmapgenerator")}
                >
                  <div className="pd-saved-thumb pd-saved-thumb--kmap">
                    <span>🗺️</span>
                  </div>
                  <div className="pd-saved-info">
                    <span className="pd-saved-name">K-Map Studio</span>
                    <span className="pd-saved-type">
                      Karnaugh map simplifier
                    </span>
                  </div>
                  <button
                    type="button"
                    className="pd-btn pd-btn--ghost pd-btn--sm"
                  >
                    Open
                  </button>
                </div>
                <div
                  className="pd-saved-card"
                  onClick={() => navigate("/problems")}
                >
                  <div className="pd-saved-thumb pd-saved-thumb--problems">
                    <span>📝</span>
                  </div>
                  <div className="pd-saved-info">
                    <span className="pd-saved-name">Problem Sets</span>
                    <span className="pd-saved-type">
                      {solvedCount} solved · {attemptedCount} attempted
                    </span>
                  </div>
                  <button
                    type="button"
                    className="pd-btn pd-btn--ghost pd-btn--sm"
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>

            <div className="pd-card">
              <h2 className="pd-card-title">System Status</h2>
              <div className="pd-sys-grid">
                <div className="pd-sys-row">
                  <span className="pd-sys-label">Session</span>
                  <span className="pd-sys-val pd-sys-val--ok">JWT Active</span>
                </div>
                <div className="pd-sys-row">
                  <span className="pd-sys-label">Backend Connection</span>
                  <span
                    className={`pd-sys-val ${backendOk ? "pd-sys-val--ok" : "pd-sys-val--warn"}`}
                  >
                    {backendOk === null
                      ? "Checking…"
                      : backendOk
                        ? "Connected"
                        : "Offline"}
                  </span>
                </div>
                <div className="pd-sys-row">
                  <span className="pd-sys-label">Last Activity</span>
                  <span className="pd-sys-val">{lastLogin}</span>
                </div>
                <div className="pd-sys-row">
                  <span className="pd-sys-label">Account Created</span>
                  <span className="pd-sys-val">{joinDate}</span>
                </div>
                <div className="pd-sys-row">
                  <span className="pd-sys-label">Email</span>
                  <span className="pd-sys-val">{user?.email}</span>
                </div>
                <div className="pd-sys-row">
                  <span className="pd-sys-label">Role</span>
                  <span className="pd-sys-val">Student</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
