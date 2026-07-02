import axios from "axios";

const LOCAL_AI_URL = "http://localhost:5100/api/ai";

function resolveAiBaseUrl() {
  const configured = process.env.REACT_APP_AI_URL?.trim();
  if (configured) {
    return configured.replace(/\/+$/, "");
  }
  return LOCAL_AI_URL;
}

const aiClient = axios.create({
  baseURL: resolveAiBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

aiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.error) {
      error.message = error.response.data.error;
    } else if (!error.response) {
      error.message =
        "Cannot reach DLS Mentor. Make sure the AI server is running on port 5100 (npm run dev in Dls-AI-Chatbot).";
    }
    return Promise.reject(error);
  },
);

export const sendChatMessage = (message, context) =>
  aiClient.post("/chat", { message, context });

export default aiClient;
