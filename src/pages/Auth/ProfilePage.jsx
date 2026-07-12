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
import "../Home/Home.css";
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
  const clampedPct = Math.min(Math.max(pct || 0, 0), 100);
  return (
    <div className="pd-skill-row">
      <div className="pd-skill-meta">
        <span className="pd-skill-label">{label}</span>
        <span className="pd-skill-pct">{clampedPct}%</span>
      </div>
      <div className="pd-skill-track">
        <div
          className="pd-skill-fill"
          style={{ width: `${clampedPct}%`, background: color }}
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
  const wrapRef = React.useRef(null);

  const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const CELL = 13; // px per cell
  const GAP = 3;   // px gap

  const updateTooltip = React.useCallback((day, currentTarget) => {
    const wrapRect = wrapRef.current?.getBoundingClientRect();
    const cellRect = currentTarget.getBoundingClientRect();

    if (!wrapRect) return;

    setTooltip({
      day,
      x: cellRect.left - wrapRect.left + cellRect.width / 2,
      y: cellRect.top - wrapRect.top,
    });
  }, []);

  return (
    <div className="ghcal-wrap" ref={wrapRef}>
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
                      onMouseEnter={(e) => updateTooltip(day, e.currentTarget)}
                      onMouseMove={(e) => updateTooltip(day, e.currentTarget)}
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

// ─── Helpers: determine subject from problem/topic ────────────────────────────
const isCoalTopic   = (id) => /^part-\d+$/.test(id);
const isCoalProblem = (p)  => p.subject === "coal" || isCoalTopic(p.topicId || "");

// ─── Build subject-split daily buckets from state.problems + state.topics ─────
// Returns a Map: dateKey → { dld: {solved,attempts,topics}, coal: {solved,attempts,topics} }
function buildSubjectDayBuckets(problems, topics) {
  const buckets = {};

  const getOrCreate = (dateKey) => {
    if (!buckets[dateKey]) {
      buckets[dateKey] = {
        dld:  { solved: 0, attempts: 0, topics: 0 },
        coal: { solved: 0, attempts: 0, topics: 0 },
      };
    }
    return buckets[dateKey];
  };

  // Problems → solved / attempts keyed by their date
  Object.values(problems || {}).forEach((p) => {
    const subj = isCoalProblem(p) ? "coal" : "dld";
    if (p.solvedAt) {
      const key = p.solvedAt.slice(0, 10);
      getOrCreate(key)[subj].solved += 1;
    }
    // count each attempt day from lastAttemptAt (best proxy we have)
    if (p.attempts > 0 && p.lastAttemptAt) {
      const key = p.lastAttemptAt.slice(0, 10);
      getOrCreate(key)[subj].attempts += p.attempts;
    }
  });

  // Topics → completedAt
  Object.entries(topics || {}).forEach(([id, t]) => {
    const subj = isCoalTopic(id) ? "coal" : "dld";
    if (t.completedAt) {
      const key = t.completedAt.slice(0, 10);
      getOrCreate(key)[subj].topics += 1;
    } else if (t.openedAt && t.status === "in_progress") {
      // count in-progress topics as partial activity on their open date
      const key = t.openedAt.slice(0, 10);
      getOrCreate(key)[subj].topics += 0; // don't count opens to avoid inflation
    }
  });

  return buckets;
}

// ─── Build weekly trend — subject-aware, last 8 weeks ─────────────────────────
function buildWeeklyTrend(problems, topics, subject) {
  const buckets = buildSubjectDayBuckets(problems, topics);
  const subj = subject === "COAL" ? "coal" : "dld";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const toKey = (d) => d.toISOString().slice(0, 10);

  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // roll to Sunday

  const weeks = [];
  for (let w = 7; w >= 0; w--) {
    const start = new Date(weekStart);
    start.setDate(start.getDate() - w * 7);
    let solved = 0, attempts = 0, topics = 0;
    for (let d = 0; d < 7; d++) {
      const day = new Date(start);
      day.setDate(day.getDate() + d);
      if (day > today) break;
      const b = (buckets[toKey(day)] || {})[subj] || {};
      solved   += b.solved   || 0;
      attempts += b.attempts || 0;
      topics   += b.topics   || 0;
    }
    const label = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    weeks.push({ week: label, solved, attempts, topics });
  }
  const firstActive = weeks.findIndex((w) => w.solved > 0 || w.attempts > 0 || w.topics > 0);
  return firstActive === -1 ? [] : weeks.slice(firstActive);
}

// ─── Build daily activity — subject-aware, last 7 days ────────────────────────
function buildDailyActivity(problems, topics, subject) {
  const buckets = buildSubjectDayBuckets(problems, topics);
  const subj = subject === "COAL" ? "coal" : "dld";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const toKey = (d) => d.toISOString().slice(0, 10);

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(today);
    day.setDate(day.getDate() - (6 - i));
    const b = (buckets[toKey(day)] || {})[subj] || {};
    return {
      day:      day.toLocaleDateString("en-US", { weekday: "short" }),
      solved:   b.solved   || 0,
      attempts: b.attempts || 0,
      topics:   b.topics   || 0,
    };
  });
}

// ─── Build pie data (now used for bar chart) ──────────────────────────────────
function buildPieData(topicStats) {
  return [
    { name: "Boolean Algebra",        value: Math.min(topicStats.booleanAlgebra || 0, 100) },
    { name: "Number Systems",         value: Math.min(topicStats.numberSystems  || 0, 100) },
    { name: "Arithmetic & HDLs",      value: Math.min(topicStats.arithmetic     || 0, 100) },
    { name: "Combinational Circuits", value: Math.min(topicStats.combinational  || 0, 100) },
    { name: "Sequential Circuits",    value: Math.min(topicStats.sequential     || 0, 100) },
    { name: "Registers & Transfers",  value: Math.min(topicStats.registers      || 0, 100) },
    { name: "Memory Systems",         value: Math.min(topicStats.memorySystems  || 0, 100) },
    { name: "Advanced Logic",         value: Math.min(topicStats.advancedLogic  || 0, 100) },
  ].filter((d) => d.value > 0);
}

// ─── Build radar data ─────────────────────────────────────────────────────────
function buildRadarData(topicStats) {
  return [
    { subject: "Boolean",      A: Math.min(topicStats.booleanAlgebra || 0, 100) },
    { subject: "Numbers",      A: Math.min(topicStats.numberSystems  || 0, 100) },
    { subject: "Arithmetic",   A: Math.min(topicStats.arithmetic     || 0, 100) },
    { subject: "Combinational",A: Math.min(topicStats.combinational  || 0, 100) },
    { subject: "Sequential",   A: Math.min(topicStats.sequential     || 0, 100) },
    { subject: "Registers",    A: Math.min(topicStats.registers      || 0, 100) },
    { subject: "Memory",       A: Math.min(topicStats.memorySystems  || 0, 100) },
    { subject: "Advanced",     A: Math.min(topicStats.advancedLogic  || 0, 100) },
  ];
}

// ─── Most active day (subject-aware, from problems+topics) ───────────────────
function getMostActiveDay(problems, topics, subject) {
  const buckets = buildSubjectDayBuckets(problems, topics);
  const subj = subject === "COAL" ? "coal" : "dld";
  const byDay = {};
  Object.entries(buckets).forEach(([dateKey, data]) => {
    const b = data[subj] || {};
    const total = (b.solved || 0) + (b.attempts || 0) + (b.topics || 0);
    if (total === 0) return;
    const day = new Date(dateKey).toLocaleDateString("en-US", { weekday: "long" });
    byDay[day] = (byDay[day] || 0) + total;
  });
  const sorted = Object.entries(byDay).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || "—";
}

