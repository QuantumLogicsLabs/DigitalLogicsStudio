import React from "react";
import PremiumLearningShell from "../../components/topics/PremiumLearningShell";
import {
  buildCoalPartSidebarPages,
  buildCoalTopicPages,
  COAL_PATH_TO_SUBTOPIC_ID,
  COAL_THEORY_OVERVIEW_PATH,
  isCoalPartSidebarActive,
} from "../../utils/coalCourseUtils";
import "./CoalLayout.css";

const coalTopicPages = buildCoalTopicPages();
const coalPartSidebarPages = buildCoalPartSidebarPages();

const COAL_TOPIC = {
  id: "coal-theory",
  title: "COAL THEORY",
  links: Object.values(COAL_PATH_TO_SUBTOPIC_ID).map((id) => ({ id })),
};

function CoalLayout({
  children,
  title,
  subtitle,
  intro,
  highlights = [],
}) {
  return (
    <PremiumLearningShell
      title={title}
      subtitle={subtitle}
      intro={intro}
      highlights={highlights}
      pages={coalTopicPages}
      sidebarPages={coalPartSidebarPages}
      overviewPath={COAL_THEORY_OVERVIEW_PATH}
      isSidebarItemActive={isCoalPartSidebarActive}
      topicLabel="COAL Theory"
      sidebarTitle="Course parts"
      sidebarCopy="Jump to a part on the theory path. Open individual topics from the dots above or the cards below."
      heroKicker="Computer Organization & Assembly"
      progressVerb="explored"
      rootClassName="coal-layout"
      sidebarFooterLink="/resources/coal"
      sidebarFooterLabel="← COAL home"
      tracking={{
        topic: COAL_TOPIC,
        pathToSubtopicId: COAL_PATH_TO_SUBTOPIC_ID,
      }}
    >
      {children}
    </PremiumLearningShell>
  );
}

export default CoalLayout;
