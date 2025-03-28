const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Đăng nhập
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "Email không tồn tại!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Mật khẩu sai!" });

        const token = jwt.sign({ id: user._id, role: user.role }, "secretkey", { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
});

module.exports = router;
