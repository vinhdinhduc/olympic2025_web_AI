const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/User");   // Đúng


const router = express.Router();

// router.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });

//         if (!user) return res.status(400).json({ message: "Email không tồn tại!" });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ message: "Mật khẩu sai!" });

//         const token = jwt.sign({ id: user._id, role: user.role }, "secretkey", { expiresIn: "1h" });
//         res.json({ token });
//     } catch (error) {
//         res.status(500).json({ message: "Lỗi server!" });
//     }
// });

// API lấy thông tin người dùng
router.get("/user", async (req, res) => {
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
