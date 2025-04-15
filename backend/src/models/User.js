const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "teacher","admin"], default: "student" },
    completedExercises: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }]
}, { timestamps: true });


const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;
