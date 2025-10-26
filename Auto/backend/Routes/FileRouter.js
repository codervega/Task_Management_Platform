const express = require("express");
const routerfile= express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Authentication = require("../middleware/Authentication");
const TaskFile = require("../models/File");

// ---------------- Multer storage configuration ----------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ---------------- Upload files ----------------
routerfile.post("/upload", Authentication, upload.array("files"), async (req, res) => {
  try {
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).json({ error: "taskId is required" });
    }

    // Save files in DB
    const files = req.files.map(file => ({
      task: taskId,
      user: req.user._id,
      filename: file.originalname,
      filePath: file.path,
      fileType: file.mimetype,
      fileSize: file.size
    }));

    const savedFiles = await TaskFile.insertMany(files);
    res.status(201).json({ message: "Files uploaded successfully", savedFiles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- Get all files for a task ----------------
routerfile.get("/task-files/:taskId", Authentication, async (req, res) => {
  try {
    const { taskId } = req.params;
    const files = await TaskFile.find({ task: taskId, isDeleted: false })
      .populate("user", "username email"); // Show who uploaded the file
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- Download a file ----------------
routerfile.get("/download/:fileId", Authentication, async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await TaskFile.findById(fileId);
    if (!file || file.isDeleted) {
      return res.status(404).json({ error: "File not found" });
    }
    res.download(path.resolve(file.filePath), file.filename);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- Soft delete a file ----------------
routerfile.delete("/delete/:fileId", Authentication, async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await TaskFile.findOneAndUpdate(
      { _id: fileId, user: req.user._id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!file) {
      return res.status(404).json({ error: "File not found or already deleted" });
    }

    res.status(200).json({ message: "File soft deleted successfully", file });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = routerfile;
