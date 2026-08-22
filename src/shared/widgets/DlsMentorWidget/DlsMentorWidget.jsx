import React, { useCallback, useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Minus, Send, Trash2 } from "lucide-react";
import { useAuth } from "../../../auth/context/AuthContext";
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

const MENTOR_AVATAR_SRC = null;

const MentorAvatar = React.memo(function MentorAvatar({ className, iconSize = 22 }) {
  if (MENTOR_AVATAR_SRC) {
    return <img src={MENTOR_AVATAR_SRC} alt="" className={className} />;
  }

  return (
    <span className={className} aria-hidden="true">
      <MessageCircle size={iconSize} strokeWidth={2} />
    </span>
  );
});
MentorAvatar.displayName = "MentorAvatar";

const HeaderActions = React.memo(function HeaderActions({ onClear, onMinimize }) {
  return (
    <div className="dls-mentor-panel__actions">
      <button
        type="button"
        className="dls-mentor-panel__icon-btn"
        onClick={onClear}
        aria-label="Clear chat"
        title="Clear chat"
      >
        <Trash2 size={15} />
      </button>
      <button
        type="button"
        className="dls-mentor-panel__icon-btn"
        onClick={onMinimize}
        aria-label="Minimize chat"
        title="Minimize"
      >
        <Minus size={15} />
      </button>
    </div>
  );
});
HeaderActions.displayName = "HeaderActions";

const PanelHeader = React.memo(function PanelHeader({ onClear, onMinimize }) {
  return (
    <header className="dls-mentor-panel__header">
      <MentorAvatar className="dls-mentor-panel__avatar" iconSize={20} />
      <div className="dls-mentor-panel__title-wrap">
        <h2 className="dls-mentor-panel__title">DLS & COAL Mentor</h2>
        <p className="dls-mentor-panel__subtitle">
          Digital Logic (DLD) & Computer Organization & Assembly
        </p>
      </div>
      <HeaderActions onClear={onClear} onMinimize={onMinimize} />
    </header>
  );
});
PanelHeader.displayName = "PanelHeader";

