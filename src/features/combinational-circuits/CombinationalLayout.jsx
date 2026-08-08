import React from "react";
import TopicLayout from "../../shared/components/topics/TopicLayout";
import {
  combinationalPages,
  COMBINATIONAL_TOPIC,
  COMBINATIONAL_PATH_TO_SUBTOPIC_ID,
} from "./combinationalConfig";


const CombinationalLayout = ({
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
    pages={combinationalPages}
    topicLabel="Combinational Circuits"
    sidebarTitle="Combinational Circuits"
    sidebarCopy="Move through signal routing, encoding, decoding, and selection with one premium lesson framework."
    heroKicker="Combinational Circuits"
    progressVerb="complete"
    tracking={{
      topic: COMBINATIONAL_TOPIC,
      pathToSubtopicId: COMBINATIONAL_PATH_TO_SUBTOPIC_ID,
    }}
  >
    {children}
  </TopicLayout>
);

export default CombinationalLayout;
