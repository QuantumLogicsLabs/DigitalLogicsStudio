import React from "react";
import TopicLayout from "../../../shared/components/topics/TopicLayout";
import "./NSLayout.css";
import {
  nsPages,
  NS_PATH_TO_SUBTOPIC_ID,
  NS_LEGACY_SUBTOPIC_ALIASES,
  NS_TOPIC,
  NS_DEFAULT_HIGHLIGHTS,
} from "./nsConfig";

const NSLayout = ({ title, subtitle, intro, highlights = [], children }) => (
  <TopicLayout
    title={title}
    subtitle={subtitle}
    intro={intro}
    highlights={
      highlights.length ? highlights : NS_DEFAULT_HIGHLIGHTS[title] || []
    }
    pages={nsPages}
    topicLabel="Number Systems"
    sidebarTitle="Number Systems"
    sidebarCopy="Move across binary, decimal, octal, and hexadecimal with one consistent premium conversion workspace."
    heroKicker="Number Systems"
    progressVerb="read"
    rootClassName="ns-layout"
    tracking={{
      topic: NS_TOPIC,
      pathToSubtopicId: NS_PATH_TO_SUBTOPIC_ID,
      subtopicAliases: NS_LEGACY_SUBTOPIC_ALIASES,
    }}
  >
    {children}
  </TopicLayout>
);

export default NSLayout;
