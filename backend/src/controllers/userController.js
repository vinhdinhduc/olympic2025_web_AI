const User = require("../models/User");

// Lấy thông tin người dùng
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại!" });
        }
        res.json(user);
    } catch (err) {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
        res.status(500).json({ message: "Lỗi server!" });
    }
};

// Cập nhật thông tin người dùng
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại!" });
        }

        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (err) {
        console.error("Lỗi khi cập nhật thông tin người dùng:", err);
        res.status(500).json({ message: "Lỗi server!" });
    }
};

module.exports = { getUserProfile, updateUserProfile };