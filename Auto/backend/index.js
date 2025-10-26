const express = require("express");
const ConnectDB = require("./configure/database.js");
const cookieParser = require("cookie-parser");
const authRoutes = require("./Routes/UserRout.js");
const router = require("./Routes/TaskRoute.js");
const routerComment = require("./Routes/CommentRoute.js");
const routerFile = require("./Routes/FileRouter.js");
const routerAnalytics = require("./Routes/Analytics.js");
const cors = require("cors");

const app = express();

// CORS setup to allow cookies - MOVE THIS UP
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Add explicit headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Debug middleware to check cookies
app.use((req, res, next) => {
  console.log('=== REQUEST DEBUG ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Cookies:', req.cookies);
  console.log('Headers:', req.headers);
  next();
});

ConnectDB();

// Routes
app.use("/api", authRoutes);
app.use("/api", router);
app.use("/api", routerComment);
app.use("/api", routerFile);
app.use("/api", routerAnalytics);

app.listen(5000, () => {
  console.log("Server started at 5000");
});