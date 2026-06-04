/**
 * progressService.js
 *
 * All progress is stored in MongoDB via the backend API.
 * localStorage is no longer used for progress data.
 *
 * The service maintains an in-memory cache of the full progress state so that
 * all reads are synchronous (same snapshot shape as before) while writes are
 * persisted to the DB asynchronously.
 */

import apiClient from "./apiClient";
import { isPrerendering } from "../utils/prerender";

const guestKey = "guest";

// ─── In-memory cache (per user key) ──────────────────────────────────────────

const cache = {}; // cache[userKey] = { problems, topics, activity, recentEvents }

const defaultState = () => ({
  problems: {},
  topics: {},
  activity: {},
  recentEvents: [],
});

const getCache = (userKey) => {
  if (!cache[userKey]) cache[userKey] = defaultState();
  return cache[userKey];
};

const clone = (v) => JSON.parse(JSON.stringify(v));

// ─── Key helpers ──────────────────────────────────────────────────────────────

const normalizeUserKey = (userOrKey) => {
  if (typeof userOrKey === "string" && userOrKey.trim()) {
    return userOrKey.trim().toLowerCase();
  }
  if (!userOrKey) return guestKey;
  return String(
    userOrKey.id ||
      userOrKey._id ||
      userOrKey.email ||
      userOrKey.username ||
      guestKey,
  ).toLowerCase();
};

// ─── Date helpers ─────────────────────────────────────────────────────────────

