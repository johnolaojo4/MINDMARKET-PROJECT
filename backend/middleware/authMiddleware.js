const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        message: "No token provided, authorization denied" 
      });
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        message: "No token, authorization denied" 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database (optional - for additional security)
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(401).json({ 
        message: "User not found, authorization denied" 
      });
    }

    // Add user to request object
    req.user = {
      id: decoded.id,
      ...user.toObject()
    };
    
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ 
        message: "Token expired, please login again" 
      });
    }
    
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        message: "Invalid token" 
      });
    }
    
    res.status(500).json({ 
      message: "Server error in authentication" 
    });
  }
};

module.exports = auth;