const PanelControls = React.memo(function PanelControls({
  level,
  onLevelChange,
  selectedCourse,
  onCourseChange,
  selectedTopic,
  onTopicChange,
  topicOptions,
}) {
  return (
    <div className="dls-mentor-panel__controls">
      <div className="dls-mentor-panel__control">
        <label htmlFor="dls-mentor-level">Level</label>
        <select
          id="dls-mentor-level"
          className="dls-mentor-panel__select"
          value={level}
          onChange={onLevelChange}
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
          onChange={onCourseChange}
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
          onChange={onTopicChange}
        >
          {topicOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
});
PanelControls.displayName = "PanelControls";

const ChatMessageItem = React.memo(function ChatMessageItem({ message }) {
  if (message.role === "typing") {
    return (
      <div className="dls-mentor-msg dls-mentor-msg--bot">
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
});
ChatMessageItem.displayName = "ChatMessageItem";

const SendButton = React.memo(function SendButton({ disabled }) {
  return (
    <button
      type="submit"
      className="dls-mentor-panel__send"
      disabled={disabled}
      aria-label="Send message"
    >
      <Send size={18} />
    </button>
  );
});
SendButton.displayName = "SendButton";

const BrandFooter = React.memo(function BrandFooter() {
  return (
    <p className="dls-mentor-panel__brand">
      <MessageCircle size={11} style={{ verticalAlign: "middle", marginRight: 4 }} />
      Digital Logic Studio · DLD & COAL · AI Assistant
    </p>
  );
});
BrandFooter.displayName = "BrandFooter";

const ChatInput = React.memo(
  React.forwardRef(function ChatInput({ onSendMessage, isSending }, ref) {
    const [input, setInput] = useState("");

    const handleSubmit = useCallback(
      (event) => {
        event.preventDefault();
        const trimmed = input.trim();
        if (trimmed && !isSending) {
          onSendMessage(trimmed);
          setInput("");
        }
      },
      [input, onSendMessage, isSending],
    );

    const handleKeyDown = useCallback(
      (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          const trimmed = input.trim();
          if (trimmed && !isSending) {
            onSendMessage(trimmed);
            setInput("");
          }
        }
      },
      [input, onSendMessage, isSending],
    );

    const isSendDisabled = isSending || !input.trim();

    return (
      <form className="dls-mentor-panel__input-row" onSubmit={handleSubmit}>
        <textarea
          ref={ref}
          className="dls-mentor-panel__input"
          rows={1}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about DLD, COAL, circuits, or assembly…"
          disabled={isSending}
          aria-label="Chat message"
        />
        <SendButton disabled={isSendDisabled} />
      </form>
    );
  }),
);
ChatInput.displayName = "ChatInput";

function DlsMentorWidgetInner() {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const hasInitializedRef = useRef(false);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [recentTopics, setRecentTopics] = useState([]);
  const [showIntroIcon, setShowIntroIcon] = useState(true);
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

  const topicOptions = selectedCourse === "coal" ? COAL_TOPIC_OPTIONS : DLD_TOPIC_OPTIONS;

  const learnerName = user?.name?.trim() || "Learner";

  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
    const pathCourse = courseFromPath(currentPath);
    const pathTopic = topicFromPath(currentPath);

    if (pathCourse) setSelectedCourse(pathCourse);
    if (pathTopic) setSelectedTopic(pathTopic);
  }, []);

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

  useEffect(() => {
    if (isOpen) return;

    const delay = showIntroIcon ? 3000 : 5000;
    const timer = setTimeout(() => {
      setShowIntroIcon((prev) => !prev);
    }, delay);

    return () => clearTimeout(timer);
  }, [isOpen, showIntroIcon]);

  const handleLevelChange = useCallback((event) => {
    setLevel(event.target.value);
  }, []);

  const handleTopicChange = useCallback((event) => {
    setSelectedTopic(event.target.value);
  }, []);

  const handleCourseChange = useCallback((event) => {
    const nextCourse = event.target.value;
    setSelectedCourse(nextCourse);
    if (!isTopicValidForCourse(selectedTopic, nextCourse)) {
      setSelectedTopic(getDefaultTopicForCourse(nextCourse));
    }
  }, [selectedTopic]);

  const handleMinimize = useCallback(() => {
    setIsOpen(false);
  }, []);

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

  const clearChat = useCallback(() => {
    setMessages([]);
    inputRef.current?.focus();
  }, []);

  if (isPrerendering()) {
    return null;
  }

  if (!isOpen) {
    return (
     <button
        type="button"
        className="dls-mentor-launcher"
        onClick={() => setIsOpen(true)}
        aria-label="Open BoolMentor chat"
        title="BoolMentor"
      >
        <span className="dls-mentor-launcher__icon" aria-hidden="true">
          <span
            className={`bot-icon bot-icon--intro${showIntroIcon ? " is-visible" : ""}`}
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {/* Minimal Chat Bubble Icon */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
            </svg>
          </span>
          
          <Bot
            size={24}
            strokeWidth={2}
            className={`bot-icon bot-icon--main${showIntroIcon ? "" : " is-visible"}`}
          />
        </span>
      </button>
    );
  }

  const showWelcome = messages.length === 0;

  return (
    <section className="dls-mentor-panel" aria-label="DLS & COAL Mentor chat">
      <PanelHeader onClear={clearChat} onMinimize={handleMinimize} />

      <PanelControls
        level={level}
        onLevelChange={handleLevelChange}
        selectedCourse={selectedCourse}
        onCourseChange={handleCourseChange}
        selectedTopic={selectedTopic}
        onTopicChange={handleTopicChange}
        topicOptions={topicOptions}
      />

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

        {messages.map((message) => (
          <ChatMessageItem key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <footer className="dls-mentor-panel__footer">
        <ChatInput ref={inputRef} onSendMessage={sendMessage} isSending={isSending} />
        <BrandFooter />
      </footer>
    </section>
  );
}

DlsMentorWidgetInner.displayName = "DlsMentorWidgetInner";

export default React.memo(DlsMentorWidgetInner);
