const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

const isAnalyticsEnabled = () =>
  typeof window !== "undefined" && Boolean(GA_MEASUREMENT_ID);

export const initAnalytics = () => {
  if (!isAnalyticsEnabled()) return;
  if (window.__boolforgeAnalyticsInitialized) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args) {
    window.dataLayer.push(args);
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
    anonymize_ip: true,
  });

  window.__boolforgeAnalyticsInitialized = true;
};

export const trackPageView = ({ path, title }) => {
  if (!isAnalyticsEnabled() || typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
};

export const trackEvent = (name, params = {}) => {
  if (!isAnalyticsEnabled() || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
};

export const trackToolInteraction = (toolName, action, params = {}) =>
  trackEvent("tool_interaction", {
    tool_name: toolName,
    interaction_action: action,
    ...params,
  });

export const trackPracticeEngagement = (action, params = {}) =>
  trackEvent("practice_engagement", {
    practice_action: action,
    ...params,
  });

export const trackTopicEngagement = (topicName, action, params = {}) =>
  trackEvent("topic_engagement", {
    topic_name: topicName,
    engagement_action: action,
    ...params,
  });

export const trackWebVital = ({ name, delta, value, id }) =>
  trackEvent("web_vital", {
    event_category: "Web Vitals",
    event_label: name,
    value: Math.round(name === "CLS" ? delta * 1000 : delta),
    metric_id: id,
    metric_value: value,
    non_interaction: true,
  });

export const analyticsConfig = {
  measurementId: GA_MEASUREMENT_ID,
  enabled: Boolean(GA_MEASUREMENT_ID),
};
