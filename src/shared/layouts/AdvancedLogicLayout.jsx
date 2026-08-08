import React from "react";
import TopicLayout from "../components/topics/TopicLayout";
import {
  advancedLogicPages,
  ADVANCED_LOGIC_TOPIC,
  ADVANCED_LOGIC_PATH_TO_SUBTOPIC_ID,
} from "../../features/logic-gates/advancedLogicConfig";

const AdvancedLogicLayout = ({
  title,
  subtitle,
  intro,
  highlights = [],
  children,
}) => (
  <TopicLayout
    title={title}
    subtitle={subtitle}
    intro={intro}
    highlights={highlights}
    pages={advancedLogicPages}
    topicLabel="Advanced Logic"
    sidebarTitle="Advanced Logic"
    sidebarCopy="Study optimization, universal construction, parity, and deeper reasoning inside the same premium shell."
    heroKicker="Advanced Logic"
    progressVerb="complete"
    tracking={{
      topic: ADVANCED_LOGIC_TOPIC,
      pathToSubtopicId: ADVANCED_LOGIC_PATH_TO_SUBTOPIC_ID,
    }}
  >
    {children}
  </TopicLayout>
);

export default AdvancedLogicLayout;