// ─── Week-over-week comparison (subject-aware) ────────────────────────────────
function getWeekComparison(problems, topics, subject) {
  const buckets = buildSubjectDayBuckets(problems, topics);
  const subj = subject === "COAL" ? "coal" : "dld";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const toKey = (d) => d.toISOString().slice(0, 10);

  let thisWeek = 0, lastWeek = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const b = (buckets[toKey(d)] || {})[subj] || {};
    thisWeek += (b.solved || 0) + (b.attempts || 0) + (b.topics || 0);
  }
  for (let i = 7; i < 14; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const b = (buckets[toKey(d)] || {})[subj] || {};
    lastWeek += (b.solved || 0) + (b.attempts || 0) + (b.topics || 0);
  }
  const delta = lastWeek === 0 ? 0 : Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
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
  const [activeSubject, setActiveSubject] = useState("DLD");
  const [chartTooltipPosition, setChartTooltipPosition] = useState(null);

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
  const state = progressData?.state || {};

  const solvedCount = summary.solvedProblems || 0;
  const attemptedCount = summary.attemptedProblems || 0;
  const completedTopics = summary.completedTopics || 0;
  const streakCurrent = summary.streaks?.current || 0;
  const streakLongest = summary.streaks?.longest || 0;
  const activeDays = summary.streaks?.activeDays || 0;

  // ── Per-subject problem stats ───────────────────────────────────────────────
  const problemEntries = Object.values(state.problems || {});
  const dldSolvedCount    = problemEntries.filter((p) => p.status === "solved"   && p.subject !== "coal").length;
  const dldAttemptedCount = problemEntries.filter((p) => p.attempts > 0          && p.subject !== "coal").length;
  const coalSolvedCount    = problemEntries.filter((p) => p.status === "solved"   && p.subject === "coal").length;
  const coalAttemptedCount = problemEntries.filter((p) => p.attempts > 0          && p.subject === "coal").length;

  const activeSolvedCount    = activeSubject === "COAL" ? coalSolvedCount    : dldSolvedCount;
  const activeAttemptedCount = activeSubject === "COAL" ? coalAttemptedCount : dldAttemptedCount;

  const topicEntries = Object.entries(state.topics || {});
  const avgPct = (arr) =>
    !arr.length
      ? 0
      : Math.min(
          Math.round(
            arr.reduce((s, [, v]) => s + Math.min(v.completionPercentage || 0, 100), 0) /
              arr.length,
          ),
          100,
        );

  // ── DLD topic IDs ───────────────────────────────────────────────────────────
  const DLD_TOPIC_IDS = [
    "boolean-algebra", "number-systems", "arithmetic-functions-and-hdls",
    "combinational-circuits", "sequential-circuits",
    "registers-and-register-transfers", "memory-systems", "advanced-logic",
  ];
  // ── COAL part IDs ───────────────────────────────────────────────────────────
  const COAL_PART_IDS = ["part-1","part-2","part-3","part-4","part-5","part-6","part-7"];

  // ── DLD topic stats — keyed by actual coreTopics IDs ───────────────────────
  const topicStats = {
    booleanAlgebra:    avgPct(topicEntries.filter(([id]) => id === "boolean-algebra")),
    numberSystems:     avgPct(topicEntries.filter(([id]) => id === "number-systems")),
    arithmetic:        avgPct(topicEntries.filter(([id]) => id === "arithmetic-functions-and-hdls")),
    combinational:     avgPct(topicEntries.filter(([id]) => id === "combinational-circuits")),
    sequential:        avgPct(topicEntries.filter(([id]) => id === "sequential-circuits")),
    registers:         avgPct(topicEntries.filter(([id]) => id === "registers-and-register-transfers")),
    memorySystems:     avgPct(topicEntries.filter(([id]) => id === "memory-systems")),
    advancedLogic:     avgPct(topicEntries.filter(([id]) => id === "advanced-logic")),
  };

  // ── COAL topic stats — keyed by coalCourseParts IDs (part-1 … part-7) ──────
  const coalTopicStats = {
    foundations:   avgPct(topicEntries.filter(([id]) => id === "part-1")),
    machineCycle:  avgPct(topicEntries.filter(([id]) => id === "part-2")),
    isaAddressing: avgPct(topicEntries.filter(([id]) => id === "part-3")),
    assembly:      avgPct(topicEntries.filter(([id]) => id === "part-4")),
    x86Arch:       avgPct(topicEntries.filter(([id]) => id === "part-5")),
    ioInterrupts:  avgPct(topicEntries.filter(([id]) => id === "part-6")),
    perfPipeline:  avgPct(topicEntries.filter(([id]) => id === "part-7")),
  };

  // ── Per-subject completion counts ──────────────────────────────────────────
  const dldTopicsCompleted  = topicEntries.filter(([id, t]) => DLD_TOPIC_IDS.includes(id) && t.status === "completed").length;
  const coalPartsCompleted  = topicEntries.filter(([id, t]) => COAL_PART_IDS.includes(id) && t.status === "completed").length;
  const dldTopicsTotal      = DLD_TOPIC_IDS.length;
  const coalPartsTotal      = COAL_PART_IDS.length;

  // Active-subject values for stat cards
  const activeCompletedTopics  = activeSubject === "COAL" ? coalPartsCompleted  : dldTopicsCompleted;
  const activeTotalTopics      = activeSubject === "COAL" ? coalPartsTotal       : dldTopicsTotal;
  const activeTopicStats       = activeSubject === "COAL" ? coalTopicStats       : topicStats;

  // Overall completion rate for active subject
  const activeCompletionRate   = activeTotalTopics
    ? Math.round((activeCompletedTopics / activeTotalTopics) * 100)
    : 0;

  // ── Best / weakest area for active subject ─────────────────────────────────
  const activeStatsEntries = Object.entries(activeTopicStats);
  const bestArea   = activeStatsEntries.filter(([,v]) => v > 0).sort((a,b) => b[1]-a[1])[0];
  const weakArea   = activeStatsEntries.filter(([,v]) => v < 100).sort((a,b) => a[1]-b[1])[0];

  // ── Badges ──────────────────────────────────────────────────────────────────
  const badges = [
    // ── DLD Badges ────────────────────────────────────────────────────────────
    {
      icon: "🧠", title: "Logic Master", desc: "Solve 20+ problems",
      earned: solvedCount >= 20,
      progress: Math.min((solvedCount / 20) * 100, 100),
      rarity: "rare", subject: "DLD",
    },
    {
      icon: "⚡", title: "Circuit Creator", desc: "Visit Circuit Forge",
      earned: recentEvents.some((e) => e.type === "topic_opened"),
      progress: recentEvents.some((e) => e.type === "topic_opened") ? 100 : 0,
      rarity: "common", subject: "DLD",
    },
    {
      icon: "🔀", title: "Circuit Designer", desc: "Complete Combinational Circuits topic",
      earned: topicStats.combinational >= 80,
      progress: topicStats.combinational,
      rarity: "epic", subject: "DLD",
    },
    {
      icon: "🔥", title: "Streak Keeper", desc: "Maintain a 7-day streak",
      earned: streakCurrent >= 7,
      progress: Math.min((streakCurrent / 7) * 100, 100),
      rarity: "rare", subject: "Both",
    },
    {
      icon: "🏆", title: "Topic Champion", desc: "Complete 3+ topics",
      earned: completedTopics >= 3,
      progress: Math.min((completedTopics / 3) * 100, 100),
      rarity: "common", subject: "Both",
    },
    {
      icon: "🎯", title: "Problem Solver", desc: "Attempt 10+ problems",
      earned: attemptedCount >= 10,
      progress: Math.min((attemptedCount / 10) * 100, 100),
      rarity: "common", subject: "Both",
    },
    {
      icon: "🌟", title: "Quiz Champion", desc: "Solve 50+ problems",
      earned: solvedCount >= 50,
      progress: Math.min((solvedCount / 50) * 100, 100),
      rarity: "legendary", subject: "Both",
    },
    {
      icon: "🔬", title: "Logic Explorer", desc: "Open 10+ different topics",
      earned: topicEntries.length >= 10,
      progress: Math.min((topicEntries.length / 10) * 100, 100),
      rarity: "rare", subject: "Both",
    },
    {
      icon: "💎", title: "Perfect Score", desc: "100% accuracy in a session",
      earned: solvedCount > 0 && solvedCount === attemptedCount,
      progress: solvedCount > 0 ? Math.round((solvedCount / Math.max(attemptedCount, 1)) * 100) : 0,
      rarity: "legendary", subject: "Both",
    },
    // ── COAL Badges ───────────────────────────────────────────────────────────
    {
      icon: "🖥️", title: "Assembly Coder", desc: "Complete Assembly Programming (Part 4)",
      earned: coalTopicStats.assembly >= 100,
      progress: coalTopicStats.assembly,
      rarity: "epic", subject: "COAL",
    },
    {
      icon: "⚙️", title: "CPU Explorer", desc: "Complete Machine Model (Part 2)",
      earned: coalTopicStats.machineCycle >= 100,
      progress: coalTopicStats.machineCycle,
      rarity: "rare", subject: "COAL",
    },
    {
      icon: "📜", title: "ISA Scholar", desc: "Complete ISA & Addressing (Part 3)",
      earned: coalTopicStats.isaAddressing >= 100,
      progress: coalTopicStats.isaAddressing,
      rarity: "rare", subject: "COAL",
    },
    {
      icon: "🚀", title: "Pipeline Pro", desc: "Reach 80%+ in Pipelining (Part 7)",
      earned: coalTopicStats.perfPipeline >= 80,
      progress: coalTopicStats.perfPipeline,
      rarity: "epic", subject: "COAL",
    },
    {
      icon: "🎓", title: "COAL Graduate", desc: "Complete all 7 COAL parts",
      earned: Object.values(coalTopicStats).every((v) => v >= 100),
      progress: Math.round(Object.values(coalTopicStats).reduce((s,v)=>s+v,0) / 7),
      rarity: "legendary", subject: "COAL",
    },
  ];

  // ── Chart data ──────────────────────────────────────────────────────────────
  const weeklyTrend   = buildWeeklyTrend(state.problems || {}, state.topics || {}, activeSubject);
  const dailyActivity = buildDailyActivity(state.problems || {}, state.topics || {}, activeSubject);
  const pieData = buildPieData(topicStats);
  const radarData = buildRadarData(topicStats);
  const weekComp = getWeekComparison(state.problems || {}, state.topics || {}, activeSubject);
  const mostActiveDay = getMostActiveDay(state.problems || {}, state.topics || {}, activeSubject);

  // COAL chart data
  const coalRadarData = [
    { subject: "Foundations",  A: Math.min(coalTopicStats.foundations   || 0, 100) },
    { subject: "Machine",      A: Math.min(coalTopicStats.machineCycle  || 0, 100) },
    { subject: "ISA",          A: Math.min(coalTopicStats.isaAddressing || 0, 100) },
    { subject: "Assembly",     A: Math.min(coalTopicStats.assembly      || 0, 100) },
    { subject: "x86",          A: Math.min(coalTopicStats.x86Arch       || 0, 100) },
    { subject: "I/O",          A: Math.min(coalTopicStats.ioInterrupts  || 0, 100) },
    { subject: "Pipeline",     A: Math.min(coalTopicStats.perfPipeline  || 0, 100) },
  ];
  const coalPieData = [
    { name: "Foundations",  value: Math.min(coalTopicStats.foundations   || 0, 100) },
    { name: "Machine Model",value: Math.min(coalTopicStats.machineCycle  || 0, 100) },
    { name: "ISA",          value: Math.min(coalTopicStats.isaAddressing || 0, 100) },
    { name: "Assembly",     value: Math.min(coalTopicStats.assembly      || 0, 100) },
    { name: "x86 / IA-32",  value: Math.min(coalTopicStats.x86Arch       || 0, 100) },
    { name: "I/O",          value: Math.min(coalTopicStats.ioInterrupts  || 0, 100) },
    { name: "Pipelining",   value: Math.min(coalTopicStats.perfPipeline  || 0, 100) },
  ].filter((d) => d.value > 0);

  const activeRadarData = activeSubject === "COAL" ? coalRadarData : radarData;
  const activePieData   = activeSubject === "COAL" ? coalPieData   : pieData;

  const handleChartMouseMove = useCallback((state) => {
    if (
      state?.isTooltipActive &&
      typeof state.chartX === "number" &&
      typeof state.chartY === "number"
    ) {
      setChartTooltipPosition({ x: state.chartX, y: state.chartY });
    }
  }, []);

  const handleChartMouseLeave = useCallback(() => {
    setChartTooltipPosition(null);
  }, []);

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
    "circuits",
    "engagement",
  ];

  // ── Saved circuits (localStorage) ──────────────────────────────────────────
  const CIRCUIT_STORAGE_KEY = "logic_editor_saved_projects_v1";

  const [savedCircuits, setSavedCircuits] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CIRCUIT_STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  });

  // Re-read localStorage whenever the tab becomes active
  React.useEffect(() => {
    if (activeTab !== "circuits") return;
    try {
      setSavedCircuits(JSON.parse(localStorage.getItem(CIRCUIT_STORAGE_KEY) || "{}"));
    } catch {
      setSavedCircuits({});
    }
  }, [activeTab]);

  const deleteCircuitProject = (name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const updated = { ...savedCircuits };
    delete updated[name];
    localStorage.setItem(CIRCUIT_STORAGE_KEY, JSON.stringify(updated));
    setSavedCircuits(updated);
  };

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
                  {badges.filter((b) => b.earned).length} badges earned
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

            {/* ── Subject Toggle ── */}
            <div className="pd-subject-toggle-wrap">
              <div className="pd-subject-toggle">
                <button
                  type="button"
                  className={`pd-subject-pill${activeSubject === "DLD" ? " pd-subject-pill--active pd-subject-pill--dld" : ""}`}
                  onClick={() => setActiveSubject("DLD")}
                >
                  ⚡ DLD
                </button>
                <button
                  type="button"
                  className={`pd-subject-pill${activeSubject === "COAL" ? " pd-subject-pill--active pd-subject-pill--coal" : ""}`}
                  onClick={() => setActiveSubject("COAL")}
                >
                  🖥️ COAL
                </button>
              </div>
              <span className="pd-subject-toggle-label">
                {activeSubject === "DLD" ? "Digital Logic Design" : "Computer Organization & Assembly Language"}
              </span>
            </div>

            {/* ── Course Summary Cards ── */}
            <div className="pd-course-cards">
              <div className={`pd-course-card pd-course-card--dld${activeSubject === "DLD" ? " pd-course-card--active" : ""}`}
                   onClick={() => setActiveSubject("DLD")} role="button" tabIndex={0}
                   onKeyDown={(e) => e.key === "Enter" && setActiveSubject("DLD")}>
                <div className="pd-course-card-top">
                  <span className="pd-course-card-icon">⚡</span>
                  <div>
                    <div className="pd-course-card-name">Digital Logic Design</div>
                    <div className="pd-course-card-sub">DLD · Core Course</div>
                  </div>
                  <span className="pd-course-card-pct" style={{ color: COLORS.blue }}>
                    {dldTopicsTotal ? Math.round((dldTopicsCompleted / dldTopicsTotal) * 100) : 0}%
                  </span>
                </div>
                <div className="pd-course-card-progress-track">
                  <div className="pd-course-card-progress-fill"
                       style={{ width: `${dldTopicsTotal ? Math.round((dldTopicsCompleted / dldTopicsTotal) * 100) : 0}%`, background: COLORS.blue }} />
                </div>
                <div className="pd-course-card-footer">
                  <span>{dldTopicsCompleted}/{dldTopicsTotal} topics completed</span>
                  <Link to="/boolean/overview" className="pd-course-card-resume" style={{ color: COLORS.blue }}>Resume →</Link>
                </div>
              </div>

              <div className={`pd-course-card pd-course-card--coal${activeSubject === "COAL" ? " pd-course-card--active" : ""}`}
                   onClick={() => setActiveSubject("COAL")} role="button" tabIndex={0}
                   onKeyDown={(e) => e.key === "Enter" && setActiveSubject("COAL")}>
                <div className="pd-course-card-top">
                  <span className="pd-course-card-icon">🖥️</span>
                  <div>
                    <div className="pd-course-card-name">Computer Organization & Assembly</div>
                    <div className="pd-course-card-sub">COAL · Systems Course</div>
                  </div>
                  <span className="pd-course-card-pct" style={{ color: COLORS.purple }}>
                    {coalPartsTotal ? Math.round((coalPartsCompleted / coalPartsTotal) * 100) : 0}%
                  </span>
                </div>
                <div className="pd-course-card-progress-track">
                  <div className="pd-course-card-progress-fill"
                       style={{ width: `${coalPartsTotal ? Math.round((coalPartsCompleted / coalPartsTotal) * 100) : 0}%`, background: COLORS.purple }} />
                </div>
                <div className="pd-course-card-footer">
                  <span>{coalPartsCompleted}/{coalPartsTotal} parts completed</span>
                  <Link to="/resources/coal/theory" className="pd-course-card-resume" style={{ color: COLORS.purple }}>Resume →</Link>
                </div>
              </div>
            </div>

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
                {/* Row 1 — subject-aware */}
                <StatCard
                  icon="✅"
                  label="Problems Solved"
                  value={activeSolvedCount}
                  sub={
                    activeSolvedCount > 0
                      ? `${activeSubject} problems`
                      : "keep going!"
                  }
                  accent={COLORS.green}
                />
                <StatCard
                  icon="⚡"
                  label="Attempts Made"
                  value={activeAttemptedCount}
                  sub={
                    activeSolvedCount > 0
                      ? `${Math.round((activeSolvedCount / Math.max(activeAttemptedCount, 1)) * 100)}% solve rate`
                      : "no attempts yet"
                  }
                  accent={COLORS.blue}
                />
                <StatCard
                  icon="📚"
                  label={activeSubject === "COAL" ? "Parts Completed" : "Topics Completed"}
                  value={activeCompletedTopics}
                  sub={
                    activeTotalTopics
                      ? `of ${activeTotalTopics} ${activeSubject === "COAL" ? "parts" : "topics"}`
                      : "modules finished"
                  }
                  accent={COLORS.purple}
                />
                <StatCard
                  icon="🎯"
                  label="Completion Rate"
                  value={`${activeCompletionRate}%`}
                  sub={`${activeSubject} course progress`}
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
              <p className="pd-card-sub">Pick up where you left off · {activeSubject === "COAL" ? "Computer Organization & Assembly" : "Digital Logic Design"}</p>
              <div className="pd-tracks-grid">
                {activeSubject === "DLD" ? (
                  <>
                    <TrackCard
                      trackType="DLD TRACK"
                      title="Boolean Algebra"
                      progress={topicStats.booleanAlgebra || 0}
                      lessonsCount={Math.round(((topicStats.booleanAlgebra || 0) / 100) * 12)}
                      totalLessons={12}
                      xp={Math.round(((topicStats.booleanAlgebra || 0) / 100) * 500)}
                      totalXp={500}
                      streak={streakCurrent}
                      saved={2}
                      nextLesson="Logic Gates Overview"
                      accent={COLORS.blue}
                      link="/boolean/overview"
                    />
                    <TrackCard
                      trackType="DLD TRACK"
                      title="K-Map Simplification"
                      progress={topicStats.combinational || 0}
                      lessonsCount={Math.round(((topicStats.combinational || 0) / 100) * 8)}
                      totalLessons={8}
                      xp={Math.round(((topicStats.combinational || 0) / 100) * 350)}
                      totalXp={350}
                      streak={streakCurrent}
                      saved={0}
                      nextLesson="Grouping Rules"
                      accent={COLORS.purple}
                      link="/kmapgenerator"
                    />
                    <TrackCard
                      trackType="DLD TRACK"
                      title="Sequential Circuits"
                      progress={topicStats.sequential || 0}
                      lessonsCount={Math.round(((topicStats.sequential || 0) / 100) * 15)}
                      totalLessons={15}
                      xp={Math.round(((topicStats.sequential || 0) / 100) * 800)}
                      totalXp={800}
                      streak={streakCurrent}
                      saved={5}
                      nextLesson="Latches vs Flip-Flops"
                      accent={COLORS.green}
                      link="/sequential/intro"
                    />
                  </>
                ) : (
                  <>
                    <TrackCard
                      trackType="COAL TRACK"
                      title="Foundations & Machine Model"
                      progress={Math.round((coalTopicStats.foundations + coalTopicStats.machineCycle) / 2)}
                      lessonsCount={Math.round((Math.round((coalTopicStats.foundations + coalTopicStats.machineCycle) / 2) / 100) * 6)}
                      totalLessons={6}
                      xp={Math.round((Math.round((coalTopicStats.foundations + coalTopicStats.machineCycle) / 2) / 100) * 450)}
                      totalXp={450}
                      streak={streakCurrent}
                      saved={0}
                      nextLesson="CPU Components & Register Model"
                      accent={COLORS.purple}
                      link="/resources/coal/theory"
                    />
                    <TrackCard
                      trackType="COAL TRACK"
                      title="ISA & Assembly Programming"
                      progress={Math.round((coalTopicStats.isaAddressing + coalTopicStats.assembly) / 2)}
                      lessonsCount={Math.round((Math.round((coalTopicStats.isaAddressing + coalTopicStats.assembly) / 2) / 100) * 8)}
                      totalLessons={8}
                      xp={Math.round((Math.round((coalTopicStats.isaAddressing + coalTopicStats.assembly) / 2) / 100) * 650)}
                      totalXp={650}
                      streak={streakCurrent}
                      saved={0}
                      nextLesson="Addressing Modes"
                      accent={COLORS.cyan}
                      link="/coal/instruction-set-architecture"
                    />
                    <TrackCard
                      trackType="COAL TRACK"
                      title="x86 Architecture & Performance"
                      progress={Math.round((coalTopicStats.x86Arch + coalTopicStats.ioInterrupts + coalTopicStats.perfPipeline) / 3)}
                      lessonsCount={Math.round((Math.round((coalTopicStats.x86Arch + coalTopicStats.ioInterrupts + coalTopicStats.perfPipeline) / 3) / 100) * 8)}
                      totalLessons={8}
                      xp={Math.round((Math.round((coalTopicStats.x86Arch + coalTopicStats.ioInterrupts + coalTopicStats.perfPipeline) / 3) / 100) * 700)}
                      totalXp={700}
                      streak={streakCurrent}
                      saved={0}
                      nextLesson="Intel IA-32 Architecture"
                      accent={COLORS.amber}
                      link="/coal/ia32-architecture"
                    />
                  </>
                )}
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
                      const best = bestArea;
                      const label = activeSubject === "COAL"
                        ? { foundations:"Foundations", machineCycle:"Machine Model & Instruction Cycle", isaAddressing:"ISA & Addressing",
                            assembly:"Assembly Programming", x86Arch:"x86 / IA-32", ioInterrupts:"I/O & Interrupts", perfPipeline:"Architecture & Performance" }
                        : { booleanAlgebra:"Boolean Algebra", numberSystems:"Number Systems", arithmetic:"Arithmetic & HDLs",
                            combinational:"Combinational Circuits", sequential:"Sequential Circuits",
                            registers:"Registers & Transfers", memorySystems:"Memory Systems", advancedLogic:"Advanced Logic" };
                      return (
                        <div className="pd-perf-metric">
                          <div className="pd-perf-metric-head">
                            <span className="pd-perf-metric-label">Strongest Area</span>
                            <span className="pd-perf-metric-val pd-perf-metric-val--purple">
                              {best ? `${label[best[0]] || best[0]} · ${best[1]}%` : "—"}
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
                      const weak = weakArea;
                      const label = activeSubject === "COAL"
                        ? { foundations:"Foundations", machineCycle:"Machine Model & Instruction Cycle", isaAddressing:"ISA & Addressing",
                            assembly:"Assembly Programming", x86Arch:"x86 / IA-32", ioInterrupts:"I/O & Interrupts", perfPipeline:"Architecture & Performance" }
                        : { booleanAlgebra:"Boolean Algebra", numberSystems:"Number Systems", arithmetic:"Arithmetic & HDLs",
                            combinational:"Combinational Circuits", sequential:"Sequential Circuits",
                            registers:"Registers & Transfers", memorySystems:"Memory Systems", advancedLogic:"Advanced Logic" };
                      return (
                        <div className="pd-perf-metric">
                          <div className="pd-perf-metric-head">
                            <span className="pd-perf-metric-label">Needs Attention</span>
                            <span className="pd-perf-metric-val pd-perf-metric-val--amber">
                              {weak ? `${label[weak[0]] || weak[0]} · ${weak[1]}%` : "All strong 🎉"}
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
                        <span className="pd-perf-metric-label">
                          {activeSubject === "COAL" ? "Parts In Progress" : "Topics In Progress"}
                        </span>
                        <span className="pd-perf-metric-val pd-perf-metric-val--blue">
                          {topicEntries.filter(([id, t]) =>
                            t.status === "in_progress" &&
                            (activeSubject === "COAL"
                              ? COAL_PART_IDS.includes(id)
                              : DLD_TOPIC_IDS.includes(id))
                          ).length} active
                        </span>
                      </div>
                      <div className="pd-perf-bar-track">
                        <div className="pd-perf-bar-fill" style={{
                          width: `${Math.min((topicEntries.filter(([id, t]) =>
                            t.status === "in_progress" &&
                            (activeSubject === "COAL"
                              ? COAL_PART_IDS.includes(id)
                              : DLD_TOPIC_IDS.includes(id))
                          ).length / Math.max(activeTotalTopics, 1)) * 100, 100)}%`,
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
            {/* Subject toggle for analytics */}
            <div className="pd-subject-toggle-wrap">
              <div className="pd-subject-toggle">
                <button type="button"
                  className={`pd-subject-pill${activeSubject === "DLD" ? " pd-subject-pill--active pd-subject-pill--dld" : ""}`}
                  onClick={() => setActiveSubject("DLD")}>⚡ DLD</button>
                <button type="button"
                  className={`pd-subject-pill${activeSubject === "COAL" ? " pd-subject-pill--active pd-subject-pill--coal" : ""}`}
                  onClick={() => setActiveSubject("COAL")}>🖥️ COAL</button>
              </div>
              <span className="pd-subject-toggle-label">
                Showing {activeSubject === "COAL" ? "COAL" : "DLD"} analytics
              </span>
            </div>

            {/* Weekly trend line chart */}
            <div className="pd-card">
              <h2 className="pd-card-title">Weekly Learning Trends</h2>
              <p className="pd-card-sub">
                {activeSubject === "COAL"
                  ? "COAL — topics completed per week · last 8 weeks"
                  : "DLD — problems solved & attempts per week · last 8 weeks"}
              </p>
              {weeklyTrend.length === 0 ? (
                <p className="pd-empty">
                  No {activeSubject} activity yet — start learning to see trends!
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart
                    data={weeklyTrend}
                    margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                    onMouseMove={handleChartMouseMove}
                    onMouseLeave={handleChartMouseLeave}
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
                    <Tooltip
                      content={<ChartTooltip />}
                      position={chartTooltipPosition || undefined}
                      allowEscapeViewBox={{ x: true, y: true }}
                      wrapperStyle={{ pointerEvents: "none" }}
                      offset={14}
                    />
                    <Legend wrapperStyle={{ fontSize: "0.82rem" }} />
                    {activeSubject === "DLD" && (
                      <Line
                        type="monotone"
                        dataKey="solved"
                        stroke={COLORS.green}
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                        name="Solved"
                      />
                    )}
                    {activeSubject === "DLD" && (
                      <Line
                        type="monotone"
                        dataKey="attempts"
                        stroke={COLORS.blue}
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                        name="Attempts"
                      />
                    )}
                    <Line
                      type="monotone"
                      dataKey="topics"
                      stroke={activeSubject === "COAL" ? COLORS.purple : COLORS.amber}
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                      name={activeSubject === "COAL" ? "Parts Completed" : "Topics Completed"}
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
                  {activeSubject === "COAL"
                    ? "COAL — daily topics completed this week"
                    : "DLD — daily problems solved & attempts this week"}
                </p>
                {dailyActivity.every(d => d.solved === 0 && d.attempts === 0 && d.topics === 0) ? (
                  <p className="pd-empty">No {activeSubject} activity in the last 7 days.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={dailyActivity}
                      margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                      onMouseMove={handleChartMouseMove}
                      onMouseLeave={handleChartMouseLeave}
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
                      <Tooltip
                        content={<ChartTooltip />}
                        position={chartTooltipPosition || undefined}
                        allowEscapeViewBox={{ x: true, y: true }}
                        wrapperStyle={{ pointerEvents: "none" }}
                        offset={14}
                      />
                      <Legend wrapperStyle={{ fontSize: "0.82rem" }} />
                      {activeSubject === "DLD" && (
                        <Bar dataKey="solved"   fill={COLORS.green}  name="Solved"   radius={[4, 4, 0, 0]} />
                      )}
                      {activeSubject === "DLD" && (
                        <Bar dataKey="attempts" fill={COLORS.blue}   name="Attempts" radius={[4, 4, 0, 0]} />
                      )}
                      <Bar
                        dataKey="topics"
                        fill={activeSubject === "COAL" ? COLORS.purple : COLORS.amber}
                        name={activeSubject === "COAL" ? "Parts Completed" : "Topics Completed"}
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
                  Completion % across {activeSubject === "COAL" ? "COAL parts" : "DLD topic areas"}
                </p>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart
                    data={activeRadarData}
                    margin={{ top: 8, right: 24, left: 24, bottom: 8 }}
                    onMouseMove={handleChartMouseMove}
                    onMouseLeave={handleChartMouseLeave}
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
                      stroke={activeSubject === "COAL" ? COLORS.purple : COLORS.blue}
                      fill={activeSubject === "COAL" ? COLORS.purple : COLORS.blue}
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                    <Tooltip
                      content={<ChartTooltip />}
                      position={chartTooltipPosition || undefined}
                      allowEscapeViewBox={{ x: true, y: true }}
                      wrapperStyle={{ pointerEvents: "none" }}
                      offset={14}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Topic completion bar chart */}
            <div className="pd-two-col">
              <div className="pd-card">
                <h2 className="pd-card-title">Topic Completion Ratio</h2>
                <p className="pd-card-sub">
                  {activeSubject === "COAL" ? "COAL part completion breakdown" : "DLD topic completion breakdown"}
                </p>
                {activePieData.length === 0 ? (
                  <p className="pd-empty">Start {activeSubject} topics to see the breakdown.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                      data={activePieData}
                      layout="vertical"
                      margin={{ top: 4, right: 40, left: 8, bottom: 4 }}
                      onMouseMove={handleChartMouseMove}
                      onMouseLeave={handleChartMouseLeave}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.07)" />
                      <XAxis
                        type="number"
                        domain={[0, 100]}
                        tickCount={6}
                        tickFormatter={(v) => `${v}%`}
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={138}
                        tick={{ fontSize: 11, fill: "#d1d5db" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        formatter={(v) => [`${v}%`, "Completion"]}
                        cursor={{ fill: "rgba(255,255,255,0.05)" }}
                        contentStyle={{
                          background: "#1e2130",
                          border: "1px solid rgba(255,255,255,0.12)",
                          borderRadius: "8px",
                          fontSize: "0.82rem",
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={18}>
                        {activePieData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Week comparison card */}
              <div className="pd-card">
                <h2 className="pd-card-title">Week-over-Week Comparison</h2>
                <p className="pd-card-sub">
                  {activeSubject} activity · current vs previous 7 days
                </p>
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
            {/* Topic accuracy bar chart — subject-aware */}
            <div className="pd-card">
              <h2 className="pd-card-title">Topic-wise Accuracy</h2>
              <p className="pd-card-sub">
                Completion percentage per {activeSubject === "COAL" ? "COAL part" : "DLD subject area"}
              </p>
              {/* Subject toggle */}
              <div className="pd-subject-toggle-wrap" style={{ flexDirection: "row", alignItems: "center", marginBottom: "1rem" }}>
                <div className="pd-subject-toggle">
                  <button type="button"
                    className={`pd-subject-pill${activeSubject === "DLD" ? " pd-subject-pill--active pd-subject-pill--dld" : ""}`}
                    onClick={() => setActiveSubject("DLD")}>⚡ DLD</button>
                  <button type="button"
                    className={`pd-subject-pill${activeSubject === "COAL" ? " pd-subject-pill--active pd-subject-pill--coal" : ""}`}
                    onClick={() => setActiveSubject("COAL")}>🖥️ COAL</button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={activeSubject === "COAL" ? [
                    { topic: "Foundations",  pct: Math.min(coalTopicStats.foundations   || 0, 100) },
                    { topic: "Machine",      pct: Math.min(coalTopicStats.machineCycle  || 0, 100) },
                    { topic: "ISA",          pct: Math.min(coalTopicStats.isaAddressing || 0, 100) },
                    { topic: "Assembly",     pct: Math.min(coalTopicStats.assembly      || 0, 100) },
                    { topic: "x86 Arch",     pct: Math.min(coalTopicStats.x86Arch       || 0, 100) },
                    { topic: "I/O",          pct: Math.min(coalTopicStats.ioInterrupts  || 0, 100) },
                    { topic: "Performance",  pct: Math.min(coalTopicStats.perfPipeline  || 0, 100) },
                  ] : [
                    { topic: "Boolean",      pct: Math.min(topicStats.booleanAlgebra || 0, 100) },
                    { topic: "Numbers",      pct: Math.min(topicStats.numberSystems  || 0, 100) },
                    { topic: "Arithmetic",   pct: Math.min(topicStats.arithmetic     || 0, 100) },
                    { topic: "Combinational",pct: Math.min(topicStats.combinational  || 0, 100) },
                    { topic: "Sequential",   pct: Math.min(topicStats.sequential     || 0, 100) },
                    { topic: "Registers",    pct: Math.min(topicStats.registers      || 0, 100) },
                    { topic: "Memory",       pct: Math.min(topicStats.memorySystems  || 0, 100) },
                    { topic: "Advanced",     pct: Math.min(topicStats.advancedLogic  || 0, 100) },
                  ]}
                  margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                  onMouseMove={handleChartMouseMove}
                  onMouseLeave={handleChartMouseLeave}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                  <XAxis dataKey="topic" tick={{ fontSize: 12, fill: "var(--secondary-text)" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "var(--secondary-text)" }} unit="%" />
                  <Tooltip
                    content={<ChartTooltip />}
                    position={chartTooltipPosition || undefined}
                    allowEscapeViewBox={{ x: true, y: true }}
                    formatter={(v) => `${v}%`}
                    wrapperStyle={{ pointerEvents: "none" }}
                    offset={14}
                  />
                  <Bar dataKey="pct" name="Completion %" radius={[6, 6, 0, 0]}>
                    {(activeSubject === "COAL"
                      ? [COLORS.purple, COLORS.cyan, COLORS.blue, COLORS.amber, COLORS.indigo, COLORS.pink, COLORS.green]
                      : [COLORS.blue, COLORS.cyan, COLORS.amber, COLORS.green, COLORS.purple, COLORS.pink, COLORS.indigo, COLORS.red]
                    ).map((c, i) => (
                      <Cell key={i} fill={c} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

              <div className="pd-two-col">
              <div className="pd-card">
                <h2 className="pd-card-title">Skill Progress Tracker</h2>
                <p className="pd-card-sub">
                  {activeSubject === "COAL"
                    ? "COAL part completion across all 7 parts"
                    : "DLD topic completion across all 8 topics"}
                </p>

                {activeSubject === "DLD" ? (
                  <>
                    <div className="pd-skills-subject-header pd-skills-subject-header--dld">
                      <span>⚡</span> Digital Logic Design
                    </div>
                    <div className="pd-skills-list">
                      <SkillBar label="Boolean Algebra"          pct={topicStats.booleanAlgebra} color={COLORS.blue}    />
                      <SkillBar label="Number Systems"           pct={topicStats.numberSystems}  color={COLORS.cyan}    />
                      <SkillBar label="Arithmetic & HDLs"        pct={topicStats.arithmetic}     color={COLORS.amber}   />
                      <SkillBar label="Combinational Circuits"   pct={topicStats.combinational}  color={COLORS.green}   />
                      <SkillBar label="Sequential Circuits"      pct={topicStats.sequential}     color={COLORS.purple}  />
                      <SkillBar label="Registers & Transfers"    pct={topicStats.registers}      color={COLORS.pink}    />
                      <SkillBar label="Memory Systems"           pct={topicStats.memorySystems}  color={COLORS.indigo}  />
                      <SkillBar label="Advanced Logic"           pct={topicStats.advancedLogic}  color={COLORS.red}     />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="pd-skills-subject-header pd-skills-subject-header--coal">
                      <span>🖥️</span> Computer Organization & Assembly
                    </div>
                    <div className="pd-skills-list">
                      <SkillBar label="Part 1 · Foundations"                     pct={coalTopicStats.foundations}   color={COLORS.purple} />
                      <SkillBar label="Part 2 · Machine Model & Instr. Cycle"    pct={coalTopicStats.machineCycle}  color={COLORS.cyan}   />
                      <SkillBar label="Part 3 · ISA & Addressing"                pct={coalTopicStats.isaAddressing} color={COLORS.blue}   />
                      <SkillBar label="Part 4 · Assembly Programming"            pct={coalTopicStats.assembly}      color={COLORS.amber}  />
                      <SkillBar label="Part 5 · x86 Architecture"                pct={coalTopicStats.x86Arch}       color={COLORS.indigo} />
                      <SkillBar label="Part 6 · I/O, Interrupts & System Design" pct={coalTopicStats.ioInterrupts}  color={COLORS.pink}   />
                      <SkillBar label="Part 7 · Architecture & Performance"      pct={coalTopicStats.perfPipeline}  color={COLORS.green}  />
                    </div>
                  </>
                )}
              </div>

              <div className="pd-card">
                <h2 className="pd-card-title">
                  {activeSubject === "COAL" ? "COAL Parts Breakdown" : "DLD Topics Breakdown"}
                </h2>
                <p className="pd-card-sub">
                  Detailed status · {activeSubject === "COAL" ? "Computer Organization & Assembly" : "Digital Logic Design"}
                </p>
                {topicEntries.filter(([id]) =>
                  activeSubject === "COAL" ? COAL_PART_IDS.includes(id) : DLD_TOPIC_IDS.includes(id)
                ).length === 0 ? (
                  <p className="pd-empty">
                    No {activeSubject} topics started yet. Head to {activeSubject === "COAL" ? "Resources → COAL" : "the Problems section"}!
                  </p>
                ) : (
                  <ul className="pd-topic-list">
                    {topicEntries
                      .filter(([id]) =>
                        activeSubject === "COAL" ? COAL_PART_IDS.includes(id) : DLD_TOPIC_IDS.includes(id)
                      )
                      .sort(([idA], [idB]) => {
                        // Sort COAL by part number, DLD by defined order
                        if (activeSubject === "COAL") {
                          return COAL_PART_IDS.indexOf(idA) - COAL_PART_IDS.indexOf(idB);
                        }
                        return DLD_TOPIC_IDS.indexOf(idA) - DLD_TOPIC_IDS.indexOf(idB);
                      })
                      .map(([id, t]) => {
                        const COAL_PART_LABELS = {
                          "part-1": "Part 1 · Foundations",
                          "part-2": "Part 2 · Machine Model & Instr. Cycle",
                          "part-3": "Part 3 · ISA & Addressing",
                          "part-4": "Part 4 · Assembly Programming",
                          "part-5": "Part 5 · x86 Architecture",
                          "part-6": "Part 6 · I/O & System Design",
                          "part-7": "Part 7 · Architecture & Performance",
                        };
                        const DLD_TOPIC_LABELS = {
                          "boolean-algebra": "Boolean Algebra",
                          "number-systems": "Number Systems",
                          "arithmetic-functions-and-hdls": "Arithmetic & HDLs",
                          "combinational-circuits": "Combinational Circuits",
                          "sequential-circuits": "Sequential Circuits",
                          "registers-and-register-transfers": "Registers & Transfers",
                          "memory-systems": "Memory Systems",
                          "advanced-logic": "Advanced Logic",
                        };
                        const displayName = activeSubject === "COAL"
                          ? (COAL_PART_LABELS[id] || t.title || id)
                          : (DLD_TOPIC_LABELS[id] || t.title || id);
                        return (
                          <li key={id} className="pd-topic-item">
                            <div className="pd-topic-header">
                              <span className="pd-topic-name">{displayName}</span>
                              <span className={`pd-topic-status pd-topic-status--${t.status}`}>
                                {t.status?.replace("_", " ")}
                              </span>
                            </div>
                            <div className="pd-skill-track">
                              <div
                                className="pd-skill-fill"
                                style={{
                                  width: `${t.completionPercentage || 0}%`,
                                  background: t.status === "completed" ? COLORS.green : COLORS.blue,
                                }}
                              />
                            </div>
                            <span className="pd-topic-pct">{t.completionPercentage || 0}%</span>
                          </li>
                        );
                      })}
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

          // ── DLD milestone definitions ─────────────────────────────
          const DLD_MILESTONES = [
            { id: "first_step",  icon: "👣", label: "First Step",       desc: "Attempt your very first DLD problem",          xp: 15,  category: "Problems",    unlocked: dldAttemptedCount >= 1,                          progress: Math.min(dldAttemptedCount, 1),          total: 1 },
            { id: "problem5",    icon: "✅", label: "Problem Solver",   desc: "Solve 5 DLD problems",                          xp: 75,  category: "Problems",    unlocked: dldSolvedCount >= 5,                             progress: Math.min(dldSolvedCount, 5),             total: 5 },
            { id: "problem20",   icon: "🧩", label: "Logic Craftsman",  desc: "Solve 20 DLD problems",                         xp: 300, category: "Problems",    unlocked: dldSolvedCount >= 20,                            progress: Math.min(dldSolvedCount, 20),            total: 20 },
            { id: "problem50",   icon: "🏅", label: "Half-Century",     desc: "Solve 50 DLD problems",                         xp: 750, category: "Problems",    unlocked: dldSolvedCount >= 50,                            progress: Math.min(dldSolvedCount, 50),            total: 50 },
            { id: "accuracy100", icon: "🎯", label: "Perfect Aim",      desc: "Achieve 100% solve rate on DLD problems",       xp: 200, category: "Accuracy",    unlocked: dldSolvedCount > 0 && dldSolvedCount === dldAttemptedCount, progress: dldSolvedCount > 0 ? Math.round((dldSolvedCount / Math.max(dldAttemptedCount,1))*100) : 0, total: 100, isPercent: true },
            { id: "topic1",      icon: "📖", label: "Knowledge Seeker", desc: "Complete your first DLD topic",                 xp: 25,  category: "Topics",      unlocked: dldTopicsCompleted >= 1,                         progress: Math.min(dldTopicsCompleted, 1),         total: 1 },
            { id: "topic5",      icon: "📚", label: "Curriculum Runner",desc: "Complete 5 DLD topics",                         xp: 125, category: "Topics",      unlocked: dldTopicsCompleted >= 5,                         progress: Math.min(dldTopicsCompleted, 5),         total: 5 },
            { id: "dld_bool",    icon: "🔣", label: "Boolean Master",   desc: "Complete Boolean Algebra",                      xp: 80,  category: "Topics",      unlocked: topicStats.booleanAlgebra >= 100,                progress: topicStats.booleanAlgebra,               total: 100, isPercent: true },
            { id: "dld_comb",    icon: "🔀", label: "Circuit Designer", desc: "Complete Combinational Circuits",               xp: 120, category: "Topics",      unlocked: topicStats.combinational >= 100,                 progress: topicStats.combinational,                total: 100, isPercent: true },
            { id: "dld_seq",     icon: "🔄", label: "State Machine Pro",desc: "Complete Sequential Circuits",                  xp: 140, category: "Topics",      unlocked: topicStats.sequential >= 100,                    progress: topicStats.sequential,                   total: 100, isPercent: true },
            { id: "dld_all",     icon: "⚡", label: "DLD Graduate",     desc: "Complete all 8 DLD topics",                    xp: 500, category: "Topics",      unlocked: dldTopicsCompleted >= 8,                         progress: Math.min(dldTopicsCompleted, 8),         total: 8 },
            { id: "streak3",     icon: "🔥", label: "On Fire",          desc: "Maintain a 3-day streak",                      xp: 45,  category: "Streaks",     unlocked: streakCurrent >= 3,                              progress: Math.min(streakCurrent, 3),              total: 3 },
            { id: "streak7",     icon: "⚡", label: "Week Warrior",     desc: "Maintain a 7-day streak",                      xp: 105, category: "Streaks",     unlocked: streakCurrent >= 7,                              progress: Math.min(streakCurrent, 7),              total: 7 },
            { id: "streak30",    icon: "🌟", label: "Ironclad",         desc: "Maintain a 30-day streak",                     xp: 450, category: "Streaks",     unlocked: streakLongest >= 30,                             progress: Math.min(streakLongest, 30),             total: 30 },
            { id: "active20",    icon: "📅", label: "Dedicated",        desc: "Study on 20 different days",                   xp: 200, category: "Consistency", unlocked: activeDays >= 20,                                progress: Math.min(activeDays, 20),                total: 20 },
          ];

          // ── COAL milestone definitions ────────────────────────────
          const COAL_MILESTONES = [
            { id: "coal_first",    icon: "🖥️", label: "COAL Explorer",      desc: "Start your first COAL topic",                        xp: 20,  category: "Topics",      unlocked: Object.values(coalTopicStats).some((v) => v > 0),          progress: Object.values(coalTopicStats).some((v) => v > 0) ? 1 : 0,    total: 1 },
            { id: "coal_found",    icon: "🏗️", label: "Foundation Builder",  desc: "Complete Foundations (Part 1)",                      xp: 100, category: "Topics",      unlocked: coalTopicStats.foundations >= 100,                         progress: coalTopicStats.foundations,                                   total: 100, isPercent: true },
            { id: "coal_cpu",      icon: "⚙️", label: "CPU Explorer",        desc: "Complete Machine Model & Instruction Cycle (Part 2)", xp: 150, category: "Topics",      unlocked: coalTopicStats.machineCycle >= 100,                        progress: coalTopicStats.machineCycle,                                  total: 100, isPercent: true },
            { id: "coal_isa",      icon: "📜", label: "ISA Scholar",          desc: "Complete ISA & Addressing (Part 3)",                 xp: 180, category: "Topics",      unlocked: coalTopicStats.isaAddressing >= 100,                       progress: coalTopicStats.isaAddressing,                                 total: 100, isPercent: true },
            { id: "coal_asm",      icon: "💻", label: "Assembly Coder",       desc: "Complete Assembly Programming (Part 4)",             xp: 250, category: "Topics",      unlocked: coalTopicStats.assembly >= 100,                            progress: coalTopicStats.assembly,                                      total: 100, isPercent: true },
            { id: "coal_x86",      icon: "🔧", label: "x86 Architect",        desc: "Complete x86 / IA-32 Architecture (Part 5)",         xp: 220, category: "Topics",      unlocked: coalTopicStats.x86Arch >= 100,                             progress: coalTopicStats.x86Arch,                                       total: 100, isPercent: true },
            { id: "coal_io",       icon: "📡", label: "I/O Specialist",       desc: "Complete I/O, Interrupts & System Design (Part 6)",  xp: 200, category: "Topics",      unlocked: coalTopicStats.ioInterrupts >= 100,                        progress: coalTopicStats.ioInterrupts,                                  total: 100, isPercent: true },
            { id: "coal_pipeline", icon: "🚀", label: "Pipeline Pro",         desc: "Reach 80%+ in Architecture & Performance (Part 7)",  xp: 300, category: "Topics",      unlocked: coalTopicStats.perfPipeline >= 80,                         progress: Math.min(coalTopicStats.perfPipeline, 80),                    total: 80 },
            { id: "coal_graduate", icon: "🎓", label: "COAL Graduate",        desc: "Complete all 7 COAL parts",                          xp: 700, category: "Topics",      unlocked: Object.values(coalTopicStats).every((v) => v >= 100),      progress: Object.values(coalTopicStats).filter((v) => v >= 100).length, total: 7 },
            { id: "streak3_c",     icon: "🔥", label: "On Fire",              desc: "Maintain a 3-day streak",                            xp: 45,  category: "Streaks",     unlocked: streakCurrent >= 3,                                        progress: Math.min(streakCurrent, 3),                                   total: 3 },
            { id: "streak7_c",     icon: "⚡", label: "Week Warrior",         desc: "Maintain a 7-day streak",                            xp: 105, category: "Streaks",     unlocked: streakCurrent >= 7,                                        progress: Math.min(streakCurrent, 7),                                   total: 7 },
            { id: "streak30_c",    icon: "🌟", label: "Ironclad",             desc: "Maintain a 30-day streak",                           xp: 450, category: "Streaks",     unlocked: streakLongest >= 30,                                       progress: Math.min(streakLongest, 30),                                  total: 30 },
            { id: "active20_c",    icon: "📅", label: "Dedicated",            desc: "Study on 20 different days",                         xp: 200, category: "Consistency", unlocked: activeDays >= 20,                                          progress: Math.min(activeDays, 20),                                     total: 20 },
          ];

          // ── Active set & per-course XP ────────────────────────────
          const MILESTONES  = activeSubject === "COAL" ? COAL_MILESTONES : DLD_MILESTONES;
          const dldXP       = dldSolvedCount * 15 + dldTopicsCompleted * 25 + streakLongest * 5 + activeDays * 3;
          const coalXP      = coalPartsCompleted * 80 + streakLongest * 5 + activeDays * 3;
          const totalXP     = activeSubject === "COAL" ? coalXP : dldXP;

          const TIERS = [
            { name: "Novice",    min: 0,    color: "#94a3b8", icon: "🌱" },
            { name: "Explorer",  min: 100,  color: "#3b82f6", icon: "🔭" },
            { name: "Builder",   min: 250,  color: "#10b981", icon: "⚙️"  },
            { name: "Architect", min: 500,  color: "#f59e0b", icon: "🏛️" },
            { name: "Master",    min: 900,  color: "#8b5cf6", icon: "⚡" },
            { name: "Legend",    min: 1500, color: "#ec4899", icon: "🏆" },
          ];
          const currentTier = TIERS.findLast((t) => totalXP >= t.min) || TIERS[0];
          const nextTier    = TIERS[TIERS.indexOf(currentTier) + 1];
          const tierPct     = nextTier ? Math.round(((totalXP - currentTier.min) / (nextTier.min - currentTier.min)) * 100) : 100;

          const earned     = MILESTONES.filter((m) => m.unlocked);
          const inProgress = MILESTONES.filter((m) => !m.unlocked && m.progress > 0);
          const locked     = MILESTONES.filter((m) => !m.unlocked && !(m.progress > 0));
          const earnedXP   = earned.reduce((s, m) => s + m.xp, 0);
          const nextUnlock = [...inProgress].sort((a, b) => (b.progress / b.total) - (a.progress / a.total))[0] || locked[0];

          const CAT_COLORS = {
            Problems:    COLORS.blue,
            Topics:      activeSubject === "COAL" ? COLORS.purple : COLORS.green,
            Streaks:     COLORS.amber,
            Accuracy:    COLORS.cyan,
            Consistency: COLORS.indigo,
          };

          return (
            <div className="pd-section">

              {/* ── Subject toggle ── */}
              <div className="pd-subject-toggle-wrap">
                <div className="pd-subject-toggle">
                  <button type="button"
                    className={`pd-subject-pill${activeSubject === "DLD" ? " pd-subject-pill--active pd-subject-pill--dld" : ""}`}
                    onClick={() => setActiveSubject("DLD")}>⚡ DLD</button>
                  <button type="button"
                    className={`pd-subject-pill${activeSubject === "COAL" ? " pd-subject-pill--active pd-subject-pill--coal" : ""}`}
                    onClick={() => setActiveSubject("COAL")}>🖥️ COAL</button>
                </div>
                <span className="pd-subject-toggle-label">
                  {activeSubject === "COAL"
                    ? "COAL — Computer Organization & Assembly achievements"
                    : "DLD — Digital Logic Design achievements"}
                </span>
              </div>

              {/* ── Tier banner ── */}
              <div className="ach-tier-banner" style={{ "--tier-color": currentTier.color }}>
                <div className="ach-tier-left">
                  <span className="ach-tier-icon">{currentTier.icon}</span>
                  <div>
                    <div className="ach-tier-label">{activeSubject === "COAL" ? "COAL Rank" : "DLD Rank"}</div>
                    <div className="ach-tier-name" style={{ color: currentTier.color }}>{currentTier.name}</div>
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

        {/* ══════════════ CIRCUITS TAB ══════════════ */}
        {activeTab === "circuits" && (() => {
          const circuitNames = Object.keys(savedCircuits);

          return (
            <div className="pd-section">
              {/* ── Header card ── */}
              <div className="pd-card pd-circuits-header-card">
                <div className="pd-circuits-header-left">
                  <span className="pd-circuits-header-icon">⚡</span>
                  <div>
                    <h2 className="pd-card-title" style={{ margin: 0 }}>My Saved Circuits</h2>
                    <p className="pd-card-sub" style={{ margin: "0.25rem 0 0" }}>
                      {circuitNames.length === 0
                        ? "No circuits saved yet"
                        : `${circuitNames.length} project${circuitNames.length > 1 ? "s" : ""} saved locally`}
                    </p>
                  </div>
                </div>
                <Link to="/boolforge" className="pd-btn pd-btn--primary pd-circuits-open-btn">
                  Open Circuit Forge →
                </Link>
              </div>

              {/* ── Empty state ── */}
              {circuitNames.length === 0 ? (
                <div className="pd-card pd-circuits-empty">
                  <span className="pd-circuits-empty-icon">🔌</span>
                  <p className="pd-circuits-empty-title">No saved circuits yet</p>
                  <p className="pd-circuits-empty-sub">
                    Head over to Circuit Forge, build a circuit, and hit "Save Project" — it'll appear here.
                  </p>
                  <Link to="/boolforge" className="pd-btn pd-btn--primary" style={{ marginTop: "0.5rem" }}>
                    Go to Circuit Forge
                  </Link>
                </div>
              ) : (
                <div className="pd-circuits-grid">
                  {circuitNames.map((name) => {
                    const project = savedCircuits[name];
                    const latestSnap = project?.versions?.[0];
                    const gates = Array.isArray(latestSnap?.gates) ? latestSnap.gates : [];
                    const wires = Array.isArray(latestSnap?.wires) ? latestSnap.wires : [];
                    const inputCount = gates.filter((g) => g.type === "INPUT").length;
                    const outputCount = gates.filter((g) => g.type === "OUTPUT").length;
                    const savedAt = latestSnap?.time
                      ? timeAgo(new Date(latestSnap.time).toISOString())
                      : "—";

                    return (
                      <div key={name} className="pd-circuit-card">
                        {/* Card top */}
                        <div className="pd-circuit-card-top">
                          <div className="pd-circuit-card-icon-wrap">
                            <span className="pd-circuit-card-icon">🔧</span>
                          </div>
                          <div className="pd-circuit-card-info">
                            <span className="pd-circuit-card-name">{name}</span>
                            <span className="pd-circuit-card-time">Saved {savedAt}</span>
                          </div>
                          <button
                            className="pd-circuit-card-delete"
                            title="Delete this project"
                            onClick={() => deleteCircuitProject(name)}
                          >
                            🗑
                          </button>
                        </div>

                        {/* Stats */}
                        <div className="pd-circuit-card-stats">
                          <div className="pd-circuit-stat">
                            <span className="pd-circuit-stat-val">{gates.length}</span>
                            <span className="pd-circuit-stat-label">Gates</span>
                          </div>
                          <div className="pd-circuit-stat-divider" />
                          <div className="pd-circuit-stat">
                            <span className="pd-circuit-stat-val">{wires.length}</span>
                            <span className="pd-circuit-stat-label">Wires</span>
                          </div>
                          <div className="pd-circuit-stat-divider" />
                          <div className="pd-circuit-stat">
                            <span className="pd-circuit-stat-val">{inputCount}</span>
                            <span className="pd-circuit-stat-label">Inputs</span>
                          </div>
                          <div className="pd-circuit-stat-divider" />
                          <div className="pd-circuit-stat">
                            <span className="pd-circuit-stat-val">{outputCount}</span>
                            <span className="pd-circuit-stat-label">Outputs</span>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="pd-circuit-card-footer">
                          <span className="pd-circuit-version-badge">
                            💾 Local
                          </span>
                          <Link
                            to="/boolforge"
                            className="pd-btn pd-btn--sm pd-circuit-open-btn"
                            title="Open Circuit Forge to load this project"
                          >
                            Open in Forge →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── Info note ── */}
              <div className="pd-circuit-local-note">
                <span className="pd-circuit-local-note-icon">ℹ️</span>
                <span>
                  Circuits are saved in your browser's local storage. To load a saved circuit,
                  open Circuit Forge and click <strong>Load Project</strong>.
                </span>
              </div>
            </div>
          );
        })()}

        {/* ══════════════ ENGAGEMENT TAB ══════════════ */}
        {activeTab === "engagement" && (() => {
          // Subject-aware weakest topic
          const weakestTopicEntry = activeSubject === "COAL"
            ? Object.entries(coalTopicStats).sort((a, b) => a[1] - b[1])[0]
            : Object.entries(topicStats).sort((a, b) => a[1] - b[1])[0];

          const COAL_TOPIC_LABELS = {
            foundations:   "Foundations",
            machineCycle:  "Machine Model & Instruction Cycle",
            isaAddressing: "ISA & Addressing",
            assembly:      "Assembly Programming",
            x86Arch:       "x86 / IA-32 Architecture",
            ioInterrupts:  "I/O, Interrupts & System Design",
            perfPipeline:  "Architecture & Performance",
          };

          const DLD_TOPIC_LABELS_MAP = {
            booleanAlgebra: "Boolean Algebra",
            numberSystems:  "Number Systems",
            arithmetic:     "Arithmetic & HDLs",
            combinational:  "Combinational Circuits",
            sequential:     "Sequential Circuits",
            registers:      "Registers & Transfers",
            memorySystems:  "Memory Systems",
            advancedLogic:  "Advanced Logic",
          };

          const weakestLabel = weakestTopicEntry
            ? (activeSubject === "COAL"
                ? (COAL_TOPIC_LABELS[weakestTopicEntry[0]] || weakestTopicEntry[0])
                : (DLD_TOPIC_LABELS_MAP[weakestTopicEntry[0]] || weakestTopicEntry[0]))
            : "a new topic";

          const DLD_PORTALS = [
            { icon: "⊕", label: "Circuit Forge",    desc: "Build & simulate logic circuits",   path: "/boolforge",                    color: COLORS.blue   },
            { icon: "◈", label: "K-Map Studio",      desc: "Simplify Boolean expressions",      path: "/kmapgenerator",                 color: COLORS.purple },
            { icon: "#", label: "Number Systems",    desc: "Convert & calculate across bases",  path: "/number-systems/calculator",     color: COLORS.green  },
            { icon: "≡", label: "Flip-Flops",        desc: "Sequential circuit deep dive",      path: "/sequential/flip-flops",         color: COLORS.amber  },
            { icon: "∿", label: "Timing Diagrams",   desc: "Visualise signal propagation",      path: "/timing-diagrams",               color: COLORS.cyan   },
            { icon: "✦", label: "DLD Problems",      desc: "Practice & reinforce concepts",     path: "/problems",                      color: COLORS.pink   },
          ];

          const COAL_PORTALS = [
            { icon: "📖", label: "COAL Theory",      desc: "All 7 parts — structured modules",  path: "/resources/coal/theory",         color: COLORS.purple },
            { icon: "🔬", label: "COAL Practical",   desc: "Lab sessions & hands-on drills",    path: "/resources/coal/practical",      color: COLORS.cyan   },
            { icon: "✦", label: "COAL Problems",     desc: "Conceptual practice questions",     path: "/resources/coal/problems",       color: COLORS.blue   },
            { icon: "🖥️", label: "Assembly Drills",  desc: "x86 assembly drill exercises",      path: "/resources/coal/practical/assembly-drills", color: COLORS.amber },
            { icon: "📍", label: "Addressing Modes", desc: "Interactive mode playground",       path: "/resources/coal/practical/addressing-mode-playground", color: COLORS.green },
            { icon: "⚙️", label: "Instruction Lab",  desc: "Step through instruction execution",path: "/resources/coal/practical/instruction-laboratory", color: COLORS.indigo },
          ];

          const PORTALS = activeSubject === "COAL" ? COAL_PORTALS : DLD_PORTALS;

          const DLD_SIGNAL_TOPICS = [
            { label: "Boolean",      pct: topicStats.booleanAlgebra, color: COLORS.blue   },
            { label: "Numbers",      pct: topicStats.numberSystems,  color: COLORS.cyan   },
            { label: "Arithmetic",   pct: topicStats.arithmetic,     color: COLORS.amber  },
            { label: "Combinational",pct: topicStats.combinational,  color: COLORS.green  },
            { label: "Sequential",   pct: topicStats.sequential,     color: COLORS.purple },
            { label: "Registers",    pct: topicStats.registers,      color: COLORS.pink   },
            { label: "Memory",       pct: topicStats.memorySystems,  color: COLORS.indigo },
            { label: "Advanced",     pct: topicStats.advancedLogic,  color: COLORS.red    },
          ];

          const COAL_SIGNAL_TOPICS = [
            { label: "Foundations", pct: coalTopicStats.foundations,   color: COLORS.purple },
            { label: "Machine",     pct: coalTopicStats.machineCycle,  color: COLORS.cyan   },
            { label: "ISA",         pct: coalTopicStats.isaAddressing, color: COLORS.blue   },
            { label: "Assembly",    pct: coalTopicStats.assembly,      color: COLORS.amber  },
            { label: "x86",         pct: coalTopicStats.x86Arch,       color: COLORS.indigo },
            { label: "I/O",         pct: coalTopicStats.ioInterrupts,  color: COLORS.pink   },
            { label: "Pipeline",    pct: coalTopicStats.perfPipeline,  color: COLORS.green  },
          ];

          const SIGNAL_TOPICS = activeSubject === "COAL" ? COAL_SIGNAL_TOPICS : DLD_SIGNAL_TOPICS;

          const activeSolveCount  = activeSubject === "COAL" ? coalSolvedCount    : dldSolvedCount;
          const activeAttemptAmt  = activeSubject === "COAL" ? coalAttemptedCount : dldAttemptedCount;
          const activeAccuracy    = activeSubject === "COAL"
            ? (coalPartsCompleted > 0 ? Math.round((coalPartsCompleted / coalPartsTotal) * 100) : 0)
            : (dldSolvedCount > 0 ? Math.round((dldSolvedCount / Math.max(dldAttemptedCount, 1)) * 100) : 0);

          const STUDY_PLAN = activeSubject === "COAL" ? [
            {
              phase: "01", label: "Warm Up",
              task: `Review ${weakestLabel} for 5 min`,
              icon: "🔥", color: COLORS.amber,
              done: Object.values(coalTopicStats).some((v) => v > 0),
            },
            {
              phase: "02", label: "Study",
              task: `Read through an unfinished COAL part`,
              icon: "📖", color: COLORS.purple,
              done: coalPartsCompleted > 0,
            },
            {
              phase: "03", label: "Explore",
              task: coalPartsCompleted < 3
                ? "Open an unvisited COAL part"
                : "Revisit a part you haven't fully completed",
              icon: "🔬", color: COLORS.cyan,
              done: coalPartsCompleted > 0,
            },
            {
              phase: "04", label: "Reflect",
              task: "Check your COAL Skills tab — spot any gaps",
              icon: "📊", color: COLORS.green,
              done: false,
            },
          ] : [
            {
              phase: "01", label: "Warm Up",
              task: `Review ${weakestLabel} for 5 min`,
              icon: "🔥", color: COLORS.amber,
              done: dldAttemptedCount > 0 || dldTopicsCompleted > 0,
            },
            {
              phase: "02", label: "Solve",
              task: `Attempt ${Math.max(1, 5 - (dldSolvedCount % 5))} new DLD problem${Math.max(1, 5 - (dldSolvedCount % 5)) > 1 ? "s" : ""}`,
              icon: "🎯", color: COLORS.blue,
              done: dldSolvedCount > 0,
            },
            {
              phase: "03", label: "Explore",
              task: dldTopicsCompleted < 3
                ? "Open an unvisited DLD topic"
                : "Revisit a completed topic",
              icon: "📖", color: COLORS.purple,
              done: dldTopicsCompleted > 0,
            },
            {
              phase: "04", label: "Reflect",
              task: "Check your DLD Skills tab — spot any gaps",
              icon: "📊", color: COLORS.green,
              done: false,
            },
          ];

          return (
            <div className="pd-section">

              {/* ── Subject toggle ── */}
              <div className="pd-subject-toggle-wrap">
                <div className="pd-subject-toggle">
                  <button type="button"
                    className={`pd-subject-pill${activeSubject === "DLD" ? " pd-subject-pill--active pd-subject-pill--dld" : ""}`}
                    onClick={() => setActiveSubject("DLD")}>⚡ DLD</button>
                  <button type="button"
                    className={`pd-subject-pill${activeSubject === "COAL" ? " pd-subject-pill--active pd-subject-pill--coal" : ""}`}
                    onClick={() => setActiveSubject("COAL")}>🖥️ COAL</button>
                </div>
                <span className="pd-subject-toggle-label">
                  {activeSubject === "COAL" ? "Computer Organization & Assembly Language" : "Digital Logic Design"}
                </span>
              </div>

              {/* ── Status strip ── */}
              <div className="eng-status-strip">
                {[
                  { label: "Active Days",    value: activeDays,               icon: "📅", color: COLORS.blue   },
                  { label: "Current Streak", value: `${streakCurrent}d`,      icon: "🔥", color: COLORS.amber  },
                  { label: "Best Streak",    value: `${streakLongest}d`,      icon: "⚡", color: COLORS.purple },
                  activeSubject === "COAL"
                    ? { label: "Course Progress", value: `${activeAccuracy}%`, icon: "🎯", color: COLORS.green }
                    : { label: "DLD Accuracy",    value: activeAccuracy > 0 ? `${activeAccuracy}%` : "—", icon: "🎯", color: COLORS.green },
                  activeSubject === "COAL"
                    ? { label: "Parts Completed", value: `${coalPartsCompleted}/${coalPartsTotal}`, icon: "✅", color: COLORS.cyan }
                    : { label: "DLD Solved",      value: dldSolvedCount, icon: "✅", color: COLORS.cyan },
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
                  <p className="eng-section-sub">
                    {activeSubject === "COAL"
                      ? "Jump into COAL labs, theory, and problems"
                      : "Jump straight into any DLD tool"}
                  </p>
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
