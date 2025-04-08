const User = require("../models/User");



// // routes/users.js
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const Exercise = require('../models/Exercise');
// const auth = require('../middleware/auth');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Cấu hình lưu trữ file avatar
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = 'uploads/avatars';
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({ 
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Chỉ chấp nhận file ảnh!'), false);
//     }
//   }
// });

// // Lấy thông tin profile
// router.get('/:userId', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId)
//       .select('-password -__v')
//       .populate({
//         path: 'createdExercises',
//         select: 'title description type',
//         options: { limit: 5, sort: { createdAt: -1 } }
//       })
//       .populate({
//         path: 'completedExercisesList.exercise',
//         select: 'title description',
//         options: { limit: 5, sort: { completedAt: -1 } }
//       });

//     if (!user) {
//       return res.status(404).json({ message: 'Người dùng không tồn tại' });
//     }

//     // Thêm số lượng bài tập đã tạo
//     const exerciseCount = await Exercise.countDocuments({ createdBy: user._id });
//     user.exerciseCount = exerciseCount;

//     res.json(user);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Lỗi server' });
//   }
// });

// // Cập nhật profile
// router.put('/:userId', auth, upload.single('avatar'), async (req, res) => {
//   try {
//     if (req.user.id !== req.params.userId) {
//       return res.status(403).json({ message: 'Không có quyền chỉnh sửa' });
//     }

//     const { name, email, bio } = req.body;
//     const updateData = { name, email, bio };

//     if (req.file) {
//       // Xóa avatar cũ nếu có
//       if (req.user.avatar && !req.user.avatar.startsWith('http')) {
//         const oldAvatarPath = path.join(__dirname, '../', req.user.avatar);
//         if (fs.existsSync(oldAvatarPath)) {
//           fs.unlinkSync(oldAvatarPath);
//         }
//       }
//       updateData.avatar = 'uploads/avatars/' + req.file.filename;
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.userId,
//       updateData,
//       { new: true }
//     ).select('-password -__v');

//     res.json(updatedUser);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Lỗi server' });
//   }
// });

// module.exports = router;
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
const getAdminDashboard = (req,res) => {
    res.json({
        message: "Welcome to admin dashboard!",
        adminInfo:{
            username: req.user.username,
            email: req.user.email,
            role: req.user.role
        }
    })
}

module.exports = { getUserProfile, updateUserProfile,getAdminDashboard };