const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { register, login,getUserProfile ,validate} = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");






//Đăng kí
router.post("/register", register);

//Đăng nhập
router.post("/login", login);

// 🟢 Lấy thông tin người dùng hiện tại (yêu cầu xác thực)
router.get("/me", authMiddleware, getUserProfile);
//Xac thực token
router.get("/validate-token",validate)
module.exports = router;

