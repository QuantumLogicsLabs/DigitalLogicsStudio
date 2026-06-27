import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import progressService from "../services/progressService";

export default function useLearningProgress({
  user,
  topics = [],
  problems = [],
}) {
  const userKey = useMemo(() => progressService.getUserKey(user), [user]);

  // Stabilize catalog with a deep-equality ref so a new array reference
  // from the parent (e.g. filtered topics) doesn't trigger effects on every render.
  const catalogRef = useRef(null);
  const topicsKey = (topics || []).map((t) => t?.id || "").join(",");
  const problemsKey = (problems || []).map((p) => p?.id ?? p ?? "").join(",");

  if (
    catalogRef.current === null ||
    catalogRef.current._topicsKey !== topicsKey ||
    catalogRef.current._problemsKey !== problemsKey
  ) {
    catalogRef.current = {
      topics,
      problems,
      _topicsKey: topicsKey,
      _problemsKey: problemsKey,
    };
  }

  const catalog = catalogRef.current;

  const [snapshot, setSnapshot] = useState(() =>
    progressService.getSnapshot(userKey, catalog),
  );

  // On mount (or when userKey changes), load the full progress state from MongoDB.
  const loadedFromDBRef = useRef(null);

  useEffect(() => {
    if (!user || userKey === "guest") return;
    if (loadedFromDBRef.current === userKey) return;
    loadedFromDBRef.current = userKey;

    progressService.loadFromDB(userKey).then(() => {
      setSnapshot(progressService.getSnapshot(userKey, catalog));
    });
  }, [userKey, user, catalog]);

  // Fallback sync for legacy solvedProblems array on the user object.
  const syncedRef = useRef(null);

  useEffect(() => {
    const dbSolved = user?.solvedProblems;
    if (!Array.isArray(dbSolved) || dbSolved.length === 0) return;

    const key = `${userKey}:${dbSolved.join(",")}`;
    if (syncedRef.current === key) return;
    syncedRef.current = key;

    progressService.syncSolvedFromDB(userKey, dbSolved, problems);
    setSnapshot(progressService.getSnapshot(userKey, catalog));
  }, [user?.solvedProblems, userKey, problems, catalog]);

  // ❌ REMOVED: the useEffect below was the infinite loop culprit.
  // `catalog` was a new object reference on every render (because `topics`
  // from Home.jsx's useMemo is recreated each render), so this effect fired
  // endlessly: setSnapshot → re-render → new catalog → effect fires again.
  //
  // useEffect(() => {
  //   setSnapshot(progressService.getSnapshot(userKey, catalog));
  // }, [catalog, userKey]);

  const refresh = useCallback(() => {
    setSnapshot(progressService.getSnapshot(userKey, catalog));
  }, [catalog, userKey]);

  const refreshFromDB = useCallback(async () => {
    await progressService.loadFromDB(userKey);
    setSnapshot(progressService.getSnapshot(userKey, catalog));
  }, [catalog, userKey]);

  const recordAttempt = useCallback(
    async (problem) => {
      const nextSnapshot = await progressService.recordAttempt(
        userKey,
        problem,
        catalog,
      );
      setSnapshot(nextSnapshot);
    },
    [catalog, userKey],
  );

  const setProblemSolved = useCallback(
    async (problem, solved) => {
      const nextSnapshot = await progressService.setProblemSolved(
        userKey,
        problem,
        solved,
        catalog,
      );
      setSnapshot(nextSnapshot);
    },
    [catalog, userKey],
  );

  const openTopic = useCallback(
    async (topic) => {
      const nextSnapshot = await progressService.openTopic(
        userKey,
        topic,
        catalog,
      );
      setSnapshot(nextSnapshot);
    },
    [catalog, userKey],
  );

  const toggleSubtopicCompleted = useCallback(
    async (topic, subtopicId) => {
      const nextSnapshot = await progressService.toggleSubtopicCompleted(
        userKey,
        topic,
        subtopicId,
        catalog,
      );
      setSnapshot(nextSnapshot);
    },
    [catalog, userKey],
  );

  const monthMatrix = useCallback(
    (monthInput) => progressService.getMonthMatrix(userKey, monthInput),
    [userKey],
  );

  return {
    userKey,
    snapshot,
    refresh,
    refreshFromDB,
    recordAttempt,
    setProblemSolved,
    openTopic,
    toggleSubtopicCompleted,
    monthMatrix,
  };
}
