import { coalCourseParts } from "./coalCourseOutline";
import { getCoalTopicPath } from "../utils/coalCourseUtils";

const PART_ACCENTS = ["violet", "cyan", "amber", "blue", "emerald", "rose", "indigo"];
const PART_ICONS = ["Cpu", "MonitorPlay", "BookOpen", "GitBranch", "Layers3", "HardDrive", "Zap"];

function buildCoalCoreTopics() {
  return coalCourseParts.map((part, index) => ({
    id: part.id,
    anchorId: `coal-part-${part.id}`,
    title: part.title.toUpperCase(),
    eyebrow: `Part ${part.part} · ${part.level}`,
    icon: PART_ICONS[index % PART_ICONS.length],
    accent: PART_ACCENTS[index % PART_ACCENTS.length],
    description: part.summary,
    progressLabel: `${part.duration} · theory modules`,
    stats: {
      modules: part.modules.length,
      practice: part.modules.filter((module) => module.practice).length,
      level: part.level,
    },
    links: part.modules.map((module) => ({
      id: module.slug,
      text: module.title,
      to: getCoalTopicPath(module.slug),
    })),
  }));
}

export { buildCoalCoreTopics };
