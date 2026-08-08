import React from "react";
import TopicLayout from "../../shared/components/topics/TopicLayout";
import "./MemorySystem.css";
import {
  memoryPages,
  MEMORY_PATH_TO_SUBTOPIC_ID,
  MEMORY_TOPIC,
} from "./memoryConfig";

const MemoryLayout = ({ title, kicker, description, children }) => (
  <TopicLayout
    title={title}
    subtitle={description}
    pages={memoryPages}
    topicLabel="Memory Systems"
    sidebarTitle="Memory Systems"
    sidebarCopy="Progress through storage architectures, RAM families, and memory construction inside one unified premium workspace."
    heroKicker={kicker || "Memory Systems"}
    progressVerb="complete"
    rootClassName="mem-layout"
    tracking={{
      topic: MEMORY_TOPIC,
      pathToSubtopicId: MEMORY_PATH_TO_SUBTOPIC_ID,
    }}
  >
    {children}
  </TopicLayout>
);

export default MemoryLayout;
