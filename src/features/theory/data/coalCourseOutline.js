// Re-exported from the shared location, which several COAL "practical"
// pages (outside the theory system) also import coalCourseMeta from —
// so the real data stays there as the single source of truth, and the
// theory folder just re-exports it for its own generic components.
export {
  COAL_LEVELS,
  coalCourseMeta,
  coalCourseParts,
  coalTopicSlugs,
  coalAssessmentMap,
  coalStudyPlan,
} from "../../../shared/data/coalCourseOutline";
export { default } from "../../../shared/data/coalCourseOutline";
