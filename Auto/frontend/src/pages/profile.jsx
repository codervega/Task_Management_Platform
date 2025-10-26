import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import "../style/profile.css"
// import "./Profile.css"; // We'll create this CSS file

const Profile = () => {
  const { state } = useAuth();
  const { user } = state;

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showTaskOptions, setShowTaskOptions] = useState(false);
  const [taskInfo, setTaskInfo] = useState(null);
  const [updateFields, setUpdateFields] = useState({
    title: "",
    newTitle: "",
    description: "",
    status: "",
  });
  const [actionLoading, setActionLoading] = useState({
    getTask: false,
    update: false,
    delete: false
  });

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem("email") || user?.email;

        if (!email) {
          setError("No email found");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `http://localhost:5000/api/profile?email=${encodeURIComponent(email)}`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setProfileData(data);
        } else {
          const err = await res.json();
          setError(err.error || "Failed to fetch profile");
        }
      } catch (err) {
        console.error(err);
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Fetch single task
  const fetchUserTask = async () => {
    setActionLoading(prev => ({ ...prev, getTask: true }));
    try {
      const res = await fetch("http://localhost:5000/api/singletask", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        setTaskInfo(null);
      } else {
        setTaskInfo(data.task || data);
      }
    } catch (err) {
      console.log(err);
      alert("Failed to fetch task");
    } finally {
      setActionLoading(prev => ({ ...prev, getTask: false }));
    }
  };

  // Update task
  const updateTask = async () => {
    if (!updateFields.title) {
      alert("Please enter the task title to update");
      return;
    }

    setActionLoading(prev => ({ ...prev, update: true }));
    try {
      const res = await fetch("http://localhost:5000/api/update-task", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateFields),
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        alert(data.message);
        setUpdateFields({ title: "", newTitle: "", description: "", status: "" });
        fetchUserTask();
      }
    } catch (err) {
      console.log(err);
      alert("Failed to update task");
    } finally {
      setActionLoading(prev => ({ ...prev, update: false }));
    }
  };

  // Delete task
  const deleteTask = async () => {
    if (!updateFields.title) {
      alert("Please enter the task title to delete");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
      return;
    }

    setActionLoading(prev => ({ ...prev, delete: true }));
    try {
      const res = await fetch("http://localhost:5000/api/delete-task", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: updateFields.title }),
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        alert(data.message);
        setTaskInfo(null);
        setUpdateFields({ title: "", newTitle: "", description: "", status: "" });
      }
    } catch (err) {
      console.log(err);
      alert("Failed to delete task");
    } finally {
      setActionLoading(prev => ({ ...prev, delete: false }));
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Profile</h3>
        <p>{error}</p>
        <button className="btn-retry" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-error">
        <div className="error-icon">📭</div>
        <h3>No Profile Data</h3>
        <p>Unable to load profile information</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
        <p>Manage your account and tasks</p>
      </div>

      <div className="profile-content">
        {/* Profile Information Card */}
        <div className="profile-card">
          <div className="card-header">
            <div className="user-avatar">
              {profileData.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <h2>{profileData.username}</h2>
              <p className="user-email">{profileData.email}</p>
            </div>
          </div>
          
          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-label">Role</span>
              <span className="detail-value role-badge">{profileData.role}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Member Since</span>
              <span className="detail-value">Recently</span>
            </div>
          </div>
        </div>

        {/* Task Management Section */}
        <div className="task-management-section">
          <div className="section-header">
            <h3>Task Management</h3>
            <p>View and manage your assigned tasks</p>
          </div>

          <button
            className={`toggle-task-btn ${showTaskOptions ? 'active' : ''}`}
            onClick={() => setShowTaskOptions((prev) => !prev)}
          >
            <span>{showTaskOptions ? "▲" : "▼"}</span>
            {showTaskOptions ? "Hide Task Options" : "Manage My Tasks"}
          </button>

          {showTaskOptions && (
            <div className="task-options-panel">
              {/* Get Task Button */}
              <div className="action-section">
                <button 
                  className="btn-get-task"
                  onClick={fetchUserTask}
                  disabled={actionLoading.getTask}
                >
                  {actionLoading.getTask ? (
                    <>
                      <div className="btn-spinner"></div>
                      Loading Task...
                    </>
                  ) : (
                    <>
                      📋 Get My Current Task
                    </>
                  )}
                </button>
              </div>

              {/* Task Display */}
              {taskInfo && (
                <div className="task-display-card">
                  <div className="task-header">
                    <h4>Current Task</h4>
                    <span className={`task-status status-${taskInfo.status}`}>
                      {taskInfo.status}
                    </span>
                  </div>
                  <div className="task-content">
                    <h5 className="task-title">{taskInfo.title}</h5>
                    <p className="task-description">{taskInfo.description}</p>
                    <div className="task-meta">
                      {taskInfo.priority && (
                        <span className={`priority-badge priority-${taskInfo.priority}`}>
                          {taskInfo.priority} priority
                        </span>
                      )}
                      {taskInfo.dueDate && (
                        <span className="due-date">
                          📅 {new Date(taskInfo.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Update Task Form */}
              <div className="task-form">
                <h4>Update or Delete Task</h4>
                <p className="form-description">Enter the current task title and the fields you want to update</p>
                
                <div className="form-grid">
                  <div className="input-group">
                    <label>Current Title *</label>
                    <input
                      type="text"
                      placeholder="Enter current task title"
                      value={updateFields.title}
                      onChange={(e) =>
                        setUpdateFields({ ...updateFields, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="input-group">
                    <label>New Title</label>
                    <input
                      type="text"
                      placeholder="Enter new title (optional)"
                      value={updateFields.newTitle}
                      onChange={(e) =>
                        setUpdateFields({ ...updateFields, newTitle: e.target.value })
                      }
                    />
                  </div>

                  <div className="input-group">
                    <label>Description</label>
                    <textarea
                      placeholder="Enter new description (optional)"
                      value={updateFields.description}
                      onChange={(e) =>
                        setUpdateFields({
                          ...updateFields,
                          description: e.target.value,
                        })
                      }
                      rows="3"
                    />
                  </div>

                  <div className="input-group">
                    <label>Status</label>
                    <select
                      value={updateFields.status}
                      onChange={(e) =>
                        setUpdateFields({ ...updateFields, status: e.target.value })
                      }
                    >
                      <option value="">Select new status (optional)</option>
                      <option value="todo">📝 Todo</option>
                      <option value="in-progress">🔄 In Progress</option>
                      <option value="completed">✅ Completed</option>
                      <option value="archived">📁 Archived</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    className="btn-update"
                    onClick={updateTask}
                    disabled={actionLoading.update || !updateFields.title}
                  >
                    {actionLoading.update ? (
                      <>
                        <div className="btn-spinner"></div>
                        Updating...
                      </>
                    ) : (
                      "🔄 Update Task"
                    )}
                  </button>
                  
                  <button
                    className="btn-delete"
                    onClick={deleteTask}
                    disabled={actionLoading.delete || !updateFields.title}
                  >
                    {actionLoading.delete ? (
                      <>
                        <div className="btn-spinner"></div>
                        Deleting...
                      </>
                    ) : (
                      "🗑️ Delete Task"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;