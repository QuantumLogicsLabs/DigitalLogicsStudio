// ── Core topics card builder ─────────────────────────────────────
// Builds the CoreTopicsSection card list directly from a track's
// course-outline parts, so the home page overview always matches the
// sidebar/course structure exactly — one source of truth instead of a
// hand-maintained duplicate list (which is what shared/data/coreTopics.js
// used to be, and which the old coalCoreTopics.js also duplicated, with
// a broken import that would have failed at build time).
const PART_ACCENTS = ["violet", "cyan", "blue", "emerald", "rose", "indigo", "slate", "amber"];
const PART_ICONS = ["Sigma", "Binary", "Workflow", "Zap", "ArrowLeftRight", "HardDrive", "Sparkles", "Cpu"];

export default function buildCoreTopics(track) {
  const { courseParts, utils } = track;
  return courseParts.map((part, index) => ({
    id: part.id,
    anchorId: `part-${part.id}`,
    title: part.title.toUpperCase(),
    eyebrow: `Part ${part.part}${part.level ? ` · ${part.level}` : ""}`,
    icon: part.icon || PART_ICONS[index % PART_ICONS.length],
    accent: part.accent || PART_ACCENTS[index % PART_ACCENTS.length],
    description: part.summary,
    progressLabel: part.duration ? `${part.duration} · theory modules` : "Theory modules",
    stats: {
      modules: part.modules.length,
      practice: part.modules.filter((m) => m.practice).length || part.modules.length,
      level: part.level || "Core",
    },
    links: part.modules.map((module) => ({
      id: module.subtopicId || module.slug,
      text: module.title,
      to: utils.getTopicPath(module.slug),
    })),
  }));
}
