import React from "react";
import TopicLayout from "../../shared/components/topics/TopicLayout";
import "./SeqLayout.css";
import { seqPages, SEQ_TOPIC, SEQ_PATH_TO_SUBTOPIC_ID } from "./seqConfig";


const SeqLayout = ({ children, title, subtitle }) => (
  <TopicLayout
    title={title}
    subtitle={subtitle}
    pages={seqPages}
    topicLabel="Sequential Circuits"
    sidebarTitle="Sequential Circuits"
    sidebarCopy="Follow one state-logic chapter at a time with the same premium learning path used across the platform."
    heroKicker="Sequential Circuits"
    progressVerb="complete"
    rootClassName="seq-layout"
    tracking={{
      topic: SEQ_TOPIC,
      pathToSubtopicId: SEQ_PATH_TO_SUBTOPIC_ID,
    }}
  >
    {children}
  </TopicLayout>
);

export default SeqLayout;
