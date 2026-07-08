import React from "react";
import { Link, useParams } from "react-router-dom";
import { BookOpen, Clock, GraduationCap } from "lucide-react";
import CoalLayout from "./CoalLayout";
import CoalTopicContent from "../../components/coal/CoalTopicContent";
import { getCoalTopicContent } from "../../data/coalTopicContent";
import { getCoalModuleBySlug } from "../../utils/coalCourseUtils";
import "./CoalPages.css";
import "./CoalLayout.css";

function CoalTopicPage() {
  const { slug } = useParams();
  const resolved = getCoalModuleBySlug(slug);
  const content = getCoalTopicContent(slug);

  if (!resolved) {
    return (
      <CoalLayout title="Topic not found" subtitle="COAL theory">
        <p>This topic is not in the course outline yet.</p>
        <Link to="/resources/coal/theory" className="coal-btn coal-btn--ghost">
          Back to theory
        </Link>
      </CoalLayout>
    );
  }

  const { module } = resolved;
  const summary =
    content?.preview?.summary ||
    module.summaryLine ||
    module.outcomes?.[0] ||
    "Lesson content for this COAL topic.";

  return (
    <CoalLayout
      title={module.title}
      subtitle={`Part ${module.partNumber} · ${module.partTitle}`}
      intro={summary}
    >
      <div className="coal-topic-shell-content">
        <div className="coal-topic-hero coal-topic-hero--embedded">
          <div className="coal-topic-hero__meta">
            <span>
              <GraduationCap size={15} /> {content?.level || module.partLevel}
            </span>
            <span>
              <Clock size={15} /> {content?.duration || module.duration}
            </span>
          </div>
        </div>

        {content ? (
          <CoalTopicContent content={content} />
        ) : (
          <div className="coal-coming-soon">
            <BookOpen size={28} />
            <h2>Coming soon</h2>
            <p>
              We are preparing simple lessons, diagrams, and examples for this topic.
              Check back soon or continue with the topics already available.
            </p>
          </div>
        )}
      </div>
    </CoalLayout>
  );
}

export default CoalTopicPage;
