import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Compass,
  Flame,
  FolderHeart,
  GraduationCap,
  LibraryBig,
  Lock,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Navbar } from "../Home/Navbar";
import useLearningProgress from "../../hooks/useLearningProgress";
import coreTopics from "../../data/coreTopics";
import problemsCatalog, {
  problemBannerCards,
  problemDifficultyOptions,
  problemFilterGroups,
  problemSortOptions,
  problemStatusOptions,
} from "./problemCatalog";
import ProblemModal from "./ProblemModal";
import "./ProblemsPage.css";
import {
  trackPracticeEngagement,
  trackTopicEngagement,
} from "../../utils/analytics";

const leftNavItems = [
  { label: "Library", icon: LibraryBig, active: true },
  { label: "Quest", icon: Trophy, badge: "New" },
  { label: "Explore", icon: Compass },
  { label: "Study Plan", icon: GraduationCap },
  { label: "My Lists", icon: BookOpen },
  { label: "Favorites", icon: FolderHeart },
];

const difficultyTone = {
  Easy: "easy",
  Medium: "medium",
  Hard: "hard",
};

const weekdayLabels = ["S", "M", "T", "W", "T", "F", "S"];

const topicLookup = Object.fromEntries(
  coreTopics.map((topic) => [topic.id, topic]),
);

const problemTopicLandingMap = {
  "boolean-algebra": {
    group: "Boolean Algebra",
    title: "Boolean Algebra Problems",
    description:
      "Practice identities, laws, consensus, SOP, POS, minterms, and maxterms with exam-oriented Boolean algebra questions.",
    links: [
      { to: "/boolean/overview", label: "Boolean algebra tutorial" },
      { to: "/boolean/minterms-maxterms", label: "Minterms and maxterms" },
      { to: "/standard-forms", label: "SOP and POS guide" },
    ],
  },
  "k-map": {
    group: "Boolean Algebra",
    title: "K-Map Problems",
    description:
      "Train on Karnaugh map grouping, SOP/POS simplification, and expression minimization with guided K-map practice.",
    links: [
      { to: "/kmapgenerator", label: "K-map simplifier online" },
      { to: "/boolean/minterms", label: "Minterms tutorial" },
      { to: "/boolean/maxterms", label: "Maxterms tutorial" },
    ],
  },
  "number-systems": {
    group: "Number Systems",
    title: "Number System Problems",
    description:
      "Practice number conversion, complements, signed representation, and binary arithmetic across common base systems.",
    links: [
      { to: "/number-systems/calculator", label: "Number system calculator" },
      { to: "/number-systems/number-conversion", label: "Base conversion tutorial" },
      { to: "/arithmetic/complements", label: "2's complement guide" },
    ],
  },
  "sequential-circuits": {
    group: "Sequential Circuits",
    title: "Sequential Circuit Problems",
    description:
      "Revise latches, flip-flops, state tables, and sequence design with focused sequential-circuit practice.",
    links: [
      { to: "/sequential/intro", label: "Sequential circuits introduction" },
      { to: "/sequential/state-diagram", label: "State diagrams and tables" },
      { to: "/timing-diagrams", label: "Timing diagrams" },
    ],
  },
  "flip-flops": {
    group: "Sequential Circuits",
    title: "Flip-Flop Problems",
    description:
      "Review SR, JK, D, and T flip-flop truth tables, excitation behavior, and exam-style practice questions.",
    links: [
      { to: "/sequential/flip-flops", label: "Flip-flops tutorial" },
      { to: "/sequential/flip-flop-types", label: "Flip-flop types" },
      { to: "/problems/sequential-circuits", label: "Sequential circuit problems" },
    ],
  },
};

const monthLabel = (date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);

const sortProblems = (items, sortValue, progressMap) => {
  const cloned = [...items];
  const difficultyRank = {
    Easy: 1,
    Medium: 2,
    Hard: 3,
  };

  switch (sortValue) {
    case "Acceptance":
      return cloned.sort(
        (left, right) => right.acceptanceRate - left.acceptanceRate,
      );
    case "Difficulty":
      return cloned.sort(
        (left, right) =>
          difficultyRank[left.difficulty] - difficultyRank[right.difficulty],
      );
    case "Title":
      return cloned.sort((left, right) =>
        left.title.localeCompare(right.title),
      );
    default:
      return cloned.sort((left, right) => {
        const leftStatus = progressMap[left.id]?.status || "not_started";
        const rightStatus = progressMap[right.id]?.status || "not_started";
        if (leftStatus === "solved" && rightStatus !== "solved") return 1;
        if (rightStatus === "solved" && leftStatus !== "solved") return -1;
        return left.numericId - right.numericId;
      });
  }
};

