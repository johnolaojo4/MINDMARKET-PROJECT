const express = require("express");
const { signupUser, signinUser } = require("../controllers/authController");
const auth = require("../middleware/auth");
const User = require("../models/User");
const router = express.Router();

// Validation middleware
const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ 
      message: "Name, email, and password are required" 
    });
  }
  
  if (name.length < 2) {
    return res.status(400).json({ 
      message: "Name must be at least 2 characters long" 
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ 
      message: "Password must be at least 6 characters long" 
    });
  }
  
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      message: "Please enter a valid email address" 
    });
  }
  
  next();
};

const validateSignin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      message: "Email and password are required" 
    });
  }
  
  next();
};

// POST /api/auth/signup
router.post("/signup", validateSignup, signupUser);

// POST /api/auth/signin
router.post("/signin", validateSignin, signinUser);

// GET /api/auth/profile - Get current user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Profile fetch error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/auth/profile - Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, profilePicture } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (profilePicture) updateData.profilePicture = profilePicture;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");
    
    res.json({ 
      message: "Profile updated successfully",
      user 
    });
  } catch (error) {
    console.error("Profile update error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/verify-token - Verify JWT token
router.post("/verify-token", auth, (req, res) => {
  res.json({ 
    message: "Token is valid", 
    user: { 
      id: req.user.id,
      name: req.user.name,
      email: req.user.email 
    }
  });
});

// POST /api/auth/logout - Logout user (client-side token removal)
router.post("/logout", auth, async (req, res) => {
  try {
    // Update last login time
    await User.findByIdAndUpdate(req.user.id, { lastLogin: new Date() });
    
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
