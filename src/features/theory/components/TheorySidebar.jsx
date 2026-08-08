import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Check } from "lucide-react";
import { useAuth } from "../../../auth/context/AuthContext";
import progressService from "../../../shared/services/progressService";
import "./TheorySidebar.css";

// ── Generic theory sidebar ──────────────────────────────────────────
// One accordion of "parts", each expanding to its topic list. Shared by
// DLD and COAL.
//
// Progress tracking differs slightly between the two tracks:
//  - COAL tracks all parts under one shared topic id ("coal-theory"),
//    so `progressTopicId` is a single string.
//  - DLD tracks each part under its OWN topic id (matching each part's
//    original standalone layout, e.g. "memory-systems"), preserving
//    already-saved per-category progress. Pass `progressTopicId` as a
//    function `(part) => topicId` for this mode.
export default function TheorySidebar({ track }) {
  const { utils, courseParts, homePath, sidebarTitle, sidebarCopy, progressTopicId } = track;
  const location = useLocation();
  const { user } = useAuth();
  const userKey = progressService.getUserKey(user);

  const topicIdFor = useCallback(
    (part) => (typeof progressTopicId === "function" ? progressTopicId(part) : progressTopicId),
    [progressTopicId],
  );

  const catalog = useMemo(() => {
    const topicIds = new Set(courseParts.map((p) => topicIdFor(p)));
    return { topics: [...topicIds].map((id) => ({ id, links: [] })), problems: [] };
  }, [courseParts, topicIdFor]);

  const getCompleted = useCallback(() => {
    const snapshot = progressService.getSnapshot(userKey, catalog);
    const byTopic = {};
    courseParts.forEach((part) => {
      const topicId = topicIdFor(part);
      byTopic[part.id] = snapshot.state.topics?.[topicId]?.completedSubtopics || [];
    });
    return byTopic;
  }, [catalog, userKey, courseParts, topicIdFor]);

  const [completed, setCompleted] = useState(() => getCompleted());

  const dbLoadedRef = useRef(null);
  useEffect(() => {
    if (!user || userKey === "guest") return;
    if (dbLoadedRef.current === userKey) return;
    dbLoadedRef.current = userKey;
    progressService.loadFromDB(userKey).then(() => setCompleted(getCompleted()));
  }, [user, userKey, getCompleted]);

  useEffect(() => {
    setCompleted(getCompleted());
  }, [getCompleted, location.pathname, location.hash]);

  const activePartId = useMemo(() => {
    if (location.pathname === homePath) {
      if (!location.hash) return null;
      const match = location.hash.match(/^#part-(.+)$/);
      return match ? match[1] : null;
    }
    const part = utils.getPartForPath(location.pathname);
    return part ? part.id : null;
  }, [location.pathname, location.hash, homePath, utils]);

  const [openPartId, setOpenPartId] = useState(activePartId || courseParts[0]?.id || null);

  useEffect(() => {
    if (activePartId) setOpenPartId(activePartId);
  }, [activePartId]);

  const togglePart = (id) => {
    setOpenPartId((current) => (current === id ? null : id));
  };

  return (
    <nav className="theory-folder-sidebar" aria-label={`${sidebarTitle} course parts`}>
      <div className="theory-folder-sidebar-inner">
        <div className="theory-folder-sidebar-card">
          <p className="theory-folder-sidebar-kicker">Learning Path</p>
          <h2 className="theory-folder-sidebar-title">Course parts</h2>
          <p className="theory-folder-sidebar-copy">{sidebarCopy || "Open a part to see its topics, or click straight through."}</p>
        </div>

        <div className="theory-folder-sidebar-folders">
          {courseParts.map((part) => {
            const isOpen = openPartId === part.id;
            const isActivePart = activePartId === part.id;
            const partCompleted = completed[part.id] || [];
            const doneCount = part.modules.filter((m) =>
              partCompleted.includes(m.subtopicId || m.slug),
            ).length;
            const isPartDone = part.modules.length > 0 && doneCount === part.modules.length;

            return (
              <div
                key={part.id}
                className={`theory-folder-sidebar-folder${isOpen ? " is-open" : ""}${
                  isActivePart ? " is-active" : ""
                }`}
              >
                <button
                  type="button"
                  className="theory-folder-sidebar-folder-head"
                  onClick={() => togglePart(part.id)}
                  aria-expanded={isOpen}
                >
                  <span className="theory-folder-sidebar-folder-index">
                    {String(part.part).padStart(2, "0")}
                  </span>
                  <span className="theory-folder-sidebar-folder-copy">
                    <span className="theory-folder-sidebar-folder-label">Part {part.part}</span>
                    <span className="theory-folder-sidebar-folder-title">{part.title}</span>
                  </span>
                  <span className="theory-folder-sidebar-folder-meta">
                    {isPartDone ? (
                      <span className="theory-folder-sidebar-folder-check" title="All topics completed">
                        <Check size={13} />
                      </span>
                    ) : (
                      <span className="theory-folder-sidebar-folder-count">
                        {doneCount}/{part.modules.length}
                      </span>
                    )}
                    <ChevronDown size={15} className="theory-folder-sidebar-chevron" aria-hidden="true" />
                  </span>
                </button>

                <div className="theory-folder-sidebar-folder-body">
                  <div className="theory-folder-sidebar-folder-body-inner">
                    <Link
                      to={`${homePath}#part-${part.id}`}
                      className="theory-folder-sidebar-subitem theory-folder-sidebar-subitem-overview"
                    >
                      Part overview
                    </Link>
                    {part.modules.map((module) => {
                      const path = utils.getTopicPath(module.slug);
                      const isDone = partCompleted.includes(module.subtopicId || module.slug);
                      return (
                        <NavLink
                          key={module.slug}
                          to={path}
                          className={({ isActive }) =>
                            `theory-folder-sidebar-subitem${isActive ? " is-active" : ""}${isDone ? " is-done" : ""}`
                          }
                        >
                          <span className="theory-folder-sidebar-subitem-dot" />
                          <span className="theory-folder-sidebar-subitem-label">{module.title}</span>
                          {isDone ? <Check size={12} className="theory-folder-sidebar-subitem-check" /> : null}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="theory-folder-sidebar-footer">
          <Link to={homePath} className="theory-folder-sidebar-home-btn">
            ← {track.id === "coal" ? "COAL" : "DLD"} home
          </Link>
        </div>
      </div>
    </nav>
  );
}
