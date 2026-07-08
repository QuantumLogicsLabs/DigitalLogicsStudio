import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, Minus, Send, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { sendChatMessage } from "../../services/aiService";
import { isPrerendering } from "../../utils/prerender";
import {
  COAL_TOPIC_OPTIONS,
  DLD_TOPIC_OPTIONS,
  courseFromPath,
  topicFromPath,
} from "../../utils/topicFromPath";
import "./DlsMentorWidget.css";
import { renderChatMessage } from "./formatChatMessage";

const LEVEL_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const QUICK_PROMPTS = [
  { text: "What is a flip-flop?", tag: "DLD" },
  { text: "Explain Boolean algebra laws", tag: "DLD" },
  { text: "What is COAL syntax?", tag: "COAL" },
  { text: "Explain fetch-decode-execute", tag: "COAL" },
];

const LEVEL_STORAGE_KEY = "dls-mentor-level";
const COURSE_STORAGE_KEY = "dls-mentor-course";
const TOPIC_STORAGE_KEY = "dls-mentor-topic";

function getDefaultTopicForCourse(course) {
  return course === "coal"
    ? COAL_TOPIC_OPTIONS[0].value
    : DLD_TOPIC_OPTIONS[0].value;
}

function isTopicValidForCourse(topic, course) {
  const options = course === "coal" ? COAL_TOPIC_OPTIONS : DLD_TOPIC_OPTIONS;
  return options.some((option) => option.value === topic);
}

// Set to your image path when ready, e.g. import mentorAvatar from "../../assets/dls-mentor.png";
const MENTOR_AVATAR_SRC = null;

function MentorAvatar({ className, iconSize = 22 }) {
  if (MENTOR_AVATAR_SRC) {
    return <img src={MENTOR_AVATAR_SRC} alt="" className={className} />;
  }

  return (
    <span className={className} aria-hidden="true">
      <MessageCircle size={iconSize} strokeWidth={2} />
    </span>
  );
}

