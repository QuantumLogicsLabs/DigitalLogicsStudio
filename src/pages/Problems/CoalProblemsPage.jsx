import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Flame,
  GraduationCap,
  LibraryBig,
  Lock,
  Search,
  Sparkles,
  Trophy,
  Cpu,
  Grid,
  Binary,
  Activity,
  Info,
  Menu,
  X,
  Award
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Navbar } from "../Home/Navbar";
import useLearningProgress from "../../hooks/useLearningProgress";
import { coalCourseParts } from "../../data/coalCourseOutline";
import problemsCatalog, {
  problemBannerCards,
  problemDifficultyOptions,
  problemFilterGroups,
  problemSortOptions,
  problemStatusOptions,
} from "./coalProblemsCatalog";
import CoalProblemModal from "./CoalProblemModal";
import "./CoalProblemsPage.css";
import { trackPracticeEngagement } from "../../utils/analytics";

// Generate COAL topic list for useLearningProgress hook
const coalTopicsList = coalCourseParts.flatMap((part) =>
  part.modules.map((mod) => ({
    id: mod.id,
    title: mod.title,
    links: mod.lessons.map((lesson, idx) => ({ id: `${mod.slug}-${idx}` })),
  }))
);

const coalTopicLookup = Object.fromEntries(
  coalTopicsList.map((topic) => [topic.id, topic])
);

// Sidebar sections for COAL
const leftNavSections = [
  {
    title: "Practice Arenas",
    items: [
      {
        label: "Problems Library",
        icon: LibraryBig,
        panel: {
          description: "All COAL problems — signed numbers, instruction tracing, cache operations and more.",
          links: [
            { label: "All Problems", action: "navigate", value: "/resources/coal/problems" },
            { label: "Easy challenges", action: "filter", value: "Easy" },
            { label: "Medium challenges", action: "filter", value: "Medium" },
            { label: "Hard challenges", action: "filter", value: "Hard" },
            { label: "Assembly Code", action: "topic", value: "Assembly Programming" },
            { label: "Cache & Memory", action: "topic", value: "Cache & Memory" },
          ],
        },
      },
      {
        label: "Assembly Lab",
        icon: Cpu,
        topicSlug: "assembly",
        badge: "Interactive",
        panel: {
          description: "Step-by-step assembly instruction execution and register visualization.",
          links: [
            { label: "Trace Simulator", action: "navigate", value: "/resources/coal/practical/instruction-trace-lab" },
            { label: "Assembly Syntax", action: "navigate", value: "/coal/coal-syntax" },
            { label: "Stack & Procedures", action: "navigate", value: "/coal/procedures-stack" },
          ],
        },
      },
    ],
  },
  {
    title: "COAL Syllabus Parts",
    items: [
      { label: "Part 1: Foundations", icon: Info, actionGroup: "Foundations" },
      { label: "Part 2: Number Systems", icon: Binary, actionGroup: "Number Systems" },
      { label: "Part 3: ISA & Registers", icon: Award, actionGroup: "ISA & Registers" },
      { label: "Part 4: Assembly Coding", icon: Cpu, actionGroup: "Assembly Programming" },
      { label: "Part 5: Cache & Memory", icon: Grid, actionGroup: "Cache & Memory" },
      { label: "Part 6: I/O & Interrupts", icon: Activity, actionGroup: "I/O & Interrupts" },
    ],
  },
];

const difficultyTone = {
  Easy: "easy",
  Medium: "medium",
  Hard: "hard",
};

const weekdayLabels = ["S", "M", "T", "W", "T", "F", "S"];

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

function SelectedProblemCard({ problem, status, onSolveClick }) {
  if (!problem) {
    return null;
  }

  return (
    <section className="problems-widget selected-problem-widget">
      <div className="problems-widget-head">
        <div>
          <span className="problems-widget-label">Selected Challenge</span>
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
        <button
          type="button"
          onClick={() => onSolveClick(problem)}
          style={{ width: "100%", justifyContent: "center" }}
        >
          Solve Problem →
        </button>
      </div>
    </section>
  );
}

