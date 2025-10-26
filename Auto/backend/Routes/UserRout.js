const express = require("express"); 
const router = express.Router();  // <-- Change here
const validate = require("../middleware/validate");
const Authentication = require("../middleware/Authentication")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");  // <-- You missed importing jwt
const User = require("../models/User"); 

// Signup route
router.post("/signup", validate, async (req, res) => {
  try {
    const { username, email, password,role, isDeleted } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
      isDeleted: isDeleted || false
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Signin route
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email, password);

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).send("No such email is registered");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET || "Abhi@8970",
      { expiresIn: "1h" }
    );

    res.cookie("jwt", token, { httpOnly: true, secure: false });
    return res.status(200).json({ email: user.email, token });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// view profile
router.get("/profile", async (req, res) => {
  const { email } = req.query; // Get email from query parameters
  
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      // Don't send password back to client
      const { password, ...userWithoutPassword } = user.toObject();
      return res.status(200).json(userWithoutPassword);
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router; 
