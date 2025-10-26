// const jwt = require("jsonwebtoken")
// const User = require("../models/User")

// const Authentication = async (req, res, next) => {
//   try {
//     const token = req.cookies.jwt;
//     if (!token) {
//       return res.status(401).json({ error: "No token provided" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "Abhi@8970");
//     console.log(decoded);
//     const user = await User.findOne({ email: decoded.email });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: "Invalid token" });
//     console.log(error);
//   }
// };

// module.exports = Authentication;


const jwt = require("jsonwebtoken")
const User = require("../models/User")

const Authentication = async (req, res, next) => {
  try {
    console.log("=== AUTH MIDDLEWARE DEBUG ===");
    console.log("All cookies received:", req.cookies);
    console.log("Headers:", req.headers);
    
    // Check multiple possible locations for the token
    const token = req.cookies.token || 
                  req.cookies.jwt || 
                  req.headers.authorization?.replace('Bearer ', '') ||
                  req.body.token;
    
    console.log("Extracted token:", token ? "Token exists" : "No token");
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "Abhi@8970");
    console.log("Decoded token:", decoded);
    
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Token verification error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = Authentication;