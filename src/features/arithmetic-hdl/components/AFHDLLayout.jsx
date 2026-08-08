import React from "react";
import TopicLayout from "../../../shared/components/topics/TopicLayout";
import { afhdlPages, AFHDL_TOPIC, AFHDL_PATH_TO_SUBTOPIC_ID } from "../afhdlConfig";

const AFHDLLayout = ({ title, subtitle, intro, highlights = [], children }) => (
  <TopicLayout
    title={title}
    subtitle={subtitle}
    intro={intro}
    highlights={highlights}
    pages={afhdlPages}
    topicLabel="Arithmetic & HDLs"
    sidebarTitle="Arithmetic Toolkit"
    sidebarCopy="Learn one operation at a time, then connect ideas to hardware design."
    heroKicker="Arithmetic Functions and HDLs"
    progressVerb="complete"
    tracking={{
      topic: AFHDL_TOPIC,
      pathToSubtopicId: AFHDL_PATH_TO_SUBTOPIC_ID,
    }}
  >
    {children}
  </TopicLayout>
);

export default AFHDLLayout;
