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

export {
  COAL_MODULE_ICONS,
  getAllCoalModules,
  getCoalModuleBySlug,
  getCoalTopicPath,
  coalCourseParts,
};
