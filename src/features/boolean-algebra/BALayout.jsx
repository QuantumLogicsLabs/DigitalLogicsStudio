import React from "react";
import TopicLayout from "../../shared/components/topics/TopicLayout";
import "./BALayout.css";
import { baPages, BA_TOPIC, BA_PATH_TO_SUBTOPIC_ID } from "./components/baConfig";

const BALayout = ({ title, subtitle, intro, highlights = [], children }) => (
  <TopicLayout
    title={title}
    subtitle={subtitle}
    intro={intro}
    highlights={highlights}
    pages={baPages}
    overviewPath="/boolean/overview"
    topicLabel="Boolean Algebra"
    sidebarTitle="Boolean Algebra"
    sidebarCopy="Master the mathematical foundation of every digital circuit with one polished lesson flow."
    heroKicker="Boolean Algebra"
    progressVerb="read"
    rootClassName="ba-layout"
    tracking={{
      topic: BA_TOPIC,
      pathToSubtopicId: BA_PATH_TO_SUBTOPIC_ID,
    }}
  >
    {children}
  </TopicLayout>
);

export default BALayout;
