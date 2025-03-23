const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "teacher"], default: "student" }
}, { timestamps: true });

// ✅ Kiểm tra model trước khi khởi tạo để tránh lỗi OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;
