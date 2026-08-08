import React from "react";
import PremiumLearningShell from "./PremiumLearningShell";

const TopicLayout = ({
  title,
  subtitle,
  intro,
  highlights = [],
  pages,
  sidebarPages,
  overviewPath,
  isSidebarItemActive,
  isSidebarItemDone,
  topicLabel,
  sidebarTitle,
  sidebarCopy,
  heroKicker,
  progressVerb = "complete",
  tracking,
  rootClassName = "topic-layout",
  sidebarFooterLink = "/",
  sidebarFooterLabel = "← Back to All Topics",
  children,
}) => (
  <PremiumLearningShell
    title={title}
    subtitle={subtitle}
    intro={intro}
    highlights={highlights}
    pages={pages}
    sidebarPages={sidebarPages}
    overviewPath={overviewPath}
    isSidebarItemActive={isSidebarItemActive}
    isSidebarItemDone={isSidebarItemDone}
    topicLabel={topicLabel}
    sidebarTitle={sidebarTitle}
    sidebarCopy={sidebarCopy}
    heroKicker={heroKicker}
    progressVerb={progressVerb}
    rootClassName={rootClassName}
    sidebarFooterLink={sidebarFooterLink}
    sidebarFooterLabel={sidebarFooterLabel}
    tracking={tracking}
  >
    {children}
  </PremiumLearningShell>
);

export default TopicLayout;
