const express = require("express");
const routeranaltics = express.Router();
const Task = require("../models/Task");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Authentication = require("../middleware/Authentication");
const { Parser } = require("json2csv"); // need to learn about it more

routeranaltics.get("/analytics/overview", Authentication, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId)
    const statusCounts = await Task.aggregate([
      { $match: { isDeleted: false, assigned_to: userId }},
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.json({ statusCounts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get performance metrics for the logged-in user
routeranaltics.get("/analytics/user-performance", Authentication, async (req, res) => {
  try {
    const userId = req.user._id; // Logged-in user

    console.log(userId)
    const totalTasks = await Task.countDocuments({ assigned_to: userId, isDeleted: false });

    
    const completedTasks = await Task.countDocuments({ assigned_to: userId, status: "completed", isDeleted: false });


    const overdueTasks = await Task.countDocuments({
      assigned_to: userId,
      status: { $ne: "completed" },
      due_date: { $lt: new Date() },
      isDeleted: false
    });

    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) + "%" : "0%";

    
    const completedTaskDocs = await Task.find({ assigned_to: userId, status: "completed", isDeleted: false });
    let avgCompletionTime = 0;
    if (completedTaskDocs.length > 0) {
      const totalTime = completedTaskDocs.reduce((acc, task) => {
        const start = task.createdAt;
        const end = task.updatedAt;
        return acc + (end - start);
      }, 0);
      avgCompletionTime = (totalTime / completedTaskDocs.length) / (1000 * 60 * 60 * 24); // days
      avgCompletionTime = avgCompletionTime.toFixed(2) + " days";
    }

    res.status(200).json({
      userId,
      totalTasks,
      completedTasks,
      overdueTasks,
      completionRate,
      avgCompletionTime
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

routeranaltics.get("/analytics/task-trends", Authentication, async (req, res) => {
  try {
    const userId = req.user._id; // get user from authentication

    const trends = await Task.aggregate([
      { 
        $match: { assigned_to: userId, isDeleted: false } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // group by date
          totalTasks: { $sum: 1 },
          completedTasks: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } }
        }
      },
      { 
        $sort: { "_id": 1 } 
      },
      {
        $project: {
          date: "$_id",
          totalTasks: 1,
          completedTasks: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json({ trends });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Export tasks as CSV
routeranaltics.get("/export-tasks", Authentication, async (req, res) => {
  try {
    const userId = req.user._id;

    const tasks = await Task.find({ assigned_to: userId, isDeleted: false })
      .populate("assigned_to", "username email")
      .populate("created_by", "username email")
      .lean(); // get plain JS objects

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found to export" });
    }

    // Define CSV fields
    const fields = ["title", "description", "status", "priority", "due_date", "tags", "assigned_to.email", "created_by.email"];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(tasks);

    // Set headers for download
    res.header("Content-Type", "text/csv");
    res.attachment("tasks.csv");
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

 module.exports =  routeranaltics;
