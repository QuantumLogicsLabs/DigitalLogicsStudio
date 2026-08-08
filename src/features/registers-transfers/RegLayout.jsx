import React from "react";
import TopicLayout from "../../shared/components/topics/TopicLayout";
import "./RegStyles.css";
import { regPages, REG_TOPIC, REG_PATH_TO_SUBTOPIC_ID } from "./regConfig";


const RegLayout = ({ children, title, subtitle }) => (
  <TopicLayout
    title={title}
    subtitle={subtitle}
    pages={regPages}
    topicLabel="Registers & Transfers"
    sidebarTitle="Registers & Transfers"
    sidebarCopy="Explore storage, shifting, loading, and counting patterns through one polished navigation system."
    heroKicker="Registers and Register Transfers"
    progressVerb="complete"
    rootClassName="reg-layout"
    tracking={{
      topic: REG_TOPIC,
      pathToSubtopicId: REG_PATH_TO_SUBTOPIC_ID,
    }}
  >
    {children}
  </TopicLayout>
);

export default RegLayout;
