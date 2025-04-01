const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true }
});

const exerciseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, required: true, enum: ["multiple-choice", "essay"] },
    questions: { type: [questionSchema], required: true },
    tags: [String],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    topic: { type: String, required: true }, 
}, { timestamps: true });

module.exports = mongoose.model("Exercise", exerciseSchema);
