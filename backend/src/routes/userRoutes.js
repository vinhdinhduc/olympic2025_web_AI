const express = require("express");
 
const User = require("../models/User");   
const router = express.Router();
const { getUserProfile, updateUserProfile } = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");


// API lấy thông tin người dùng
router.get("/profile", authMiddleware, getUserProfile);

// API cập nhật thông tin người dùng
router.put("/profile", authMiddleware, updateUserProfile);


 


module.exports = router;
