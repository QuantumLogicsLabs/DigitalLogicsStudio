import apiClient from "./apiClient";

const authService = {
  register: async (payload) => {
    const { data } = await apiClient.post("/auth/register", payload);
    return data;
  },

  login: async (payload) => {
    const { data } = await apiClient.post("/auth/login", payload);
    return data;
  },

  logout: async () => {
    const { data } = await apiClient.post("/auth/logout");
    return data;
  },

  getCurrentUser: async () => {
    const { data } = await apiClient.get("/auth/me");
    return data;
  },

  // Uses the existing /progress route (progressService pattern)
  markProblemSolved: async (problemId) => {
    const { data } = await apiClient.post(
      `/progress/problems/${problemId}/complete`,
    );
    return data;
  },
};

export default authService;
