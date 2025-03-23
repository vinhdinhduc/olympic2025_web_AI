const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/User");   // Đúng


const router = express.Router();

// API lấy thông tin người dùng
router.get("/user", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
});

module.exports = router;
