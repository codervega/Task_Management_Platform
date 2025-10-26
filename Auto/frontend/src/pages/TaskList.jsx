import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "../style/main.css";

const TaskList = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Pagination and filter states
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    priority: "",
    search: "",
    sortBy: "due_date",
    order: "asc"
  });
  
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10
  });

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`http://localhost:5000/api/getalltask?${queryParams}`, {
        method: "GET",
        credentials: 'include', // Important for cookies
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please login again");
        }
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data.tasks);
      setPagination({
        total: data.total,
        page: data.page,
        limit: data.limit
      });
    } catch (err) {
      setError(err.message);
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks when component mounts or filters change
  useEffect(() => {
    if (state.user) {
      fetchTasks();
    }
  }, [filters, state.user]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Handle task click (for viewing details)
  const handleTaskClick = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  // Handle show comments button click
  const handleShowComments = (taskId, e) => {
    e.stopPropagation(); // Prevent triggering the task card click
    navigate(`/task/${taskId}/comments`);
  };

  // Handle clear all filters
  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      status: "",
      priority: "",
      search: "",
      sortBy: "due_date",
      order: "asc"
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if due date is today
    if (date.toDateString() === now.toDateString()) {
      return "Today";
    }
    // Check if due date is tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }
    // Check if due date is overdue
    if (date < now && date.toDateString() !== now.toDateString()) {
      return `Overdue: ${date.toLocaleDateString()}`;
    }
    
    return date.toLocaleDateString();
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-in-progress';
      case 'pending': return 'status-pending';
      default: return 'status-pending';
    }
  };

  // Get priority badge class
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-low';
    }
  };

  // Check if any filters are active
  const areFiltersActive = () => {
    return filters.status || filters.priority || filters.search;
  };

  if (!state.user) {
    return (
      <div className="container">
        <div className="alert alert-warning">
          Please login to view your tasks.
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="task-header">
        <div className="header-content">
          <h1>My Tasks</h1>
          <span className="task-count">
            {pagination.total} task{pagination.total !== 1 ? 's' : ''} total
          </span>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate("/taskcreation")}
        >
          Create New Task
        </button>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-header">
          <h3>Filters & Sorting</h3>
          {areFiltersActive() && (
            <button 
              className="btn btn-link btn-clear-filters"
              onClick={handleClearFilters}
            >
              Clear All Filters
            </button>
          )}
        </div>
        
        <div className="filter-row">
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search tasks by title or description..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            >
              <option value="due_date">Due Date</option>
              <option value="createdAt">Created Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
              <option value="status">Status</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Order</label>
            <select
              value={filters.order}
              onChange={(e) => handleFilterChange("order", e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {areFiltersActive() && (
          <div className="active-filters">
            <span>Active filters: </span>
            {filters.search && (
              <span className="filter-tag">
                Search: "{filters.search}"
                <button onClick={() => handleFilterChange("search", "")}>×</button>
              </span>
            )}
            {filters.status && (
              <span className="filter-tag">
                Status: {filters.status}
                <button onClick={() => handleFilterChange("status", "")}>×</button>
              </span>
            )}
            {filters.priority && (
              <span className="filter-tag">
                Priority: {filters.priority}
                <button onClick={() => handleFilterChange("priority", "")}>×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          {error}
          <button className="btn-retry" onClick={fetchTasks}>
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading tasks...
        </div>
      )}

      {/* Tasks List */}
      {!loading && tasks.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No tasks found</h3>
          <p>
            {areFiltersActive() 
              ? "Try adjusting your filters or search terms."
              : "Create your first task to get started!"
            }
          </p>
          {areFiltersActive() && (
            <button className="btn btn-primary" onClick={handleClearFilters}>
              Clear Filters
            </button>
          )}
          {!areFiltersActive() && (
            <button 
              className="btn btn-primary" 
              onClick={() => navigate("/taskcreation")}
            >
              Create Your First Task
            </button>
          )}
        </div>
      )}

      {!loading && tasks.length > 0 && (
        <>
          <div className="tasks-grid">
            {tasks.map((task) => (
              <div 
                key={task._id} 
                className={`task-card ${task.due_date && new Date(task.due_date) < new Date() ? 'overdue' : ''}`}
                onClick={() => handleTaskClick(task._id)}
              >
                <div className="task-card-header">
                  <h3 className="task-title">{task.title}</h3>
                  <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                
                <p className="task-description">
                  {task.description && task.description.length > 100 
                    ? `${task.description.substring(0, 100)}...` 
                    : task.description
                  }
                </p>
                
                <div className="task-meta">
                  <div className="task-status">
                    <span className={`status-badge ${getStatusClass(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  
                  {task.due_date && (
                    <div className={`due-date ${new Date(task.due_date) < new Date() ? 'overdue' : ''}`}>
                      <span className="due-label">Due:</span> 
                      {formatDate(task.due_date)}
                    </div>
                  )}
                  
                  {task.assigned_to && (
                    <div className="assigned-to">
                      <span className="assigned-label">Assigned to:</span> 
                      {task.assigned_to.username || task.assigned_to.email}
                    </div>
                  )}

                  {task.createdAt && (
                    <div className="created-date">
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Comments Section */}
                <div className="task-actions">
                  <button 
                    className={`btn btn-comments ${task.comments && task.comments.length > 0 ? 'has-comments' : ''}`}
                    onClick={(e) => handleShowComments(task._id, e)}
                  >
                    {task.comments && task.comments.length > 0 ? 
                      `Show Comments (${task.comments.length})` : 
                      'Show Comments'
                    }
                  </button>
                  
                  {/* Quick action buttons */}
                  <div className="quick-actions">
                    <button 
                      className="btn-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add quick edit functionality here
                        navigate(`/task/${task._id}/edit`);
                      }}
                      title="Edit Task"
                    >
                      ✏️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              disabled={filters.page <= 1}
              onClick={() => handlePageChange(filters.page - 1)}
              className="btn btn-outline"
            >
              ← Previous
            </button>
            
            <div className="page-info">
              <span>
                Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
              </span>
              <span className="pagination-stats">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} tasks
              </span>
            </div>
            
            <button
              disabled={filters.page >= Math.ceil(pagination.total / pagination.limit)}
              onClick={() => handlePageChange(filters.page + 1)}
              className="btn btn-outline"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskList;