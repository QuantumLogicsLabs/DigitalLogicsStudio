import { coalCourseParts } from "../data/coalCourseOutline";
import { getCoalTopicContent } from "../data/coalTopicContent";
import {
  Binary,
  BookOpen,
  Cpu,
  GitBranch,
  HardDrive,
  Layers3,
  MonitorPlay,
  Zap,
} from "lucide-react";

const COAL_MODULE_ICONS = {
  "intro-co": Cpu,
  "number-systems": Binary,
  "logic-bridge": Layers3,
  "cpu-components": Cpu,
  "instruction-cycle": MonitorPlay,
  "memory-hierarchy": HardDrive,
  "isa-overview": BookOpen,
  "addressing-modes": GitBranch,
  "flags-and-status": Zap,
  "data-movement": Binary,
  "control-flow": GitBranch,
  "registers-memory": Cpu,
  "procedures-stack": Layers3,
  "arrays-strings": BookOpen,
  "ia32-architecture": Cpu,
  "directives-macros": BookOpen,
  "hw-sw-interface": MonitorPlay,
  "io-interrupts": HardDrive,
  "buses-storage": HardDrive,
  "processor-families": Cpu,
  "pipelining": Zap,
  "computer-organization": Cpu,
};

function getAllCoalModules() {
  return coalCourseParts.flatMap((part) =>
    part.modules.map((module, indexInPart) => ({
      ...module,
      partNumber: part.part,
      partTitle: part.title,
      partLevel: part.level,
      icon: COAL_MODULE_ICONS[module.id] || BookOpen,
      hasContent: Boolean(getCoalTopicContent(module.slug)),
      summaryLine:
        getCoalTopicContent(module.slug)?.preview?.summary?.split(".")[0] ||
        module.outcomes?.[0] ||
        "Lesson content coming soon.",
    })),
  );
}

function getCoalModuleBySlug(slug) {
  const modules = getAllCoalModules();
  const index = modules.findIndex((m) => m.slug === slug);
  if (index < 0) return null;
  return {
    module: modules[index],
    index,
    prev: index > 0 ? modules[index - 1] : null,
    next: index < modules.length - 1 ? modules[index + 1] : null,
  };
}

function getCoalTopicPath(slug) {
  return `/coal/${slug}`;
}

function buildCoalTopicPages() {
  return coalCourseParts.flatMap((part) =>
    part.modules.map((module) => ({
      path: getCoalTopicPath(module.slug),
      label: module.title,
      description: `Part ${part.part} · ${part.title}`,
      partId: part.id,
      partNumber: part.part,
    })),
  );
}

function buildCoalPartSidebarPages() {
  return coalCourseParts.map((part) => ({
    path: `/resources/coal/theory#coal-part-${part.id}`,
    label: `Part ${part.part}`,
    description: part.title,
    partId: part.id,
    partNumber: part.part,
    modules: part.modules,
  }));
}

/** @deprecated Use buildCoalTopicPages for navigation; overview is separate */
function buildCoalPages() {
  return [
    {
      path: "/resources/coal/theory",
      label: "Course overview",
      description: "Browse all COAL parts and open theory modules.",
    },
    ...buildCoalTopicPages(),
  ];
}

const COAL_PATH_TO_SUBTOPIC_ID = Object.fromEntries(
  buildCoalTopicPages().map((page) => [
    page.path,
    page.path.replace("/coal/", ""),
  ]),
);

const COAL_THEORY_OVERVIEW_PATH = "/resources/coal/theory";

function getCoalPartForPath(pathname) {
  if (!pathname.startsWith("/coal/")) return null;
  const slug = pathname.replace("/coal/", "");
  const module = getAllCoalModules().find((item) => item.slug === slug);
  if (!module) return null;
  return coalCourseParts.find((part) => part.part === module.partNumber) || null;
}

function isCoalPartSidebarActive(page, location) {
  const { pathname, hash } = location;

  if (pathname === COAL_THEORY_OVERVIEW_PATH) {
    // On the overview page, only activate a part if there's a matching hash.
    // When there's no hash, don't highlight anything — avoids Part 1 always
    // appearing active when the user hasn't scrolled to / selected a part yet.
    if (!hash) return false;
    const targetHash = `#coal-part-${page.partId}`;
    return hash === targetHash;
  }

  const activePart = getCoalPartForPath(pathname);
  return activePart?.id === page.partId;
}

/**
 * Returns true when every module in the sidebar part has been completed.
 * Passed as `isSidebarItemDone` to PremiumLearningShell so the sidebar
 * part-level items show the ✓ checkmark only after all their topics are read.
 *
 * @param {object} page           - sidebar page object (has .partId)
 * @param {string[]} completedSubtopics - IDs already marked as read
 */
function isCoalPartSidebarDone(page, completedSubtopics) {
  const part = coalCourseParts.find((p) => p.id === page.partId);
  if (!part) return false;
  return part.modules.every((module) =>
    completedSubtopics.includes(module.slug),
  );
}

export {
  COAL_MODULE_ICONS,
  COAL_PATH_TO_SUBTOPIC_ID,
  COAL_THEORY_OVERVIEW_PATH,
  buildCoalPages,
  buildCoalPartSidebarPages,
  buildCoalTopicPages,
  getAllCoalModules,
  getCoalModuleBySlug,
  getCoalPartForPath,
  getCoalTopicPath,
  isCoalPartSidebarActive,
  isCoalPartSidebarDone,
  coalCourseParts,
};
