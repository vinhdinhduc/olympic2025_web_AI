const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true },
    points: { type: Number, default: 1 }
});

const exerciseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    type: { 
        type: String, 
        required: true,
        enum: ['multiple-choice', 'essay', 'practice']
    },
    topic: { type: String, required: true },
    tags: [String],
    
    // For multiple-choice exercises
    questions: [questionSchema],
    totalPoints: Number,
    
    // For essay exercises
    guidelines: String,
    wordLimit: Number,
    
    // For practice exercises
    resourcesUrl: String,
    submissionType: { type: String, enum: ['file', 'url'] },
    
    deadline: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exercise', exerciseSchema);