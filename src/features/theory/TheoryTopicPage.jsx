import { Link, useLocation } from "react-router-dom";
import { BookOpen, Clock, GraduationCap } from "lucide-react";
import TheoryLayout from "./TheoryLayout";
import TheoryTopicContent from "./components/TheoryTopicContent";
import "./TheoryTopicPage.css";

// ── Generic theory topic page ───────────────────────────────────────
// Resolves the current module by pathname (not a :slug param) so DLD
// topics keep their real, pre-existing routes (e.g. "/boolean/overview")
// while COAL topics keep working the same way at "/coal/:slug" — either
// way `location.pathname` already IS the module's path.
export default function TheoryTopicPage({ track, widgetRegistry, diagramRenderer }) {
  const { pathname } = useLocation();
  const module = track.utils.getAllModules().find((m) => m.path === pathname);
  const content = module ? track.getTopicContent(module.slug) : null;

  if (!module) {
    return (
      <TheoryLayout track={track} title="Topic not found" subtitle={track.sidebarTitle}>
        <p>This topic is not in the course outline yet.</p>
        <Link to={track.homePath} className="theory-btn theory-btn-secondary">
          Back to {track.id === "coal" ? "COAL" : "DLD"} theory
        </Link>
      </TheoryLayout>
    );
  }

  const summary = content?.preview?.summary || module.summaryLine || module.description || "Lesson content for this topic.";

  return (
    <TheoryLayout
      track={track}
      title={module.title}
      subtitle={`Part ${module.partNumber} · ${module.partTitle}`}
      intro={summary}
    >
      <div className="theory-topic-shell-content">
        {(content?.level || module.partLevel || content?.duration || module.duration) && (
          <div className="theory-topic-hero theory-topic-hero--embedded">
            <div className="theory-topic-hero__meta">
              {(content?.level || module.partLevel) && (
                <span><GraduationCap size={15} /> {content?.level || module.partLevel}</span>
              )}
              {(content?.duration || module.duration) && (
                <span><Clock size={15} /> {content?.duration || module.duration}</span>
              )}
            </div>
          </div>
        )}

        {content ? (
          <TheoryTopicContent content={content} widgetRegistry={widgetRegistry} diagramRenderer={diagramRenderer} />
        ) : (
          <div className="theory-coming-soon">
            <BookOpen size={28} />
            <strong>Coming soon</strong>
            We're preparing lessons, diagrams, and examples for this topic. Check back soon, or continue with the topics already available.
          </div>
        )}
      </div>
    </TheoryLayout>
  );
}
