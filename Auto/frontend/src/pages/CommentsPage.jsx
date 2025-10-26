import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../style/comments.css";

const CommentsPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { state } = useAuth();
  
  const [comments, setComments] = useState([]);
  const [task, setTask] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  // Fetch task details and comments
  const fetchTaskAndComments = async () => {
    try {
      setLoading(true);
      setError("");

      // First, let's try to get the task title from the task list or fetch task details
      // Since we don't have a direct API to get task by ID, let's modify our approach
      
      // Option 1: Fetch all tasks and find the one with matching ID
      const tasksResponse = await fetch(`http://localhost:5000/api/getalltask?limit=1000`, {
        method: "GET",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!tasksResponse.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const tasksData = await tasksResponse.json();
      const currentTask = tasksData.tasks.find(t => t._id === taskId);

      if (!currentTask) {
        throw new Error("Task not found");
      }

      setTask(currentTask);

      // Now fetch comments using the task title
      const commentsResponse = await fetch(
        `http://localhost:5000/api/get-all-comments?taskTitle=${encodeURIComponent(currentTask.title)}`,
        {
          method: "GET",
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!commentsResponse.ok) {
        // If comments fail to load, still show the page but with empty comments
        console.error("Failed to fetch comments");
        setComments([]);
      } else {
        const commentsData = await commentsResponse.json();
        setComments(commentsData.comments || []);
      }

    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    if (!task) {
      setError("Task information is not available");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/add-comment", {
        method: "POST",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          taskTitle: task.title
        })
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const data = await response.json();
      
      // Add the new comment to the list with user info
      const newCommentWithUser = {
        ...data.comment,
        user: {
          _id: state.user._id,
          username: state.user.username || state.user.email
        }
      };
      
      setComments(prev => [newCommentWithUser, ...prev]);
      setNewComment("");
      
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Start editing a comment
  const startEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
  };

  // Update a comment
  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/update-comment", {
        method: "PUT",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId: commentId,
          content: editContent
        })
      });

      if (!response.ok) {
        throw new Error("Failed to update comment");
      }

      const data = await response.json();
      
      // Update the comment in the list
      setComments(prev => 
        prev.map(comment => 
          comment._id === commentId ? { ...comment, ...data.comment } : comment
        )
      );
      
      setEditingCommentId(null);
      setEditContent("");
      
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      setError("");

      const response = await fetch("http://localhost:5000/api/delete-comment", {
        method: "DELETE",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId: commentId
        })
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      // Remove the comment from the list
      setComments(prev => prev.filter(comment => comment._id !== commentId));
      
    } catch (err) {
      setError(err.message);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  useEffect(() => {
    if (state.user && taskId) {
      fetchTaskAndComments();
    }
  }, [taskId, state.user]);

  if (!state.user) {
    return (
      <div className="container">
        <div className="alert alert-warning">
          Please login to view comments.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading comments...
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="comments-header">
        <button 
          className="btn btn-back"
          onClick={() => navigate(-1)}
        >
          ← Back to Tasks
        </button>
        <h1>Comments</h1>
        {task ? (
          <div className="task-info">
            <h2>{task.title}</h2>
            <p className="task-description">{task.description}</p>
            <div className="task-meta-small">
              <span className={`status-badge status-${task.status}`}>
                {task.status}
              </span>
              <span className={`priority-badge priority-${task.priority}`}>
                {task.priority}
              </span>
              {task.due_date && (
                <span className="due-date">
                  Due: {new Date(task.due_date).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="alert alert-warning">
            Task information not available
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          {error}
          <button className="btn-retry" onClick={fetchTaskAndComments}>
            Try Again
          </button>
        </div>
      )}

      {/* Add Comment Form - Only show if task is available */}
      {task && (
        <div className="add-comment-section">
          <h3>Add a Comment</h3>
          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment here..."
              rows="4"
              disabled={submitting}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting || !newComment.trim()}
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        </div>
      )}

      {/* Comments List */}
      <div className="comments-section">
        <h3>
          {comments.length === 0 ? "No Comments Yet" : `Comments (${comments.length})`}
        </h3>
        
        {comments.length === 0 ? (
          <div className="empty-comments">
            <p>{task ? "Be the first to comment on this task!" : "No comments available"}</p>
          </div>
        ) : (
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment._id} className="comment-card">
                <div className="comment-header">
                  <div className="comment-user">
                    <strong>{comment.user?.username || comment.user?.email || "Unknown User"}</strong>
                    <span className="comment-date">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  
                  {/* Edit/Delete buttons - only show for current user's comments */}
                  {comment.user?._id === state.user._id && (
                    <div className="comment-actions">
                      {editingCommentId === comment._id ? (
                        <>
                          <button
                            onClick={() => handleUpdateComment(comment._id)}
                            className="btn btn-success btn-sm"
                            disabled={submitting}
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="btn btn-outline btn-sm"
                            disabled={submitting}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditComment(comment)}
                            className="btn btn-outline btn-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="btn btn-danger btn-sm"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="comment-content">
                  {editingCommentId === comment._id ? (
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows="3"
                      className="edit-textarea"
                    />
                  ) : (
                    <p>{comment.content}</p>
                  )}
                </div>

                {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                  <div className="comment-edited">
                    <em>Edited {formatDate(comment.updatedAt)}</em>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsPage;