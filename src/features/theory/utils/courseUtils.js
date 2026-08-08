import { BookOpen } from "lucide-react";

// ── Generic course utilities factory ────────────────────────────────
// Both DLD and COAL are "tracks": a flat list of parts, each holding an
// ordered list of topic modules. This factory builds the same set of
// helpers (module lookup, sidebar pages, prev/next, active-state
// checks) for either track from its course-outline data, so the logic
// only has to exist once. See ../tracks.js for how each track is wired
// up.
//
// config:
//   courseParts    - the track's parts[] (each with .modules[])
//   getTopicContent - (slug) => content data | undefined
//   topicPath      - (module, part) => the module's real route.
//                    COAL derives it (`/coal/${slug}`); DLD uses each
//                    module's own literal `path` so existing URLs never
//                    change.
//   overviewPath   - the track's home page (overview now lives there)
//   moduleIcons    - optional { [module.id]: LucideIcon }
export default function createCourseUtils({
  courseParts,
  getTopicContent,
  topicPath,
  overviewPath,
  moduleIcons = {},
}) {
  function getAllModules() {
    return courseParts.flatMap((part) =>
      part.modules.map((module) => {
        const content = getTopicContent(module.slug);
        return {
          ...module,
          path: topicPath(module, part),
          partId: part.id,
          partNumber: part.part,
          partTitle: part.title,
          partLevel: part.level,
          icon: moduleIcons[module.id] || BookOpen,
          hasContent: Boolean(content),
          summaryLine:
            content?.preview?.summary?.split(".")[0] ||
            module.outcomes?.[0] ||
            module.description ||
            "Lesson content coming soon.",
        };
      }),
    );
  }
  function getModuleBySlug(slug) {
    const modules = getAllModules();
    const index = modules.findIndex((m) => m.slug === slug);
    if (index < 0) return null;
    return {
      module: modules[index],
      index,
      prev: index > 0 ? modules[index - 1] : null,
      next: index < modules.length - 1 ? modules[index + 1] : null,
    };
  }

  function getTopicPath(slug) {
    const found = getAllModules().find((m) => m.slug === slug);
    return found ? found.path : overviewPath;
  }

  function buildTopicPages() {
    return courseParts.flatMap((part) =>
      part.modules.map((module) => ({
        path: topicPath(module, part),
        label: module.title,
        description: `Part ${part.part} · ${part.title}`,
        partId: part.id,
        partNumber: part.part,
      })),
    );
  }

  // subtopicId is `module.subtopicId` (falling back to `module.slug`),
  // NOT the full path — this must match whatever ID scheme a
  // migrated part's original standalone Layout used, so returning
  // users' already-saved progress (keyed by that ID) still lines up.
  const PATH_TO_SUBTOPIC_ID = Object.fromEntries(
    courseParts.flatMap((part) =>
      part.modules.map((module) => [topicPath(module, part), module.subtopicId || module.slug]),
    ),
  );

  function getPartForPath(pathname) {
    const module = getAllModules().find((item) => item.path === pathname);
    if (!module) return null;
    return courseParts.find((part) => part.part === module.partNumber) || null;
  }

  function isPartSidebarActive(page, location) {
    const { pathname, hash } = location;

    if (pathname === overviewPath) {
      // On the overview (home) page, only activate a part when its hash
      // is the current one — avoids Part 1 always appearing "active"
      // before the user has scrolled to / picked a part.
      if (!hash) return false;
      return hash === `#part-${page.partId}`;
    }

    const activePart = getPartForPath(pathname);
    return activePart?.id === page.partId;
  }

  // True only once every module in that sidebar part has been marked
  // complete — passed as `isSidebarItemDone` to PremiumLearningShell.
  function isPartSidebarDone(page, completedSubtopics) {
    if (page.path && !page.path.startsWith(overviewPath)) {
      const subtopicId = PATH_TO_SUBTOPIC_ID[page.path];
      return subtopicId ? completedSubtopics.includes(subtopicId) : false;
    }
    const part = courseParts.find((p) => p.id === page.partId);
    if (!part) return false;
    return part.modules.every((module) =>
      completedSubtopics.includes(module.subtopicId || module.slug),
    );
  }

  return {
    getAllModules,
    getModuleBySlug,
    getTopicPath,
    buildTopicPages,
    getPartForPath,
    isPartSidebarActive,
    isPartSidebarDone,
    PATH_TO_SUBTOPIC_ID,
    overviewPath,
  };
}

