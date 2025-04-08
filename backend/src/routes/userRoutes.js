const express = require("express");
 
const User = require("../models/User");   
const router = express.Router();
const { getUserProfile, updateUserProfile,getAdminDashboard } = require("../controllers/userController");
const { authMiddleware ,isAdmin} = require("../middlewares/authMiddleware");


// API lấy thông tin người dùng
router.get("/me", authMiddleware, getUserProfile);
router.get("/:userId", authMiddleware, getUserProfile);

// API lấy thông tin người dùng hiện tại
// API cập nhật thông tin người dùng
router.put("/:userId", authMiddleware, updateUserProfile);


// API lấy danh sách người dùng (chỉ dành cho admin)
router.get("/admin-dashboard",isAdmin,getAdminDashboard);


module.exports = router;
