import { useCallback, useEffect, useState } from "react";
import apiClient from "../../../shared/services/apiClient";
import { useAuth } from "../../../auth/context/AuthContext";

function getCommentsError(error, fallback) {
  if (error?.code === "ERR_NETWORK" || error?.message === "Network Error") {
    return "Comments service is unavailable. Start the backend on port 5000 and try again.";
  }
  return error?.message || fallback;
}

export function useBoardComments(boardKey, enabled = false) {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadComments = useCallback(async () => {
    if (!enabled || !boardKey || !isAuthenticated) return;

    setLoading(true);
    setError("");
    try {
      const { data } = await apiClient.get("/boolforge-comments", {
        params: { boardKey },
      });
      setComments(data.comments || []);
    } catch (requestError) {
      setError(getCommentsError(requestError, "Unable to load comments."));
    } finally {
      setLoading(false);
    }
  }, [boardKey, enabled, isAuthenticated]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const addComment = useCallback(
    async (text) => {
      const trimmedText = text.trim();
      if (!trimmedText || !boardKey) return false;

      setSubmitting(true);
      setError("");
      try {
        const { data } = await apiClient.post("/boolforge-comments", {
          boardKey,
          text: trimmedText,
        });
        setComments((previous) => [...previous, data.comment]);
        return true;
      } catch (requestError) {
        setError(getCommentsError(requestError, "Unable to post comment."));
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [boardKey],
  );

  const updateComment = useCallback(async (id, text) => {
    const trimmedText = text.trim();
    if (!trimmedText) return false;

    setError("");
    try {
      const { data } = await apiClient.patch(`/boolforge-comments/${id}`, {
        text: trimmedText,
      });
      setComments((previous) => previous.map((comment) => (comment.id === id ? data.comment : comment)));
      return true;
    } catch (requestError) {
      setError(getCommentsError(requestError, "Unable to update comment."));
      return false;
    }
  }, []);

  const deleteComment = useCallback(async (id) => {
    setError("");
    try {
      await apiClient.delete(`/boolforge-comments/${id}`);
      setComments((previous) => previous.filter((comment) => comment.id !== id));
      return true;
    } catch (requestError) {
      setError(getCommentsError(requestError, "Unable to delete comment."));
      return false;
    }
  }, []);

  return {
    comments,
    loading,
    submitting,
    error,
    addComment,
    updateComment,
    deleteComment,
    reload: loadComments,
  };
}
