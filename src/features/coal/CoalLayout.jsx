import React from "react";
import TopicLayout from "../../shared/components/topics/TopicLayout";
import CoalSidebar from "./CoalSidebar";
import {
  buildCoalPartSidebarPages,
  buildCoalTopicPages,
  COAL_PATH_TO_SUBTOPIC_ID,
  COAL_TOPIC,
  COAL_THEORY_OVERVIEW_PATH,
  isCoalPartSidebarActive,
  isCoalPartSidebarDone,
} from "../../shared/utils/coalCourseUtils";
import "./CoalLayout.css";

const coalTopicPages = buildCoalTopicPages();
const coalPartSidebarPages = buildCoalPartSidebarPages();


function CoalLayout({
  children,
  title,
  subtitle,
  intro,
  highlights = [],
}) {
  return (
    <>
      {/* Desktop-only (≥1280px) accordion sidebar — fully independent of
          PremiumLearningShell's own sidebar, hidden at that breakpoint via
          CoalLayout.css. Mobile keeps the original hamburger drawer. */}
      <CoalSidebar />

      <TopicLayout
        title={title}
        subtitle={subtitle}
        intro={intro}
        highlights={highlights}
        pages={coalTopicPages}
        sidebarPages={coalPartSidebarPages}
        overviewPath={COAL_THEORY_OVERVIEW_PATH}
        isSidebarItemActive={isCoalPartSidebarActive}
        isSidebarItemDone={isCoalPartSidebarDone}
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
      </TopicLayout>
    </>
  );
}

export default CoalLayout;