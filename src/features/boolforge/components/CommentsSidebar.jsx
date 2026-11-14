import { useState } from "react";
import { Check, Edit3, MessageSquare, Send, Trash2, X } from "lucide-react";

function formatCommentTime(timestamp) {
  if (!timestamp) return "Just now";
  return new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function CommentsSidebar({
  open,
  onClose,
  comments,
  loading,
  submitting,
  error,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}) {
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  if (!open) return null;

  const submitComment = async (event) => {
    event.preventDefault();
    const posted = await onAddComment(draft);
    if (posted) setDraft("");
  };

  const saveEdit = async (id) => {
    const updated = await onUpdateComment(id, editingText);
    if (updated) {
      setEditingId(null);
      setEditingText("");
    }
  };

  return (
    <aside className="comments-sidebar" aria-label="Board comments">
      <div className="comments-sidebar-header">
        <div>
          <div className="comments-sidebar-title">
            <MessageSquare size={17} />
            <h2>Comments</h2>
            <span className="comments-sidebar-count">{comments.length}</span>
          </div>
          <p>Discussion for this board</p>
        </div>
        <button type="button" className="comments-sidebar-close" onClick={onClose} aria-label="Close comments">
          <X size={18} />
        </button>
      </div>

      <div className="comments-sidebar-list">
        {loading && <div className="comments-sidebar-state">Loading comments...</div>}
        {!loading && comments.length === 0 && (
          <div className="comments-sidebar-empty">
            <MessageSquare size={24} />
            <p>No comments yet.</p>
            <span>Start the discussion for this board.</span>
          </div>
        )}
        {!loading && comments.map((comment) => (
          <article className="board-comment" key={comment.id}>
            <div className="board-comment-avatar">
              {comment.author?.avatarUrl ? (
                <img src={comment.author.avatarUrl} alt="" />
              ) : (
                (comment.author?.name || "S").charAt(0).toUpperCase()
              )}
            </div>
            <div className="board-comment-body">
              <div className="board-comment-meta">
                <strong>{comment.author?.name || "Student"}</strong>
                <time dateTime={comment.createdAt}>{formatCommentTime(comment.createdAt)}</time>
              </div>
              {editingId === comment.id ? (
                <textarea
                  className="board-comment-edit-input"
                  value={editingText}
                  onChange={(event) => setEditingText(event.target.value)}
                  autoFocus
                />
              ) : (
                <p>{comment.text}</p>
              )}
              {comment.isOwner && (
                <div className="board-comment-actions">
                  {editingId === comment.id ? (
                    <button type="button" onClick={() => saveEdit(comment.id)} disabled={!editingText.trim()}>
                      <Check size={13} /> Save
                    </button>
                  ) : (
                    <button type="button" onClick={() => { setEditingId(comment.id); setEditingText(comment.text); }}>
                      <Edit3 size={13} /> Edit
                    </button>
                  )}
                  <button type="button" className="danger" onClick={() => window.confirm("Delete this comment?") && onDeleteComment(comment.id)}>
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      <form className="comments-sidebar-composer" onSubmit={submitComment}>
        {error && <div className="comments-sidebar-error">{error}</div>}
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Write a comment..."
          maxLength={2000}
          disabled={submitting}
        />
        <div className="comments-sidebar-composer-footer">
          <span>{draft.length}/2000</span>
          <button type="submit" disabled={submitting || !draft.trim()}>
            <Send size={14} /> {submitting ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </aside>
  );
}
