import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import authService from "../services/authService";
import progressService from "../services/progressService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [solvedProblems, setSolvedProblems] = useState(new Set());

  // ── Bootstrap: check if there is an existing session cookie ──────────────
  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await authService.getCurrentUser();
        setUser(data.user);
        // If backend embeds solvedProblems on the user object, use that
        if (data.user?.solvedProblems?.length) {
          setSolvedProblems(new Set(data.user.solvedProblems));
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // ── Auth actions ──────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const data = await authService.login({ email, password });
    setUser(data.user);
    if (data.user?.solvedProblems?.length) {
      setSolvedProblems(new Set(data.user.solvedProblems));
    }
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await authService.register({ name, email, password });
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setSolvedProblems(new Set());
    }
  }, []);

  // ── Problem progress ──────────────────────────────────────────────────────

  const hasSolvedProblem = useCallback(
    (problemId) => solvedProblems.has(problemId),
    [solvedProblems],
  );

  const markProblemSolved = useCallback(async (problemId) => {
    if (!problemId) return;

    // Optimistic update so UI reflects "Completed" immediately
    setSolvedProblems((prev) => {
      if (prev.has(problemId)) return prev;
      const next = new Set(prev);
      next.add(problemId);
      return next;
    });

    // Persist via the existing progress route
    await progressService.completeProblem(problemId);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    solvedProblems,
    hasSolvedProblem,
    markProblemSolved,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return ctx;
}

export default AuthContext;