function DlsMentorWidget() {
  const { user } = useAuth();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [recentTopics, setRecentTopics] = useState([]);
  const [level, setLevel] = useState(() => {
    if (typeof window === "undefined") return "intermediate";
    return window.localStorage.getItem(LEVEL_STORAGE_KEY) || "intermediate";
  });
  const [selectedCourse, setSelectedCourse] = useState(() => {
    if (typeof window === "undefined") return "dld";
    return window.localStorage.getItem(COURSE_STORAGE_KEY) || "dld";
  });
  const [selectedTopic, setSelectedTopic] = useState(() => {
    if (typeof window === "undefined") return "boolean-algebra";
    return window.localStorage.getItem(TOPIC_STORAGE_KEY) || "boolean-algebra";
  });

  const pathCourse = useMemo(
    () => courseFromPath(location.pathname),
    [location.pathname],
  );

  const pathTopic = useMemo(
    () => topicFromPath(location.pathname),
    [location.pathname],
  );

  const topicOptions = selectedCourse === "coal" ? COAL_TOPIC_OPTIONS : DLD_TOPIC_OPTIONS;

  const learnerName = user?.name?.trim() || "Learner";

  useEffect(() => {
    window.localStorage.setItem(LEVEL_STORAGE_KEY, level);
  }, [level]);

  useEffect(() => {
    window.localStorage.setItem(COURSE_STORAGE_KEY, selectedCourse);
  }, [selectedCourse]);

  useEffect(() => {
    window.localStorage.setItem(TOPIC_STORAGE_KEY, selectedTopic);
  }, [selectedTopic]);

  useEffect(() => {
    setSelectedCourse(pathCourse);
    setSelectedTopic(pathTopic);
  }, [pathCourse, pathTopic]);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    setRecentTopics((prev) => {
      if (prev[0] === selectedTopic) return prev;
      const next = [selectedTopic, ...prev.filter((topic) => topic !== selectedTopic)];
      return next.slice(0, 3);
    });
  }, [selectedTopic]);

  const handleCourseChange = (event) => {
    const nextCourse = event.target.value;
    setSelectedCourse(nextCourse);
    if (!isTopicValidForCourse(selectedTopic, nextCourse)) {
      setSelectedTopic(getDefaultTopicForCourse(nextCourse));
    }
  };

  const buildContext = useCallback(
    () => ({
      name: learnerName,
      currentCourse: selectedCourse === "coal" ? "COAL" : "DLS",
      currentTopic: selectedTopic,
      recentTopics,
      learnerLevel: level,
      difficulty: level,
    }),
    [learnerName, selectedCourse, selectedTopic, recentTopics, level],
  );

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;

      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text: trimmed }]);
      setInput("");
      setIsSending(true);

      const typingId = crypto.randomUUID();
      setMessages((prev) => [...prev, { id: typingId, role: "typing" }]);

      try {
        const { data } = await sendChatMessage(trimmed, buildContext());
        setMessages((prev) =>
          prev
            .filter((message) => message.id !== typingId)
            .concat({
              id: crypto.randomUUID(),
              role: "bot",
              text: data.reply || "No response received.",
            }),
        );
      } catch (error) {
        setMessages((prev) =>
          prev
            .filter((message) => message.id !== typingId)
            .concat({
              id: crypto.randomUUID(),
              role: "error",
              text:
                error.message ||
                "Could not reach DLS Mentor. Make sure the AI service is running.",
            }),
        );
      } finally {
        setIsSending(false);
      }
    },
    [buildContext, isSending],
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
    inputRef.current?.focus();
  };

  if (isPrerendering()) {
    return null;
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        className="dls-mentor-launcher"
        onClick={() => setIsOpen(true)}
        aria-label="Open DLS & COAL Mentor chat"
        title="DLS & COAL Mentor"
      >
        <MentorAvatar className="dls-mentor-launcher__icon" iconSize={22} />
        <span className="dls-mentor-launcher__text">
          <span className="dls-mentor-launcher__title">DLS & COAL Mentor</span>
          <span className="dls-mentor-launcher__hint">Digital Logic · Computer Organization</span>
        </span>
      </button>
    );
  }

  const showWelcome = messages.length === 0;

  return (
    <section className="dls-mentor-panel" aria-label="DLS & COAL Mentor chat">
      <header className="dls-mentor-panel__header">
        <MentorAvatar className="dls-mentor-panel__avatar" iconSize={20} />
        <div className="dls-mentor-panel__title-wrap">
          <h2 className="dls-mentor-panel__title">DLS & COAL Mentor</h2>
          <p className="dls-mentor-panel__subtitle">
            Digital Logic (DLD) & Computer Organization & Assembly
          </p>
        </div>
        <div className="dls-mentor-panel__actions">
          <button
            type="button"
            className="dls-mentor-panel__icon-btn"
            onClick={clearChat}
            aria-label="Clear chat"
            title="Clear chat"
          >
            <Trash2 size={15} />
          </button>
          <button
            type="button"
            className="dls-mentor-panel__icon-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Minimize chat"
            title="Minimize"
          >
            <Minus size={15} />
          </button>
        </div>
      </header>

      <div className="dls-mentor-panel__controls">
        <div className="dls-mentor-panel__control">
          <label htmlFor="dls-mentor-level">Level</label>
          <select
            id="dls-mentor-level"
            className="dls-mentor-panel__select"
            value={level}
            onChange={(event) => setLevel(event.target.value)}
          >
            {LEVEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="dls-mentor-panel__control">
          <label htmlFor="dls-mentor-course">Course</label>
          <select
            id="dls-mentor-course"
            className="dls-mentor-panel__select"
            value={selectedCourse}
            onChange={handleCourseChange}
          >
            <option value="dld">DLD</option>
            <option value="coal">COAL</option>
          </select>
        </div>
        <div className="dls-mentor-panel__control">
          <label htmlFor="dls-mentor-topic">Topic</label>
          <select
            id="dls-mentor-topic"
            className="dls-mentor-panel__select"
            value={selectedTopic}
            onChange={(event) => setSelectedTopic(event.target.value)}
          >
            {topicOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="dls-mentor-panel__messages">
        {showWelcome && (
          <>
            <div className="dls-mentor-welcome">
              <p>
                Hi{user?.name ? ` ${user.name}` : ""}! Ask me about <strong>DLD</strong> (digital logic)
                or <strong>COAL</strong> (computer organization & assembly) — pick your course above,
                or try a quick prompt.
              </p>
            </div>
            <div className="dls-mentor-quick-prompts">
              <span className="dls-mentor-quick-prompts__label">Quick prompts</span>
              <div className="dls-mentor-quick-prompts__grid">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.text}
                    type="button"
                    className="dls-mentor-quick-prompt"
                    onClick={() => sendMessage(prompt.text)}
                    disabled={isSending}
                  >
                    <span
                      className={`dls-mentor-prompt-tag dls-mentor-prompt-tag--${prompt.tag.toLowerCase()}`}
                    >
                      {prompt.tag}
                    </span>
                    {prompt.text}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {messages.map((message) => {
          if (message.role === "typing") {
            return (
              <div key={message.id} className="dls-mentor-msg dls-mentor-msg--bot">
                <div className="dls-mentor-msg__bubble">
                  <span className="dls-mentor-typing" aria-label="Typing">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              </div>
            );
          }

          const isUser = message.role === "user";
          const isError = message.role === "error";

          return (
            <div
              key={message.id}
              className={`dls-mentor-msg ${isUser ? "dls-mentor-msg--user" : "dls-mentor-msg--bot"}${isError ? " dls-mentor-msg--error" : ""}`}
            >
              {isUser && (
                <div className="dls-mentor-msg__avatar" aria-hidden="true">
                  👤
                </div>
              )}
              <div className="dls-mentor-msg__bubble">
                {isUser || isError ? message.text : renderChatMessage(message.text)}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <footer className="dls-mentor-panel__footer">
        <form className="dls-mentor-panel__input-row" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            className="dls-mentor-panel__input"
            rows={1}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about DLD, COAL, circuits, or assembly…"
            disabled={isSending}
            aria-label="Chat message"
          />
          <button
            type="submit"
            className="dls-mentor-panel__send"
            disabled={isSending || !input.trim()}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="dls-mentor-panel__brand">
          <MessageCircle size={11} style={{ verticalAlign: "middle", marginRight: 4 }} />
          Digital Logic Studio · DLD & COAL · AI Assistant
        </p>
      </footer>
    </section>
  );
}

export default DlsMentorWidget;