const toDateKey = (value = new Date()) => {
  const d = new Date(value);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatMonthKey = (value = new Date()) => {
  const d = new Date(value);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// ─── Snapshot builders ────────────────────────────────────────────────────────

const mergeTopicState = (topic, currentState) => {
  const existing = currentState || {};
  return {
    openedAt: existing.openedAt || null,
    completedAt: existing.completedAt || null,
    completionPercentage: existing.completionPercentage || 0,
    status: existing.status || "not_started",
    completedSubtopics: Array.isArray(existing.completedSubtopics)
      ? existing.completedSubtopics
      : [],
    totalSubtopics: topic?.links?.length || existing.totalSubtopics || 0,
    title: topic?.title || existing.title || "",
  };
};

const calculateTopicCompletion = (topic, topicState) => {
  const totalSubtopics = Math.max(
    topic?.links?.length || topicState.totalSubtopics || 0,
    1,
  );
  const completedCount = topicState.completedSubtopics.length;
  const completionPercentage = Math.round(
    (completedCount / totalSubtopics) * 100,
  );
  return {
    totalSubtopics,
    completedCount,
    completionPercentage,
    status:
      completionPercentage >= 100
        ? "completed"
        : completionPercentage > 0 || topicState.openedAt
          ? "in_progress"
          : "not_started",
  };
};

const calculateStreaks = (activity) => {
  const activeDays = Object.entries(activity)
    .filter(([, v]) => v.solved > 0 || v.attempts > 0 || v.topicsCompleted > 0)
    .map(([k]) => k)
    .sort();

  if (!activeDays.length) return { current: 0, longest: 0, activeDays: 0 };

  let longest = 1;
  let currentRun = 1;
  for (let i = 1; i < activeDays.length; i++) {
    const prev = new Date(activeDays[i - 1]);
    const next = new Date(activeDays[i]);
    const diff = Math.round((next - prev) / 86_400_000);
    if (diff === 1) {
      currentRun++;
      longest = Math.max(longest, currentRun);
    } else currentRun = 1;
  }

  let current = 0;
  let cursor = new Date();
  while (true) {
    const key = toDateKey(cursor);
    const day = activity[key];
    if (
      day &&
      (day.solved > 0 || day.attempts > 0 || day.topicsCompleted > 0)
    ) {
      current++;
      cursor = new Date(cursor.getTime() - 86_400_000);
    } else break;
  }

  return { current, longest, activeDays: activeDays.length };
};

const calculateSummary = (state, topics = [], problems = []) => {
  const problemEntries = Object.values(state.problems || {});
  const topicEntries = Object.values(state.topics || {});
  const solvedProblems = problemEntries.filter(
    (p) => p.status === "solved",
  ).length;
  const attemptedProblems = problemEntries.filter((p) => p.attempts > 0).length;
  const completedTopics = topicEntries.filter(
    (t) => t.status === "completed",
  ).length;
  const streaks = calculateStreaks(state.activity || {});
  return {
    solvedProblems,
    attemptedProblems,
    completedTopics,
    totalProblems: problems.length,
    totalTopics: topics.length,
    completionRate: problems.length
      ? Math.round((solvedProblems / problems.length) * 100)
      : 0,
    streaks,
  };
};

const getMonthMatrix = (activity, monthInput = new Date()) => {
  const monthDate = new Date(monthInput);
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthKey = formatMonthKey(monthDate);

  return Array.from({ length: daysInMonth }, (_, index) => {
    const dateKey = `${monthKey}-${String(index + 1).padStart(2, "0")}`;
    const day = activity[dateKey] || {
      attempts: 0,
      solved: 0,
      topicsCompleted: 0,
      topicsOpened: 0,
    };
    const intensity = Math.min(
      4,
      day.solved > 0
        ? day.solved
        : day.attempts > 0 || day.topicsCompleted > 0 || day.topicsOpened > 0
          ? 1
          : 0,
    );
    return { date: dateKey, ...day, intensity };
  });
};

/** Build the same snapshot shape the rest of the app expects */
const snapshotFor = (userKey, { topics = [], problems = [] } = {}) => {
  const state = clone(getCache(userKey));

  topics.forEach((topic) => {
    state.topics[topic.id] = mergeTopicState(topic, state.topics[topic.id]);
    const derived = calculateTopicCompletion(topic, state.topics[topic.id]);
    state.topics[topic.id] = { ...state.topics[topic.id], ...derived };
  });

  return {
    state,
    summary: calculateSummary(state, topics, problems),
    calendar: getMonthMatrix(state.activity || {}, new Date()),
    recentEvents: clone(state.recentEvents || []),
  };
};

// ─── Remote helpers ───────────────────────────────────────────────────────────

const isTest = () => process.env.NODE_ENV === "test";
const isStaticRender = () => isTest() || isPrerendering();

/** POST to the API, swallow errors (offline / unauthenticated) */
const tryRemotePost = async (path, payload = {}) => {
  if (isStaticRender()) return null;
  try {
    await apiClient.post(path, payload);
  } catch {
    // silently ignore – the in-memory cache is the source of truth while offline
  }
};

// ─── State mutators (update in-memory cache) ──────────────────────────────────

const pushRecentEvent = (state, event) => {
  state.recentEvents = [event, ...(state.recentEvents || [])].slice(0, 30);
};

const ensureActivityDay = (state, dateKey) => {
  if (!state.activity[dateKey]) {
    state.activity[dateKey] = {
      attempts: 0,
      solved: 0,
      topicsCompleted: 0,
      topicsOpened: 0,
    };
  }
  return state.activity[dateKey];
};

const makeEventId = (type) =>
  `${type}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

// ─── Public API ───────────────────────────────────────────────────────────────

const progressService = {
  getUserKey: normalizeUserKey,

  /**
   * Load progress state from MongoDB and populate the in-memory cache.
   * Call this once after login / on app mount (authenticated users only).
   */
  loadFromDB: async (userKey) => {
    if (isStaticRender() || userKey === guestKey) return;
    try {
      const { data } = await apiClient.get("/progress/snapshot");
      if (data?.success && data.state) {
        cache[userKey] = {
          problems: data.state.problems || {},
          topics: data.state.topics || {},
          activity: data.state.activity || {},
          recentEvents: data.state.recentEvents || [],
        };
      }
    } catch {
      // Could not reach backend – start with empty cache
      cache[userKey] = defaultState();
    }
  },

  /**
   * Sync the legacy solvedProblems array from the user object into the cache.
   * Keeps the snapshot consistent when the user logs in.
   */
  syncSolvedFromDB: (userKey, dbSolvedIds, problemCatalog = []) => {
    if (!Array.isArray(dbSolvedIds) || !dbSolvedIds.length) return;
    const state = getCache(userKey);
    dbSolvedIds.forEach((problemId) => {
      const id = Number(problemId);
      if (!Number.isFinite(id)) return;
      const existing = state.problems[id] || {};
      if (existing.status === "solved") return;
      const meta = problemCatalog.find((p) => p.id === id);
      state.problems[id] = {
        attempts: existing.attempts || 1,
        openedAt: existing.openedAt || new Date().toISOString(),
        lastAttemptAt: existing.lastAttemptAt || new Date().toISOString(),
        title: meta?.title || existing.title || `Problem ${id}`,
        tags: meta?.tags || existing.tags || [],
        topicId: meta?.primaryTopicId || existing.topicId || null,
        ...existing,
        status: "solved",
        solvedAt: existing.solvedAt || new Date().toISOString(),
      };
    });
  },

  getSnapshot: snapshotFor,

  getMonthMatrix: (userKey, monthInput) =>
    getMonthMatrix(getCache(userKey).activity || {}, monthInput),

  getStoredState: (userKey) => clone(getCache(userKey)),

  // ── Problem actions ─────────────────────────────────────────────────────────

  recordAttempt: async (userKey, problem, catalog = {}) => {
    const state = getCache(userKey);
    const dateKey = toDateKey();
    const current = state.problems[problem.id] || {
      attempts: 0,
      status: "not_started",
      solvedAt: null,
      openedAt: null,
      title: problem.title,
      tags: problem.tags || [],
      topicId: problem.primaryTopicId || null,
    };
    current.attempts += 1;
    current.status = current.status === "solved" ? "solved" : "attempted";
    current.openedAt = current.openedAt || new Date().toISOString();
    current.lastAttemptAt = new Date().toISOString();
    current.title = problem.title;
    current.tags = problem.tags || [];
    current.topicId = problem.primaryTopicId || current.topicId || null;
    state.problems[problem.id] = current;

    const day = ensureActivityDay(state, dateKey);
    day.attempts += 1;

    pushRecentEvent(state, {
      id: makeEventId("problem_attempted"),
      type: "problem_attempted",
      createdAt: new Date().toISOString(),
      problemId: problem.id,
      title: problem.title,
    });

    await tryRemotePost(`/progress/problems/${problem.id}/attempt`, {
      title: problem.title,
      tags: problem.tags || [],
      topicId: problem.primaryTopicId || null,
      dateKey,
    });

    return snapshotFor(userKey, catalog);
  },

  setProblemSolved: async (userKey, problem, solved, catalog = {}) => {
    const state = getCache(userKey);
    const dateKey = toDateKey();
    const current = state.problems[problem.id] || {
      attempts: 0,
      status: "not_started",
      solvedAt: null,
      openedAt: null,
      title: problem.title,
      tags: problem.tags || [],
      topicId: problem.primaryTopicId || null,
    };

    const wasSolved = current.status === "solved";
    current.status = solved
      ? "solved"
      : current.attempts > 0
        ? "attempted"
        : "not_started";
    current.solvedAt = solved
      ? current.solvedAt || new Date().toISOString()
      : null;
    current.title = problem.title;
    current.tags = problem.tags || [];
    current.topicId = problem.primaryTopicId || current.topicId || null;
    state.problems[problem.id] = current;

    if (solved && !wasSolved) {
      const day = ensureActivityDay(state, dateKey);
      day.solved += 1;
      pushRecentEvent(state, {
        id: makeEventId("problem_solved"),
        type: "problem_solved",
        createdAt: new Date().toISOString(),
        problemId: problem.id,
        title: problem.title,
      });
    }

    const path = solved
      ? `/progress/problems/${problem.id}/complete`
      : `/progress/problems/${problem.id}/uncomplete`;
    await tryRemotePost(path, {
      title: problem.title,
      tags: problem.tags || [],
      dateKey,
    });

    return snapshotFor(userKey, catalog);
  },

  completeProblem: async (problemId, payload = {}) => {
    await tryRemotePost(`/progress/problems/${problemId}/complete`, payload);
    if (payload?.userKey && payload?.problem) {
      // delegate to setProblemSolved for cache update
      const state = getCache(payload.userKey);
      const p = payload.problem;
      state.problems[problemId] = {
        ...(state.problems[problemId] || {}),
        status: "solved",
        solvedAt:
          state.problems[problemId]?.solvedAt || new Date().toISOString(),
        title: p.title,
      };
    }
    return snapshotFor(payload?.userKey || guestKey, payload?.catalog || {});
  },

  // ── Topic actions ───────────────────────────────────────────────────────────

  openTopic: async (userKey, topic, catalog = {}) => {
    const state = getCache(userKey);
    const dateKey = toDateKey();
    const current = mergeTopicState(topic, state.topics[topic.id]);
    current.openedAt = current.openedAt || new Date().toISOString();
    current.status =
      current.status === "completed" ? "completed" : "in_progress";
    state.topics[topic.id] = {
      ...current,
      ...calculateTopicCompletion(topic, current),
    };

    const day = ensureActivityDay(state, dateKey);
    day.topicsOpened += 1;

    pushRecentEvent(state, {
      id: makeEventId("topic_opened"),
      type: "topic_opened",
      createdAt: new Date().toISOString(),
      topicId: topic.id,
      title: topic.title,
    });

    await tryRemotePost(`/progress/topics/${topic.id}/open`, {
      title: topic.title,
      totalSubtopics: topic?.links?.length || 0,
      dateKey,
    });

    return snapshotFor(userKey, catalog);
  },

  toggleSubtopicCompleted: async (userKey, topic, subtopicId, catalog = {}) => {
    const state = getCache(userKey);
    const dateKey = toDateKey();
    const current = mergeTopicState(topic, state.topics[topic.id]);
    const completedSet = new Set(current.completedSubtopics);
    const equivalentIds = [
      subtopicId,
      ...Object.entries(topic?.subtopicAliases || {})
        .filter(([, canonicalId]) => canonicalId === subtopicId)
        .map(([legacyId]) => legacyId),
    ];
    const isCompleted = equivalentIds.some((id) => completedSet.has(id));

    if (isCompleted) equivalentIds.forEach((id) => completedSet.delete(id));
    else completedSet.add(subtopicId);

    current.completedSubtopics = Array.from(completedSet);
    current.openedAt = current.openedAt || new Date().toISOString();

    const derived = calculateTopicCompletion(topic, current);
    const wasCompleted = state.topics[topic.id]?.status === "completed";
    const nextState = {
      ...current,
      ...derived,
      completedAt:
        derived.status === "completed"
          ? current.completedAt || new Date().toISOString()
          : null,
    };
    state.topics[topic.id] = nextState;

    if (!wasCompleted && derived.status === "completed") {
      const day = ensureActivityDay(state, dateKey);
      day.topicsCompleted += 1;
      pushRecentEvent(state, {
        id: makeEventId("topic_completed"),
        type: "topic_completed",
        createdAt: new Date().toISOString(),
        topicId: topic.id,
        title: topic.title,
      });
    }

    await tryRemotePost(
      `/progress/topics/${topic.id}/subtopics/${subtopicId}`,
      {
        title: topic.title,
        subtopicId,
        equivalentSubtopicIds: equivalentIds,
        totalSubtopics: topic?.links?.length || 0,
        dateKey,
      },
    );

    return snapshotFor(userKey, catalog);
  },
};

export const progressTestUtils = {
  normalizeUserKey,
  getMonthMatrix,
  calculateSummary,
  calculateStreaks,
  // Expose cache helpers for tests
  _getCache: getCache,
  _resetCache: (userKey) => {
    cache[userKey] = defaultState();
  },
};

export default progressService;
