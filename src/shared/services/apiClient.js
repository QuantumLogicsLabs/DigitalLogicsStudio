import axios from "axios";
import { resolveApiBaseUrl } from "../config/apiConfig";
import { notify } from "../utils/toastBridge";

const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Keep comments failures actionable when the local API is not running.
    if (
      (error.code === "ERR_NETWORK" || error.message === "Network Error") &&
      error.config?.url?.includes("boolforge-comments")
    ) {
      error.message = "Comments service is unavailable. Start the backend on port 5000.";
    }

    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    notify.error(error.message || "Something went wrong.");
    return Promise.reject(error);
  },
);

export default apiClient;
