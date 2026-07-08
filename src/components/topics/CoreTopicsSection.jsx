import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeftRight,
  Binary,
  BookOpen,
  Calculator,
  Check,
  Cpu,
  Database,
  GitBranch,
  HardDrive,
  Layers3,
  MonitorPlay,
  Sigma,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useLearningProgress from "../../hooks/useLearningProgress";
import "./CoreTopicsSection.css";

const iconMap = {
  Sigma,
  Binary,
  Calculator,
  GitBranch,
  Workflow,
  ArrowLeftRight,
  Database,
  Sparkles,
  Cpu,
  BookOpen,
  HardDrive,
  Layers3,
  MonitorPlay,
  Zap,
};

const accentCopy = {
  violet: "Proof-driven simplification",
  cyan: "Precision conversions",
  amber: "Arithmetic logic design",
  blue: "Routing and selection",
  emerald: "State-aware systems",
  rose: "Data movement control",
  indigo: "Persistent storage logic",
  slate: "Optimization and mastery",
};

function TopicCard({ topic, progress, onOpenTopic, onToggleSubtopic }) {
  const Icon = iconMap[topic.icon] || Sparkles;
  const completion = progress?.completionPercentage || 0;
  const completedCount = progress?.completedCount || 0;
  const totalSubtopics = progress?.totalSubtopics || topic.links.length;
  const isCompleted = progress?.status === "completed";
  const primaryPath = topic.links[0]?.to || "/";

  return (
    <article
      id={topic.anchorId}
      className={`core-topic-card accent-${topic.accent}`}
    >
      <div className="core-topic-card-glow" aria-hidden="true" />

      <div className="core-topic-card-head">
        <div className="core-topic-card-icon">
          <Icon size={20} />
        </div>
        <div className="core-topic-card-copy">
          <span className="core-topic-card-eyebrow">{topic.eyebrow}</span>
          <h3>{topic.title}</h3>
          <p>{topic.description}</p>
        </div>
        <div className="core-topic-card-status">
          <span
            className={`core-topic-check ${isCompleted ? "is-complete" : ""}`}
          >
            <Check size={16} />
          </span>
          <span>{completion}%</span>
        </div>
      </div>

      <div className="core-topic-card-metrics">
        <div>
          <span>Modules</span>
          <strong>{topic.stats.modules}</strong>
        </div>
        <div>
          <span>Practice</span>
          <strong>{topic.stats.practice}</strong>
        </div>
        <div>
          <span>Level</span>
          <strong>{topic.stats.level}</strong>
        </div>
      </div>

      <div className="core-topic-progress">
        <div className="core-topic-progress-meta">
          <span>{topic.progressLabel}</span>
          <span>
            {completedCount}/{totalSubtopics} completed
          </span>
        </div>
        <div className="core-topic-progress-bar">
          <span style={{ width: `${completion}%` }} />
        </div>
        <small>{accentCopy[topic.accent]}</small>
      </div>

      <div className="core-topic-pill-grid">
        {topic.links.map((link) => {
          const isDone = progress?.completedSubtopics?.includes(link.id);
          return (
            <div
              key={link.id}
              className={`core-topic-pill ${isDone ? "is-done" : ""}`}
            >
              <Link
                to={link.to}
                onClick={() => onOpenTopic(topic)}
                className="core-topic-pill-link"
              >
                {link.text}
              </Link>
              <button
                type="button"
                className="core-topic-pill-toggle"
                onClick={() => onToggleSubtopic(topic, link.id)}
                aria-label={`Toggle completion for ${link.text}`}
              >
                <Check size={13} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="core-topic-card-footer">
        <Link
          to={primaryPath}
          className="core-topic-open-btn"
          onClick={() => onOpenTopic(topic)}
        >
          Open learning path
          <ArrowRight size={15} />
        </Link>
        <span className="core-topic-completion-note">
          {isCompleted
            ? "Completed and synced to your learner dashboard"
            : "Progress updates as you explore and complete modules"}
        </span>
      </div>
    </article>
  );
}

// topics must always be passed as a prop from Home.jsx — no internal fallback
export default function CoreTopicsSection({ topics }) {
  const { user } = useAuth();
  const { snapshot, openTopic, toggleSubtopicCompleted } = useLearningProgress({
    user,
    topics,
    problems: [],
  });

  if (!topics || topics.length === 0) return null;

  return (
    <section className="core-topics-section">
      <div className="core-topics-header">
        <div>
          <span className="core-topics-badge">Premium Core Logic Path</span>
          <h2>Core Logic Topics</h2>
          <p>
            Every core topic now follows one consistent premium architecture
            inspired by the Arithmetic module, with shared progress indicators,
            subtopic actions, and a cleaner production-style learning layout.
          </p>
        </div>

        <div className="core-topics-summary">
          <div>
            <strong>{snapshot.summary.completedTopics}</strong>
            <span>Completed topics</span>
          </div>
          <div>
            <strong>{snapshot.summary.totalTopics}</strong>
            <span>Total paths</span>
          </div>
          <div>
            <strong>{snapshot.summary.streaks.current}</strong>
            <span>Active-day streak</span>
          </div>
        </div>
      </div>

      <div className="core-topics-grid">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            progress={snapshot.state.topics[topic.id]}
            onOpenTopic={openTopic}
            onToggleSubtopic={toggleSubtopicCompleted}
          />
        ))}
      </div>
    </section>
  );
}
