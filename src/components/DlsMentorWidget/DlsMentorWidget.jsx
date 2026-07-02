import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, Minus, Send, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { sendChatMessage } from "../../services/aiService";
import { isPrerendering } from "../../utils/prerender";
import { TOPIC_OPTIONS, topicFromPath, topicLabel } from "../../utils/topicFromPath";
import "./DlsMentorWidget.css";

const LEVEL_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const QUICK_PROMPTS = [
  "What is a flip-flop?",
  "Explain Boolean algebra laws",
  "How does a full adder work?",
  "How do I get started?",
];

const LEVEL_STORAGE_KEY = "dls-mentor-level";

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

  const currentTopic = useMemo(
    () => topicFromPath(location.pathname),
    [location.pathname],
  );

  const learnerName = user?.name?.trim() || "Learner";

  useEffect(() => {
    window.localStorage.setItem(LEVEL_STORAGE_KEY, level);
  }, [level]);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    setRecentTopics((prev) => {
      if (prev[0] === currentTopic) return prev;
      const next = [currentTopic, ...prev.filter((topic) => topic !== currentTopic)];
      return next.slice(0, 3);
    });
  }, [currentTopic]);

  const buildContext = useCallback(
    () => ({
      name: learnerName,
      currentTopic,
      recentTopics,
      learnerLevel: level,
      difficulty: level,
    }),
    [learnerName, currentTopic, recentTopics, level],
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
        aria-label="Open DLS Mentor chat"
        title="DLS Mentor"
      >
        <MentorAvatar className="dls-mentor-launcher__icon" iconSize={22} />
        <span className="dls-mentor-launcher__text">
          <span className="dls-mentor-launcher__title">DLS Mentor</span>
          <span className="dls-mentor-launcher__hint">Ask AI</span>
        </span>
      </button>
    );
  }

  const showWelcome = messages.length === 0;

  return (
    <section className="dls-mentor-panel" aria-label="DLS Mentor chat">
      <header className="dls-mentor-panel__header">
        <MentorAvatar className="dls-mentor-panel__avatar" iconSize={20} />
        <div className="dls-mentor-panel__title-wrap">
          <h2 className="dls-mentor-panel__title">DLS Mentor</h2>
          <p className="dls-mentor-panel__subtitle">Your AI digital logic assistant</p>
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
        <label htmlFor="dls-mentor-topic">Topic</label>
        <select
          id="dls-mentor-topic"
          className="dls-mentor-panel__select"
          value={currentTopic}
          disabled
          title="Topic is detected from the page you are on"
        >
          {TOPIC_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="dls-mentor-panel__messages">
        {showWelcome && (
          <>
            <div className="dls-mentor-welcome">
              Welcome{user?.name ? `, ${user.name}` : ""} to DLS Mentor. I can explain digital
              logic topics, guide your learning path, and help with circuits — ask me anything
              about {topicLabel(currentTopic)}.
            </div>
            <div className="dls-mentor-quick-prompts">
              <span className="dls-mentor-quick-prompts__label">Quick prompts</span>
              <div className="dls-mentor-quick-prompts__grid">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="dls-mentor-quick-prompt"
                    onClick={() => sendMessage(prompt)}
                    disabled={isSending}
                  >
                    {prompt}
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
              <div className="dls-mentor-msg__bubble">{message.text}</div>
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
            placeholder="Type your question here..."
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
          Digital Logic Studio · AI Assistant
        </p>
      </footer>
    </section>
  );
}

export default DlsMentorWidget;
