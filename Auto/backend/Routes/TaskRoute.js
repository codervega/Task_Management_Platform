const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const validator = require("validator");
const User = require("../models/User");
const Authentication = require("../middleware/Authentication");
const { route } = require("./UserRout");


router.post("/newtask", Authentication, async (req, res) => {
  try {
    const { title, description, status, priority, tags, due_date, email } = req.body;

   
    if (!title) return res.status(400).json({ error: "Title is required" });
    if (!email) return res.status(400).json({ error: "Assigned user email is required" });

    
    if (due_date && !validator.isDate(due_date)) {
      return res.status(400).json({ error: "Invalid due_date" });
    }

    
    const assignedUser = await User.findOne({ email: email });
    if (!assignedUser) return res.status(404).json({ error: "Assigned user not found" });

    const task = new Task({
      title,
      description,
      status,
      priority,
      tags,
      due_date,
      assigned_to: assignedUser._id, 
      created_by: req.user._id        
    });

    await task.save();

    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// for the given need to understand this properly

router.get("/getalltask", Authentication, async (req, res) => {
  console.log(req.query);
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      search,
      sortBy = "due_date",
      order = "asc"
    } = req.query;

    
    let query = { isDeleted: false };

    
    if (status) query.status = status;
    if (priority) query.priority = priority;

   
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    
    const sortOptions = {};
    sortOptions[sortBy] = order === "desc" ? -1 : 1;

    
    const tasks = await Task.find(query)
      .populate("assigned_to", "username email")
      .populate("created_by", "username email")
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      tasks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


// ✅ Fetch a single task by logged-in user and status
router.get("/singletask", Authentication, async (req, res) => {
  try {
    const email = req.user.email; // ✅ from token

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const task = await Task.findOne({
      assigned_to: user._id,
      status: { $in: ["todo", "in-progress"] },
      isDeleted: false
    })
    .populate("assigned_to", "username email")
    .populate("created_by", "username email");

    if (!task) return res.status(404).json({ error: "No task available" });

    res.status(200).json(task);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


// ✅ Update a task
router.put("/update-task", Authentication, async (req, res) => {
  try {
    const email = req.user.email;
    const { title, newTitle, description, status } = req.body;

    const allowedStatus = ["todo", "in-progress", "completed", "archived"];
    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    let updateFields = {};
    if (newTitle) updateFields.title = newTitle;
    if (description) updateFields.description = description;
    if (status) updateFields.status = status;

    const updatedTask = await Task.findOneAndUpdate(
      { assigned_to: user._id, title, isDeleted: false },
      updateFields,
      { new: true }
    );

    if (!updatedTask)
      return res.status(404).json({ error: "Task not found" });

    res.status(200).json({
      message: "Task updated successfully",
      updatedTask
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ Soft delete a task
router.delete("/delete-task", Authentication, async (req, res) => {
  try {
    const email = req.user.email;
    const { title } = req.body;

    if (!title)
      return res.status(400).json({ error: "Title is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const deletedTask = await Task.findOneAndUpdate(
      { assigned_to: user._id, title, isDeleted: false },
      { isDeleted: true, status: "archived" },
      { new: true }
    );

    if (!deletedTask)
      return res.status(404).json({ error: "Task not found or already deleted" });

    res.status(200).json({ message: "Task deleted", deletedTask });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