function CalendarWidget({ month, setMonth, monthMatrix }) {
  const days = monthMatrix(month);
  const firstWeekday = new Date(days[0]?.date || month).getDay();
  const blanks = Array.from(
    { length: firstWeekday },
    (_, index) => `blank-${index}`,
  );

  return (
    <section className="problems-widget">
      <div className="problems-widget-head">
        <div>
          <span className="problems-widget-label">Activity</span>
          <h3>{monthLabel(month)}</h3>
        </div>
        <div className="calendar-nav">
          <button
            type="button"
            onClick={() =>
              setMonth(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
              )
            }
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() =>
              setMonth(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
              )
            }
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="calendar-weekdays">
        {weekdayLabels.map((label, index) => (
          <span key={`${label}-${index}`}>{label}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {blanks.map((blank) => (
          <span key={blank} className="calendar-cell calendar-cell-blank" />
        ))}

        {days.map((day) => (
          <div
            key={day.date}
            className={`calendar-cell intensity-${day.intensity}`}
            title={`${day.date}: ${day.solved} solved, ${day.attempts} attempts, ${day.topicsCompleted} topics completed`}
          >
            {Number(day.date.slice(-2))}
          </div>
        ))}
      </div>

      <div className="calendar-legend">
        <span>Less</span>
        <div className="calendar-legend-scale">
          {[0, 1, 2, 3, 4].map((tone) => (
            <span key={tone} className={`calendar-cell intensity-${tone}`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </section>
  );
}

function SelectedProblemCard({ problem, status, onAttempt, onToggleSolved }) {
  if (!problem) {
    return null;
  }

  return (
    <section className="problems-widget selected-problem-widget">
      <div className="problems-widget-head">
        <div>
          <span className="problems-widget-label">Selected Problem</span>
          <h3>{problem.title}</h3>
        </div>
        <span
          className={`difficulty-pill ${difficultyTone[problem.difficulty]}`}
        >
          {problem.difficulty}
        </span>
      </div>

      <p className="selected-problem-description">{problem.description}</p>

      <div className="selected-problem-tags">
        {problem.tags.slice(0, 5).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className="selected-problem-meta">
        <span>Acceptance {problem.acceptanceRate}%</span>
        <span>{status?.attempts || 0} attempts</span>
        <span>{status?.status === "solved" ? "Solved" : "In progress"}</span>
      </div>

      {problem.hint ? (
        <p className="selected-problem-hint">Hint: {problem.hint}</p>
      ) : null}

      <div className="selected-problem-actions">
        <button type="button" onClick={() => onAttempt(problem)}>
          Record attempt
        </button>
        <button
          type="button"
          className={status?.status === "solved" ? "is-solved" : ""}
          onClick={() => onToggleSolved(problem, status?.status !== "solved")}
        >
          {status?.status === "solved" ? "Mark unsolved" : "Mark solved"}
        </button>
        <Link to="/boolforge" className="selected-problem-link">
          Open Circuit Forge
        </Link>
      </div>
    </section>
  );
}

export default function ProblemsPage() {
  const { topicSlug } = useParams();
  const { user } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();
  const topicLanding = topicSlug ? problemTopicLandingMap[topicSlug] : null;
  const [activeLibraryItem, setActiveLibraryItem] = React.useState("Library");
  const bannerRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const updateScrollButtons = React.useCallback(() => {
    const el = bannerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  React.useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    const ro = new ResizeObserver(updateScrollButtons);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      ro.disconnect();
    };
  }, [updateScrollButtons]);

  const scrollBanner = (direction) => {
    if (!bannerRef.current) return;
    const scrollAmount = bannerRef.current.offsetWidth * 0.75;
    bannerRef.current.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  };
  const [activeGroup, setActiveGroup] = React.useState(
    topicLanding?.group || "All Topics",
  );
  const [searchTerm, setSearchTerm] = React.useState("");
  const [difficulty, setDifficulty] = React.useState(
    problemDifficultyOptions[0],
  );
  const [topicFilter, setTopicFilter] = React.useState(
    topicLanding?.group || problemFilterGroups[0],
  );
  const [statusFilter, setStatusFilter] = React.useState(
    problemStatusOptions[0],
  );
  const [sortBy, setSortBy] = React.useState(problemSortOptions[0]);
  const [selectedProblemId, setSelectedProblemId] = React.useState(
    problemsCatalog[0]?.id,
  );
  const [activeProblem, setActiveProblem] = React.useState(null);
  const [month, setMonth] = React.useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const deferredSearch = React.useDeferredValue(searchTerm);

  React.useEffect(() => {
    const nextGroup = topicLanding?.group || "All Topics";
    setActiveGroup(nextGroup);
    setTopicFilter(nextGroup);
  }, [topicLanding]);

  React.useEffect(() => {
    if (!topicLanding) return;
    trackTopicEngagement(topicLanding.group, "landing_view", {
      landing_slug: topicSlug,
    });
  }, [topicLanding, topicSlug]);

  const { snapshot, recordAttempt, setProblemSolved, monthMatrix } =
    useLearningProgress({
      user,
      topics: coreTopics,
      problems: problemsCatalog,
    });

  const filteredProblems = React.useMemo(() => {
    const normalizedSearch = deferredSearch.trim().toLowerCase();

    const matches = problemsCatalog.filter((problem) => {
      const problemStatus =
        snapshot.state.problems[problem.id]?.status || "not_started";
      const matchesSearch =
        !normalizedSearch ||
        problem.title.toLowerCase().includes(normalizedSearch) ||
        problem.description.toLowerCase().includes(normalizedSearch) ||
        problem.tags.some((tag) =>
          tag.toLowerCase().includes(normalizedSearch),
        );

      const matchesDifficulty =
        difficulty === "All Difficulties" || problem.difficulty === difficulty;

      const matchesGroup =
        activeGroup === "All Topics" ||
        problem.filterGroup === activeGroup ||
        problem.topic === activeGroup;

      const matchesTopic =
        topicFilter === "All Topics" ||
        problem.filterGroup === topicFilter ||
        problem.topic === topicFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        (statusFilter === "Solved" && problemStatus === "solved") ||
        (statusFilter === "Attempted" && problemStatus === "attempted") ||
        (statusFilter === "Unsolved" && problemStatus === "not_started");

      return (
        matchesSearch &&
        matchesDifficulty &&
        matchesGroup &&
        matchesTopic &&
        matchesStatus
      );
    });

    return sortProblems(matches, sortBy, snapshot.state.problems);
  }, [
    activeGroup,
    deferredSearch,
    difficulty,
    sortBy,
    snapshot.state.problems,
    statusFilter,
    topicFilter,
  ]);

  React.useEffect(() => {
    if (!filteredProblems.length) {
      setSelectedProblemId(null);
      return;
    }

    const stillVisible = filteredProblems.some(
      (problem) => problem.id === selectedProblemId,
    );
    if (!stillVisible) {
      setSelectedProblemId(filteredProblems[0].id);
    }
  }, [filteredProblems, selectedProblemId]);

  const selectedProblem = React.useMemo(
    () =>
      filteredProblems.find((problem) => problem.id === selectedProblemId) ||
      problemsCatalog.find((problem) => problem.id === selectedProblemId) ||
      filteredProblems[0] ||
      null,
    [filteredProblems, selectedProblemId],
  );

  const topTopicProgress = coreTopics
    .map((topic) => ({
      topic,
      progress: snapshot.state.topics[topic.id],
    }))
    .sort(
      (left, right) =>
        (right.progress?.completionPercentage || 0) -
        (left.progress?.completionPercentage || 0),
    )
    .slice(0, 4);

  const handleRecordAttempt = React.useCallback(
    (problem) => {
      trackPracticeEngagement("record_attempt", {
        problem_id: problem.id,
        problem_title: problem.title,
        problem_topic: problem.topic,
      });
      recordAttempt(problem);
    },
    [recordAttempt],
  );

  const handleSetProblemSolved = React.useCallback(
    (problem, solved) => {
      trackPracticeEngagement(solved ? "mark_solved" : "mark_unsolved", {
        problem_id: problem.id,
        problem_title: problem.title,
        problem_topic: problem.topic,
      });
      setProblemSolved(problem, solved);
    },
    [setProblemSolved],
  );

  return (
    <div className={`problems-page theme-${theme}`}>
      <div className="problems-backdrop problems-backdrop-left" />
      <div className="problems-backdrop problems-backdrop-right" />

      <Navbar toggleTheme={toggleTheme} theme={theme} />

      <main className="problems-shell">
        <aside className="problems-sidebar">
          <div className="problems-sidebar-brand">
            <span className="problems-sidebar-badge">Practice Arena</span>
            <h1>{topicLanding?.title || "Problems"}</h1>
            <p>
              {topicLanding?.description ||
                "LeetCode-style digital logic practice with activity, progress, and topic depth."}
            </p>
          </div>

          <nav
            className="problems-sidebar-nav"
            aria-label="Problems navigation"
          >
            {leftNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeLibraryItem === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  className={`problems-sidebar-link ${isActive ? "is-active" : ""}`}
                  onClick={() => setActiveLibraryItem(item.label)}
                >
                  <span className="problems-sidebar-link-main">
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </span>
                  {item.badge ? (
                    <span className="problems-sidebar-link-badge">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          <section className="problems-sidebar-foot">
            <div>
              <strong>{snapshot.summary.solvedProblems}</strong>
              <span>Solved</span>
            </div>
            <div>
              <strong>{snapshot.summary.attemptedProblems}</strong>
              <span>Attempted</span>
            </div>
            <div>
              <strong>{snapshot.summary.streaks.current}</strong>
              <span>Streak</span>
            </div>
          </section>
        </aside>

        <section className="problems-center">
          <div className="problems-banner-slider">
            {canScrollLeft && (
              <button
                type="button"
                className="banner-slider-arrow banner-slider-arrow-left"
                onClick={() => scrollBanner(-1)}
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            <div className="problems-banner-row" ref={bannerRef}>
              {problemBannerCards.map((card) => (
                <article
                  key={card.title}
                  className="problems-banner-card"
                  style={{ background: card.gradient }}
                >
                  <span>{card.eyebrow}</span>
                  <h2>{card.title}</h2>
                  <p>{card.description}</p>
                </article>
              ))}
            </div>

            {canScrollRight && (
              <button
                type="button"
                className="banner-slider-arrow banner-slider-arrow-right"
                onClick={() => scrollBanner(1)}
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>

          <div className="problems-filter-chip-row">
            {problemFilterGroups.map((group) => (
              <button
                key={group}
                type="button"
                className={`problems-filter-chip ${activeGroup === group ? "is-active" : ""}`}
                onClick={() => {
                  setActiveGroup(group);
                  setTopicFilter(group);
                  trackPracticeEngagement("topic_filter_click", {
                    filter_group: group,
                  });
                }}
              >
                {group}
              </button>
            ))}
          </div>

          {topicLanding ? (
            <section className="problems-widget" aria-labelledby="topic-cluster-links">
              <div className="problems-widget-head">
                <div>
                  <span className="problems-widget-label">Topic Cluster</span>
                  <h2 id="topic-cluster-links">Related Tutorials</h2>
                </div>
              </div>
              <div className="selected-problem-tags">
                {topicLanding.links.map((link) => (
                  <Link key={link.to} to={link.to}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <section className="problems-toolbar">
            <label className="problems-search">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search problems, tags, circuits, latches..."
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  if (event.target.value.length > 2) {
                    trackPracticeEngagement("search_query", {
                      query_length: event.target.value.length,
                    });
                  }
                }}
              />
            </label>

            <div className="problems-toolbar-selects">
              <select
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
              >
                {problemDifficultyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <select
                value={topicFilter}
                onChange={(event) => setTopicFilter(event.target.value)}
              >
                {problemFilterGroups.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                {problemStatusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                {problemSortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="problems-table-card">
            <div className="problems-table-summary">
              <div>
                <span className="table-summary-label">Problem Library</span>
                <strong>{filteredProblems.length} visible challenges</strong>
              </div>
              <div className="table-summary-stats">
                <span>
                  <Flame size={15} />
                  {snapshot.summary.streaks.current} day streak
                </span>
                <span>
                  <Sparkles size={15} />
                  {snapshot.summary.completionRate}% completion
                </span>
              </div>
            </div>

            <div className="problems-table-wrap">
              <table className="problems-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Acceptance</th>
                    <th>Difficulty</th>
                    <th>Access</th>
                    <th>Status</th>
                    <th>Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProblems.map((problem) => {
                    const progress = snapshot.state.problems[problem.id] || {};
                    const solved = progress.status === "solved";
                    const attempted = progress.status === "attempted";
                    const isSelected = selectedProblemId === problem.id;

                    return (
                      <tr
                        key={problem.id}
                        className={isSelected ? "is-selected" : ""}
                        onClick={() => {
                          setSelectedProblemId(problem.id);
                          setActiveProblem(problem);
                          trackPracticeEngagement("open_problem", {
                            problem_id: problem.id,
                            problem_title: problem.title,
                            problem_topic: problem.topic,
                          });
                        }}
                      >
                        <td>{problem.listId}</td>
                        <td>
                          <div className="problem-title-cell">
                            <span className="problem-title-text">
                              {problem.title}
                            </span>
                            <span className="problem-topic-text">
                              {problem.topic}
                            </span>
                          </div>
                        </td>
                        <td>{problem.acceptanceRate}%</td>
                        <td>
                          <span
                            className={`difficulty-pill ${difficultyTone[problem.difficulty]}`}
                          >
                            {problem.difficulty}
                          </span>
                        </td>
                        <td>
                          {problem.premium ? (
                            <Lock size={16} aria-label="Premium problem" />
                          ) : (
                            "Open"
                          )}
                        </td>
                        <td>
                          <button
                            type="button"
                            className={`status-chip ${solved ? "is-solved" : attempted ? "is-attempted" : ""}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              if (solved) {
                                handleSetProblemSolved(problem, false);
                              } else if (attempted) {
                                handleSetProblemSolved(problem, true);
                              } else {
                                handleRecordAttempt(problem);
                              }
                            }}
                          >
                            {solved
                              ? "Solved"
                              : attempted
                                ? "Attempted"
                                : "Start"}
                          </button>
                        </td>
                        <td>
                          <div className="problem-tag-list">
                            {problem.tags.slice(0, 3).map((tag) => (
                              <span key={tag}>{tag}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {!filteredProblems.length ? (
                <div className="problems-empty-state">
                  <h3>No problems match those filters yet</h3>
                  <p>
                    Try widening the topic, difficulty, or solved-state filters.
                  </p>
                </div>
              ) : null}
            </div>
          </section>
        </section>

        <aside className="problems-right-rail">
          <div className="problems-widget stats-widget">
            <div className="problems-widget-head">
              <div>
                <span className="problems-widget-label">Learner Snapshot</span>
                <h3>
                  {user?.name ? `${user.name}'s progress` : "Guest progress"}
                </h3>
              </div>
            </div>

            <div className="stats-grid">
              <div>
                <strong>{snapshot.summary.solvedProblems}</strong>
                <span>Solved</span>
              </div>
              <div>
                <strong>{snapshot.summary.attemptedProblems}</strong>
                <span>Attempted</span>
              </div>
              <div>
                <strong>{snapshot.summary.completedTopics}</strong>
                <span>Topics complete</span>
              </div>
              <div>
                <strong>{snapshot.summary.streaks.longest}</strong>
                <span>Best streak</span>
              </div>
            </div>
          </div>

          <CalendarWidget
            month={month}
            setMonth={setMonth}
            monthMatrix={monthMatrix}
          />

          <SelectedProblemCard
            problem={selectedProblem}
            status={
              selectedProblem
                ? snapshot.state.problems[selectedProblem.id]
                : null
            }
            onAttempt={handleRecordAttempt}
            onToggleSolved={handleSetProblemSolved}
          />

          <section className="problems-widget">
            <div className="problems-widget-head">
              <div>
                <span className="problems-widget-label">Topic Progress</span>
                <h3>Top learning paths</h3>
              </div>
            </div>

            <div className="topic-progress-mini-list">
              {topTopicProgress.map(({ topic, progress }) => (
                <div key={topic.id} className="topic-progress-mini-item">
                  <div className="topic-progress-mini-copy">
                    <strong>{topic.title}</strong>
                    <span>
                      {progress?.completedCount || 0}/
                      {progress?.totalSubtopics || topic.links.length} modules
                    </span>
                  </div>
                  <div className="topic-progress-mini-bar">
                    <span
                      style={{
                        width: `${progress?.completionPercentage || 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="problems-widget">
            <div className="problems-widget-head">
              <div>
                <span className="problems-widget-label">Recent Activity</span>
                <h3>Latest actions</h3>
              </div>
            </div>

            <div className="recent-activity-list">
              {snapshot.recentEvents.length ? (
                snapshot.recentEvents.slice(0, 5).map((event) => {
                  const topic = event.topicId
                    ? topicLookup[event.topicId]
                    : null;
                  return (
                    <div key={event.id} className="recent-activity-item">
                      <strong>
                        {event.type === "problem_solved" && "Solved problem"}
                        {event.type === "problem_attempted" &&
                          "Attempted problem"}
                        {event.type === "topic_opened" && "Opened topic"}
                        {event.type === "topic_completed" && "Completed topic"}
                      </strong>
                      <span>
                        {event.title || topic?.title || "Learning activity"}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="recent-activity-empty">
                  Start solving or opening modules to populate your activity
                  stream.
                </p>
              )}
            </div>
          </section>
        </aside>
      </main>

      {activeProblem && (
        <ProblemModal
          problem={activeProblem}
          onClose={() => setActiveProblem(null)}
          onSolved={(problem) => handleSetProblemSolved(problem, true)}
        />
      )}
    </div>
  );
}
