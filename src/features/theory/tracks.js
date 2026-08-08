import createCourseUtils from "./utils/courseUtils";
import { dldCourseMeta, dldCourseParts } from "./data/dldCourseOutline";
import { getDldTopicContent } from "./data/dldTopicContent";
import { coalCourseMeta, coalCourseParts } from "./data/coalCourseOutline";
import { getCoalTopicContent } from "./data/coalTopicContent";
import { BookOpen, Layers3, Sparkles, Wrench, Trophy } from "lucide-react";

// ── Track registry ───────────────────────────────────────────────
// A "track" is one subject's theory course (DLD or COAL). Both are
// built from the same generic course-utils factory — only the data
// (course outline + topic content) and a couple of routing details
// differ.
const dldUtils = createCourseUtils({
  courseParts: dldCourseParts,
  getTopicContent: getDldTopicContent,
  // DLD topics keep their real, pre-existing URLs (e.g. "/boolean/overview")
  // rather than a derived "/dld/:slug" scheme — nothing about existing
  // links or bookmarks changes.
  topicPath: (module) => module.path,
  overviewPath: "/resources/dld",
});

const coalUtils = createCourseUtils({
  courseParts: coalCourseParts,
  getTopicContent: getCoalTopicContent,
  topicPath: (module) => `/coal/${module.slug}`,
  overviewPath: "/resources/coal",
});

export const TRACKS = {
  dld: {
    id: "dld",
    meta: dldCourseMeta,
    courseParts: dldCourseParts,
    getTopicContent: getDldTopicContent,
    utils: dldUtils,
    homePath: "/resources/dld",
    otherTrackPath: "/resources/coal",
    otherTrackLabel: "Explore COAL",
    rootClassName: "theory-layout theory-layout--dld",
    heroKicker: "Digital Logic Design",
    sidebarTitle: "DLD Theory",
    sidebarCopy: "Every topic in this part, in order — track your progress as you go.",
    // DLD tracks progress per-part (matching each part's original
    // standalone layout), not under one shared topic id, so returning
    // users' already-saved progress isn't reset by unification.
    progressTopicId: (part) => part.id,
    parentProgressTopicId: null,
    // Hero chapter-dots/prev-next stay scoped to the current part only
    // — identical to how each DLD category behaved before unification.
    pagesScope: "part",
    homeDescription:
      "A polished study hub for number systems, Boolean algebra, combinational circuits, and timing concepts.",
    quickLinks: [
      { title: "Chapter 1 Practice", description: "Start with basics, logic gates, and number systems.", to: "/book", icon: BookOpen },
      { title: "Chapter 2 Practice", description: "Move to simplification, K-maps, and circuit design.", to: "/book/ch2", icon: Layers3 },
      { title: "Timing Diagrams", description: "Visualize how digital signals evolve over time.", to: "/timing-diagrams", icon: Sparkles },
    ],
    concepts: [
      { title: "Logic Gates", description: "Understand AND, OR, NOT, NAND, NOR, XOR, and XNOR behavior." },
      { title: "Boolean Algebra", description: "Practice simplification, duality, and algebraic identities." },
      { title: "Karnaugh Maps", description: "Reduce complex expressions into simpler circuits." },
      { title: "Sequential Logic", description: "Explore latches, flip-flops, counters, and memory basics." },
    ],
  },
  coal: {
    id: "coal",
    meta: coalCourseMeta,
    courseParts: coalCourseParts,
    getTopicContent: getCoalTopicContent,
    utils: coalUtils,
    homePath: "/resources/coal",
    otherTrackPath: "/resources/dld",
    otherTrackLabel: "Explore DLD",
    rootClassName: "theory-layout theory-layout--coal",
    heroKicker: "Computer Organization & Assembly",
    sidebarTitle: "COAL Theory",
    sidebarCopy: "Every topic in this part, in order — track your progress as you go.",
    progressTopicId: "coal-theory",
    parentProgressTopicId: "coal-theory",
    // COAL's hero chapter-dots span the whole course — matches its
    // existing (pre-unification) behavior.
    pagesScope: "all",
    homeDescription:
      "A structured path from computer fundamentals to assembly and processor architecture — theory and hands-on practice in one place.",
    quickLinks: [
      { title: "Practical Labs", description: "Tracing exercises, assembly drills, and simulators — coming soon.", to: "/resources/coal/practical", icon: Wrench },
      { title: "Problems Arena", description: "Tackle 15 COAL conceptual and code tracing challenges.", to: "/problems?course=coal", icon: Trophy },
    ],
    concepts: [],
  },
};

export function getTrack(id) {
  return TRACKS[id] || TRACKS.dld;
}

