import progressService, { progressTestUtils } from "./progressService";

const userKey = "student@example.com";

const sampleTopic = {
  id: "boolean-algebra",
  title: "BOOLEAN ALGEBRA",
  links: [
    { id: "overview", text: "Overview" },
    { id: "laws", text: "Laws" },
  ],
};

const sampleProblem = {
  id: 42,
  title: "Half Adder",
  tags: ["Arithmetic"],
  primaryTopicId: "arithmetic-functions-and-hdls",
};

beforeEach(() => {
  window.localStorage.clear();
});

test("records problem attempts and solved state per user", async () => {
  await progressService.recordAttempt(userKey, sampleProblem, { problems: [sampleProblem] });
  await progressService.setProblemSolved(userKey, sampleProblem, true, {
    problems: [sampleProblem],
  });

  const snapshot = progressService.getSnapshot(userKey, {
    topics: [],
    problems: [sampleProblem],
  });

  expect(snapshot.summary.attemptedProblems).toBe(1);
  expect(snapshot.summary.solvedProblems).toBe(1);
  expect(snapshot.state.problems[sampleProblem.id].status).toBe("solved");
});

test("tracks topic completion percentage and topic-completed activity", async () => {
  await progressService.openTopic(userKey, sampleTopic, { topics: [sampleTopic] });
  await progressService.toggleSubtopicCompleted(userKey, sampleTopic, "overview", {
    topics: [sampleTopic],
  });
  await progressService.toggleSubtopicCompleted(userKey, sampleTopic, "laws", {
    topics: [sampleTopic],
  });

  const snapshot = progressService.getSnapshot(userKey, {
    topics: [sampleTopic],
    problems: [],
  });

  expect(snapshot.state.topics[sampleTopic.id].completionPercentage).toBe(100);
  expect(snapshot.summary.completedTopics).toBe(1);
  expect(snapshot.recentEvents.some((event) => event.type === "topic_completed")).toBe(true);
});

test("builds a calendar matrix with intensity values from activity", async () => {
  await progressService.recordAttempt(userKey, sampleProblem, { problems: [sampleProblem] });
  await progressService.setProblemSolved(userKey, sampleProblem, true, {
    problems: [sampleProblem],
  });

  const monthMatrix = progressTestUtils.getMonthMatrix(
    (progressTestUtils._getCache(userKey) || {}).activity || {},
    new Date(),
  );
  const todayKey = new Date().toISOString().slice(0, 10);
  const today = monthMatrix.find((day) => day.date === todayKey);

  expect(today).toBeTruthy();
  expect(today.solved).toBeGreaterThan(0);
  expect(today.intensity).toBeGreaterThan(0);
});