function SidebarAccordion({ section, activeItemLabel, onItemClick }) {
  return (
    <div className="sidebar-nav-section">
      <h4 className="sidebar-section-title">{section.title}</h4>
      <div className="sidebar-section-items">
        {section.items.map((item) => {
          const Icon = item.icon;
          const isActive = activeItemLabel === item.label;
          return (
            <button
              key={item.label}
              type="button"
              className={`problems-sidebar-link ${isActive ? "is-active" : ""}`}
              onClick={() => onItemClick(item)}
            >
              <span className="problems-sidebar-link-main">
                <Icon size={15} />
                <span>{item.label}</span>
              </span>
              {item.badge ? (
                <span
                  className={`problems-sidebar-link-badge badge-${item.badge.toLowerCase()}`}
                >
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CoalProblemsPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const { topicSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();

  const bannerRef = React.useRef(null);
  const tweenRef = React.useRef(null);
  const resumeTimeoutRef = React.useRef(null);
  const retryTimeoutRef = React.useRef(null);
  const retryCountRef = React.useRef(0);

  const getActiveItem = () => {
    if (topicSlug === "assembly") return "Assembly Lab";
    return "Problems Library";
  };
  const activeItemLabel = getActiveItem();

  const handleSidebarClick = (item) => {
    setIsMobileSidebarOpen(false);
    if (item.path) {
      navigate(item.path);
    } else if (item.topicSlug) {
      navigate(`/resources/coal/problems/${item.topicSlug}`);
    } else if (item.actionGroup) {
      setActiveGroup(item.actionGroup);
      setTopicFilter(item.actionGroup);
    } else {
      navigate("/resources/coal/problems");
      setActiveGroup("All Topics");
      setTopicFilter("All Topics");
    }
  };

  const handleBannerCardClick = (card) => {
    trackPracticeEngagement("banner_card_click", {
      card_title: card.title,
      filter_group: card.filterGroup,
    });
    if (card.path) {
      navigate(card.path);
    } else if (card.filterGroup) {
      setActiveGroup(card.filterGroup);
      setTopicFilter(card.filterGroup);
    }
  };

  const startAutoscroll = React.useCallback((fromStart = true) => {
    const el = bannerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      if (retryCountRef.current < 8) {
        retryCountRef.current += 1;
        if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = setTimeout(() => {
          startAutoscroll(fromStart);
        }, 800);
      }
      return;
    }

    retryCountRef.current = 0; // reset on success

    if (tweenRef.current) {
      tweenRef.current.kill();
    }

    const currentScroll = el.scrollLeft;
    const targetScroll = fromStart ? maxScroll : 0;
    const distance = Math.abs(currentScroll - targetScroll);
    const duration = distance / 22; // Slow drift: 22 pixels per second

    tweenRef.current = gsap.to(el, {
      scrollLeft: targetScroll,
      duration: duration,
      ease: "none",
      onComplete: () => {
        startAutoscroll(!fromStart);
      },
    });
  }, []);

  React.useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;

    const timeoutId = setTimeout(() => {
      startAutoscroll(el.scrollLeft < (el.scrollWidth - el.clientWidth) / 2);
    }, 800);

    const resumeTimeout = resumeTimeoutRef.current;
    return () => {
      clearTimeout(timeoutId);
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [startAutoscroll]);

  const handleMouseEnter = () => {
    if (tweenRef.current) {
      tweenRef.current.pause();
    }
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    const el = bannerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;

    const isGoingToZero =
      tweenRef.current && tweenRef.current.vars.scrollLeft === 0;
    startAutoscroll(!isGoingToZero);
  };

  const [activeGroup, setActiveGroup] = React.useState("All Topics");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [difficulty, setDifficulty] = React.useState(
    problemDifficultyOptions[0],
  );
  const [topicFilter, setTopicFilter] = React.useState(
    problemFilterGroups[0],
  );
  const [statusFilter, setStatusFilter] = React.useState(
    problemStatusOptions[0],
  );
  const [sortBy, setSortBy] = React.useState(problemSortOptions[0]);
  const [selectedProblemId, setSelectedProblemId] = React.useState(
    problemsCatalog[0]?.id,
  );
  const [activeProblem, setActiveProblem] = React.useState(null);
  const [openArenaPanel, setOpenArenaPanel] = React.useState(null);
  const [month, setMonth] = React.useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const deferredSearch = React.useDeferredValue(searchTerm);

  const { snapshot, recordAttempt, setProblemSolved, monthMatrix } =
    useLearningProgress({
      user,
      topics: coalTopicsList,
      problems: problemsCatalog,
    });

  const solvedCount = snapshot?.summary?.solvedProblems || 0;
  const attemptedCount = snapshot?.summary?.attemptedProblems || 0;

  // XP & Level calculations
  const xp = solvedCount * 100 + attemptedCount * 30;
  const { level, rankName, nextLevelXp } = React.useMemo(() => {
    if (xp >= 1500) {
      return { level: 4, rankName: "Assembly Wizard", nextLevelXp: 3000 };
    } else if (xp >= 800) {
      return { level: 3, rankName: "Kernel Engineer", nextLevelXp: 1500 };
    } else if (xp >= 300) {
      return { level: 2, rankName: "Microcode Hacker", nextLevelXp: 800 };
    }
    return { level: 1, rankName: "Registers Recruit", nextLevelXp: 300 };
  }, [xp]);

  const xpPercentage = Math.min(100, Math.round((xp / nextLevelXp) * 100));

  // Daily Challenge problem
  const dailyProblem = React.useMemo(() => {
    if (!problemsCatalog || !problemsCatalog.length) return null;
    const day = new Date().getDate();
    return problemsCatalog[day % problemsCatalog.length];
  }, []);

  const handleSolveDaily = () => {
    if (dailyProblem) {
      setSelectedProblemId(dailyProblem.id);
      setActiveProblem(dailyProblem);
      trackPracticeEngagement("open_daily_challenge", {
        problem_id: dailyProblem.id,
        problem_title: dailyProblem.title,
      });
    }
  };

  // COAL Fact of the Day
  const dailyFact = React.useMemo(() => {
    const coalFacts = [
      "Von Neumann architecture stores both instructions and data in the same memory space, leading to the 'Von Neumann bottleneck'.",
      "Real-mode x86 uses segmented memory addressing (segment * 16 + offset) to access up to 1 MB of physical memory.",
      "The Interrupt Vector Table (IVT) resides at physical address 0x00000000 in real mode, containing 256 vector addresses.",
      "In Little Endian architectures (like Intel x86), the least significant byte is stored at the lowest memory address.",
      "RISC processors use simple instruction formats, fixed-length instructions, and a Load-Store model to execute in single cycles.",
      "A RAW (Read After Write) hazard occurs when an instruction depends on the output of a prior instruction that is still in flight.",
      "The CPU stack grows downward in memory, meaning that PUSH operations decrement the Stack Pointer (ESP)."
    ];
    const dayIndex = new Date().getDay();
    return coalFacts[dayIndex % coalFacts.length];
  }, []);

  // Solved problems count in the last 7 days (Weekly Goal tracker)
  const solvedThisWeek = React.useMemo(() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const day = new Date(today.getTime() - i * 86400000);
      const year = day.getFullYear();
      const month = String(day.getMonth() + 1).padStart(2, "0");
      const date = String(day.getDate()).padStart(2, "0");
      const key = `${year}-${month}-${date}`;
      const dayData = snapshot?.state?.activity?.[key];
      if (dayData && dayData.solved) {
        count += dayData.solved;
      }
    }
    return count;
  }, [snapshot?.state?.activity]);

  // Rotating quick reference formula cheat-sheet card
  const cheatSheetFormula = React.useMemo(() => {
    const formulas = [
      {
        name: "Signed Integer Ranges",
        formula: "[-2^(N-1), 2^(N-1) - 1]",
        description: "Limits of 2's complement representation for N bits.",
      },
      {
        name: "Physical Address Offset",
        formula: "Address = Segment * 16 + Offset",
        description: "Used by real mode segment registers to form 20-bit addresses.",
      },
      {
        name: "Direct Mapped Cache Index",
        formula: "Index = (Block Address) mod (Number of Blocks)",
        description: "Maps a main memory block address to a direct cache index.",
      },
      {
        name: "Interrupt Vector Address",
        formula: "Vector Address = Interrupt Number * 4",
        description: "Locates the segment:offset entry in real mode's IVT.",
      },
      {
        name: "Stack Pointer Movement",
        formula: "ESP = ESP - 4 (on PUSH) or ESP = ESP + 4 (on POP)",
        description: "Tracks ESP changes on 32-bit x86 stack actions.",
      },
      {
        name: "Signed Overflow Flag",
        formula: "OF = CarryIn(MSB) ⊕ CarryOut(MSB)",
        description: "Sets when signed arithmetic results overflow the bit width.",
      }
    ];
    const day = new Date().getDate();
    return formulas[day % formulas.length];
  }, []);

  const filteredProblems = React.useMemo(() => {
    const normalizedSearch = deferredSearch.trim().toLowerCase();

    const matches = problemsCatalog.filter((problem) => {
      const problemStatus =
        snapshot?.state?.problems?.[problem.id]?.status || "not_started";
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

    return sortProblems(matches, sortBy, snapshot?.state?.problems || {});
  }, [
    activeGroup,
    deferredSearch,
    difficulty,
    sortBy,
    snapshot?.state?.problems,
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

  const topTopicProgress = coalTopicsList
    .map((topic) => ({
      topic,
      progress: snapshot?.state?.topics?.[topic.id],
    }))
    .sort(
      (left, right) =>
        (right.progress?.completionPercentage || 0) -
        (left.progress?.completionPercentage || 0),
    )
    .slice(0, 4);

  const handleRecordAttempt = React.useCallback(
    (problem) => {
      recordAttempt(problem);
    },
    [recordAttempt],
  );

  const handleSetProblemSolved = React.useCallback(
    (problem, solved) => {
      setProblemSolved(problem, solved);
    },
    [setProblemSolved],
  );

  return (
    <div className={`problems-page coal-track theme-${theme}`}>
      <div className="problems-backdrop problems-backdrop-left" />
      <div className="problems-backdrop problems-backdrop-right" />

      {/* Floating Toggle Button for Mobile Sidebar Drawer */}
      <button
        type="button"
        className={`mobile-sidebar-toggle ${isMobileSidebarOpen ? "is-active" : ""}`}
        onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
        aria-label="Toggle navigation drawer"
      >
        {isMobileSidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar Backdrop Overlay on Mobile */}
      {isMobileSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <Navbar toggleTheme={toggleTheme} theme={theme} />

      <main className="problems-shell">
        <aside
          className={`problems-sidebar ${isMobileSidebarOpen ? "is-open" : ""}`}
        >
          <div className="problems-sidebar-brand">
            <span className="problems-sidebar-badge">COAL Practice</span>
            <h1>COAL Challenges</h1>
            <p>
              Academic-level computer organization and x86-32 assembly trace questions. Submit solutions to test logic.
            </p>
          </div>

          <nav
            className="problems-sidebar-nav"
            aria-label="Problems navigation"
          >
            {/* Practice Arenas */}
            <div className="sidebar-nav-section">
              <h4 className="sidebar-section-title">Practice Arenas</h4>
              <div className="sidebar-section-items">
                {leftNavSections[0].items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeItemLabel === item.label;
                  const isPanelOpen = openArenaPanel === item.label;

                  return (
                    <div key={item.label} className="arena-item-wrapper">
                      <button
                        type="button"
                        className={`problems-sidebar-link ${isActive ? "is-active" : ""} ${isPanelOpen ? "panel-open" : ""}`}
                        onClick={() => {
                          setOpenArenaPanel(
                            isPanelOpen ? null : item.label
                          );
                        }}
                      >
                        <span className="problems-sidebar-link-main">
                          <Icon size={16} />
                          <span>{item.label}</span>
                        </span>
                        <span className="arena-item-right">
                          {item.badge ? (
                            <span
                              className={`problems-sidebar-link-badge badge-${item.badge.toLowerCase()}`}
                            >
                              {item.badge}
                            </span>
                          ) : null}
                          <span
                            className={`arena-panel-chevron ${isPanelOpen ? "rotated" : ""}`}
                            aria-hidden="true"
                          >
                            <ChevronRight size={12} />
                          </span>
                        </span>
                      </button>

                      {/* Sub Panel */}
                      <div className={`arena-sub-panel ${isPanelOpen ? "is-open" : ""}`}>
                        <div className="arena-sub-panel-inner">
                          <p className="arena-sub-desc">
                            {item.panel?.description}
                          </p>
                          <div className="arena-sub-links">
                            {item.panel?.links.map((link) => (
                              <button
                                key={link.label}
                                type="button"
                                className="arena-sub-link"
                                onClick={() => {
                                  setOpenArenaPanel(null);
                                  setIsMobileSidebarOpen(false);
                                  if (link.action === "navigate") {
                                    navigate(link.value);
                                  } else if (link.action === "filter") {
                                    setDifficulty(link.value);
                                  } else if (link.action === "topic") {
                                    setActiveGroup(link.value);
                                    setTopicFilter(link.value);
                                  }
                                }}
                              >
                                <span className="arena-sub-link-dot" />
                                {link.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Accordion sections */}
            <div className="sidebar-accordion">
              {leftNavSections.slice(1).map((section) => (
                <SidebarAccordion
                  key={section.title}
                  section={section}
                  activeItemLabel={activeItemLabel}
                  onItemClick={handleSidebarClick}
                />
              ))}
            </div>
          </nav>

          <section className="problems-sidebar-foot">
            <h3 className="sidebar-foot-title">COAL Progress</h3>
            <div className="sidebar-stat-item solved">
              <div className="stat-label-wrap">
                <Trophy size={16} className="stat-icon" />
                <span>Solved</span>
              </div>
              <strong>{solvedCount}</strong>
            </div>
            <div className="sidebar-stat-item attempted">
              <div className="stat-label-wrap">
                <Compass size={16} className="stat-icon" />
                <span>Attempted</span>
              </div>
              <strong>{attemptedCount}</strong>
            </div>
            <div className="sidebar-stat-item streak">
              <div className="stat-label-wrap">
                <Flame size={16} className="stat-icon" />
                <span>Streak</span>
              </div>
              <strong>{snapshot?.summary?.streaks?.current ?? 0} d</strong>
            </div>
          </section>
        </aside>

        <section className="problems-center">
          <div className="problems-banner-slider">
            <div
              className="problems-banner-row"
              ref={bannerRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {[...problemBannerCards, ...problemBannerCards].map((card, idx) => (
                <article
                  key={`${card.title}-${idx}`}
                  className="problems-banner-card"
                  style={{ background: card.gradient, cursor: "pointer" }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${card.title} — ${card.eyebrow}`}
                  onClick={() => handleBannerCardClick(card)}
                >
                  <span>{card.eyebrow}</span>
                  <h2>{card.title}</h2>
                  <p>{card.description}</p>
                </article>
              ))}
            </div>
          </div>

          {/* Daily Challenge Banner */}
          {dailyProblem && (
            <div className="inline-daily-challenge">
              <div className="inline-daily-left">
                <div className="inline-daily-eyebrow">
                  <Sparkles size={14} className="inline-daily-icon" />
                  <span>Daily Challenge</span>
                </div>
                <h3 className="inline-daily-title">{dailyProblem.title}</h3>
                <div className="inline-daily-meta">
                  <span
                    className={`difficulty-pill ${difficultyTone[dailyProblem.difficulty]}`}
                  >
                    {dailyProblem.difficulty}
                  </span>
                  <span className="inline-daily-topic">
                    {dailyProblem.topic}
                  </span>
                  <span className="xp-bonus">+100 XP</span>
                </div>
              </div>
              <div className="inline-daily-right">
                <p className="inline-daily-desc">
                  {dailyProblem.description.slice(0, 110)}…
                </p>
                <button
                  type="button"
                  className="inline-daily-btn"
                  onClick={handleSolveDaily}
                >
                  Solve Today's Challenge →
                </button>
              </div>
            </div>
          )}

          <div className="problems-filter-chip-row">
            {problemFilterGroups.map((group) => (
              <button
                key={group}
                type="button"
                className={`problems-filter-chip ${activeGroup === group ? "is-active" : ""}`}
                onClick={() => {
                  setActiveGroup(group);
                  setTopicFilter(group);
                }}
              >
                {group}
              </button>
            ))}
          </div>

          <section className="problems-toolbar">
            <label className="problems-search">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search registers, stacks, cache tags..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
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
                <span className="table-summary-label">COAL Problem Library</span>
                <strong>{filteredProblems.length} visible challenges</strong>
              </div>
              <div className="table-summary-stats">
                <span>
                  <Flame size={15} />
                  {snapshot?.summary?.streaks?.current ?? 0} day streak
                </span>
                <span>
                  <Sparkles size={15} />
                  {snapshot?.summary?.completionRate ?? 0}% completion
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
                    const progress = snapshot?.state?.problems?.[problem.id] || {};
                    const solved = progress.status === "solved";
                    const attempted = progress.status === "attempted";
                    const isSelected = selectedProblemId === problem.id;
                    const isLocked = Boolean(problem.premium);

                    return (
                      <tr
                        key={problem.id}
                        className={`${isSelected ? "is-selected" : ""} ${isLocked ? "is-locked" : ""}`}
                        onClick={() => {
                          if (isLocked) return;
                          setSelectedProblemId(problem.id);
                          setActiveProblem(problem);
                          if (!solved && !attempted) {
                            handleRecordAttempt(problem);
                          }
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
                          <span
                            className={`access-pill ${isLocked ? "is-locked" : "is-open"}`}
                          >
                            {isLocked ? (
                              <>
                                <Lock size={14} aria-hidden="true" />
                                Locked
                              </>
                            ) : (
                              "Open"
                            )}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-chip ${solved ? "is-solved" : attempted ? "is-attempted" : ""}`}
                          >
                            {solved
                              ? "Solved"
                              : attempted
                                ? "Attempted"
                                : "Not started"}
                          </span>
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
          {/* Level Progress Widget */}
          <div className="problems-widget level-progress-widget">
            <div className="level-header">
              <span className="level-badge">LVL {level}</span>
              <div className="rank-name">{rankName}</div>
            </div>
            <div className="xp-bar-container">
              <div
                className="xp-bar-progress"
                style={{ width: `${xpPercentage}%` }}
              ></div>
            </div>
            <div className="xp-details">
              <span>{xp} XP</span>
              <span>
                {nextLevelXp - xp > 0
                  ? `${nextLevelXp - xp} XP to next lvl`
                  : "Max Lvl"}
              </span>
            </div>
          </div>

          {/* Weekly Practice Goal Widget */}
          <div className="problems-widget weekly-goal-widget">
            <div className="weekly-goal-header">
              <Flame size={15} className="goal-fire-icon" />
              <h4>Weekly Goal</h4>
            </div>
            <div className="weekly-goal-body">
              <div className="goal-text">Solve 5 problems this week</div>
              <div className="goal-progress-wrap">
                <div className="goal-progress-bar">
                  <div
                    className="goal-progress-fill"
                    style={{
                      width: `${Math.min(100, (solvedThisWeek / 5) * 100)}%`,
                    }}
                  ></div>
                </div>
                <span className="goal-ratio">{solvedThisWeek}/5</span>
              </div>
            </div>
          </div>

          {/* Daily Challenge Widget */}
          {dailyProblem && (
            <div className="problems-widget daily-challenge-widget">
              <div className="daily-head">
                <Sparkles size={16} className="daily-glow-icon" />
                <span className="daily-label">Daily Challenge</span>
              </div>
              <div className="daily-body">
                <h4>{dailyProblem.title}</h4>
                <div className="daily-meta">
                  <span
                    className={`difficulty-pill ${difficultyTone[dailyProblem.difficulty]}`}
                  >
                    {dailyProblem.difficulty}
                  </span>
                  <span className="xp-bonus">+100 XP</span>
                </div>
              </div>
              <button
                type="button"
                className="solve-daily-btn"
                onClick={handleSolveDaily}
              >
                Solve Challenge
              </button>
            </div>
          )}

          {/* Cheat-Sheet Formula Widget */}
          <div className="problems-widget cheat-sheet-widget">
            <div className="cheat-sheet-header">
              <GraduationCap size={15} />
              <h4>Quick Formula</h4>
            </div>
            <div className="cheat-sheet-body">
              <div className="cheat-formula-name">{cheatSheetFormula.name}</div>
              <div className="cheat-formula-display">
                <code>{cheatSheetFormula.formula}</code>
              </div>
              <p className="cheat-formula-desc">
                {cheatSheetFormula.description}
              </p>
            </div>
          </div>

          {/* Snapshot widget */}
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
                <strong>{solvedCount}</strong>
                <span>Solved</span>
              </div>
              <div>
                <strong>{attemptedCount}</strong>
                <span>Attempted</span>
              </div>
              <div>
                <strong>{snapshot?.summary?.completedTopics ?? 0}</strong>
                <span>Topics complete</span>
              </div>
              <div>
                <strong>{snapshot?.summary?.streaks?.longest ?? 0}</strong>
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
                ? snapshot?.state?.problems?.[selectedProblem.id]
                : null
            }
            onSolveClick={(problem) => setActiveProblem(problem)}
          />

          {/* Top learning paths */}
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

          {/* Recent Activity */}
          <section className="problems-widget">
            <div className="problems-widget-head">
              <div>
                <span className="problems-widget-label">Recent Activity</span>
                <h3>Latest actions</h3>
              </div>
            </div>

            <div className="recent-activity-list">
              {(snapshot?.recentEvents || []).length ? (
                snapshot.recentEvents.slice(0, 5).map((event) => {
                  const topic = event.topicId
                    ? coalTopicLookup[event.topicId]
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

          {/* COAL Fact of the Day */}
          <div className="problems-widget fact-widget">
            <div className="fact-head">
              <Info size={15} />
              <h4>Fact of the Day</h4>
            </div>
            <p className="fact-content">{dailyFact}</p>
          </div>
        </aside>
      </main>

      {activeProblem && (
        <CoalProblemModal
          problem={activeProblem}
          onClose={() => setActiveProblem(null)}
          onSolved={(problem) => handleSetProblemSolved(problem, true)}
          onAttempt={(problem) => handleRecordAttempt(problem)}
        />
      )}
    </div>
  );
}
