import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TaskCreation = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "low",
    tags: "",
    due_date: "",
    email: "", // assigned user email (manual input)
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first!");
      return navigate("/Login");
    }

    try {
      const response = await fetch("http://localhost:5000/api/newtask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map((tag) => tag.trim()), // convert to array
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Task Created Successfully!");
        navigate("/");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="task-container">
      <h2>Create New Task</h2>

      <form className="task-form" onSubmit={handleSubmit}>
        
        <label>Assigned User Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter user email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Task Title</label>
        <input
          type="text"
          name="title"
          placeholder="Enter task title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          placeholder="Enter task description"
          value={formData.description}
          onChange={handleChange}
        />

        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="pending">todo</option>
          <option value="in-progress">in-progress</option>
          <option value="completed">Completed</option>
          <option value="completed">archived</option>
        </select>
    

        <label>Priority</label>
        <select name="priority" value={formData.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label>Tags (comma separated)</label>
        <input
          type="text"
          name="tags"
          placeholder="e.g., work, urgent"
          value={formData.tags}
          onChange={handleChange}
        />

        <label>Due Date</label>
        <input
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
        />

        <button type="submit" className="btn-submit">Create Task</button>
      </form>
    </div>
  );
};

export default TaskCreation;
