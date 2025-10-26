const express = require("express");
const routerCommnet = express.Router();
const Task = require("../models/Task");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Authentication = require("../middleware/Authentication");

// Add a comment to a task
routerCommnet.post("/add-comment", Authentication, async (req, res) => {
  try {
    const { content, taskTitle } = req.body;
    console.log(content,taskTitle);
    if (!content || !taskTitle) {
      return res.status(400).json({ error: "Task title and content are required" });
    }

   
    const user = req.user;


    const task = await Task.findOne({ title: taskTitle, isDeleted: false });
    if (!task) {
      return res.status(404).json({ error: "Task not found or deleted" });
    }

    

    // Create new comment
    const comment = new Comment({
      task: task._id,
      user: user._id,
      content: content
    });

    await comment.save();

    res.status(201).json({
      message: "Comment added successfully",
      comment
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get all comments for a specific task

// http://localhost:5000/api/get-all-comments?taskTitle=Complet
routerCommnet.get("/get-all-comments", Authentication, async (req, res) => {
  try {
    const { taskTitle } = req.query; // use query param instead of body

    if (!taskTitle) {
      return res.status(400).json({ error: "Task title is required" });
    }

    // Find the task first
    const task = await Task.findOne({ title: taskTitle, isDeleted: false });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Find all comments linked to this task
    const comments = await Comment.find({ task: task._id, isDeleted: false })
      .populate("user", "username email")  // show user info
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json({ comments });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// update the comment
routerCommnet.put("/update-comment", Authentication, async (req, res) => {
  const { commentId, content } = req.body;
  const user = req.user;

  const comment = await Comment.findOne({ _id: commentId, user: user._id, isDeleted: false });
  if (!comment) return res.status(404).json({ error: "Comment not found or not yours" });

  comment.content = content;
  await comment.save();

  res.status(200).json({ message: "Comment updated", comment });
});



// Soft delete a comment
routerCommnet.delete("/delete-comment", Authentication, async (req, res) => {
  try {
    const { commentId } = req.body;

    if (!commentId) {
      return res.status(400).json({ error: "Comment ID is required" });
    }

    const user = req.user;

    // Find and soft delete the comment
    const deletedComment = await Comment.findOneAndUpdate(
      { _id: commentId, user: user._id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!deletedComment) {
      return res.status(404).json({ error: "Comment not found or already deleted" });
    }

    res.status(200).json({
      message: "Comment deleted successfully",
      deletedComment
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});



module.exports = routerCommnet;
