import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import CoalLayout from "./CoalLayout";import CoreTopicsSection from "../../components/topics/CoreTopicsSection";
import { buildCoalCoreTopics } from "../../data/coalCoreTopics";
import { coalCourseMeta, coalCourseParts } from "../../data/coalCourseOutline";
import { getAllCoalModules } from "../../utils/coalCourseUtils";
import "./CoalLayout.css";

const coalTopics = buildCoalCoreTopics();

function CoalTheoryPage() {
  const location = useLocation();
  const modules = getAllCoalModules();
  const publishedCount = modules.filter((module) => module.hasContent).length;

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  return (
    <CoalLayout
      title="Theory & course path"
      subtitle="All parts and modules"
      intro={coalCourseMeta.description}
    >
      <div className="coal-theory-overview">
        <div className="coal-theory-overview__stats">
          <span>
            <strong>{coalCourseParts.length}</strong> parts
          </span>
          <span>
            <strong>{modules.length}</strong> topics
          </span>
          <span>
            <strong>{publishedCount}</strong> published
          </span>
          <span>
            <strong>~{coalCourseMeta.estimatedWeeks}</strong> weeks
          </span>
        </div>

        <CoreTopicsSection topics={coalTopics} />
      </div>
    </CoalLayout>
  );
}

export default CoalTheoryPage;
