const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ["todo", "in-progress", "completed", "archived"],
    default: "todo"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
    index: true
  },
  due_date: {
    type: Date,
    index: true
  },
  tags: [{
    type: String,
    index: true
  }],
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
