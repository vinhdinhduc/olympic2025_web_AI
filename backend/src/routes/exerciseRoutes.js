const express = require("express");
const router = express.Router();
const { authMiddleware, teacherMiddleware } = require("../middlewares/authMiddleware");
const {
    createExercise,
    getSuggestedExercises,
    getExerciseById,
    updateExercise,
    deleteExercise,
    submitExercise,
    getAIBasedSuggestions
} = require("../controllers/exerciseController");

// 🟢 Tạo bài tập mới (Chỉ giáo viên mới được tạo)
router.post("/", authMiddleware, teacherMiddleware, createExercise);
// 🟢 Gợi ý bài tập bằng AI
router.get("/ai-suggestions", authMiddleware, getAIBasedSuggestions);
// 🟢 Lấy danh sách bài tập gợi ý
router.get("/suggested", authMiddleware, getSuggestedExercises);

// 🟢 Lấy bài tập theo ID
router.get("/:id", authMiddleware, getExerciseById);

// 🟢 Cập nhật bài tập
router.put("/:id", authMiddleware, teacherMiddleware, updateExercise);

// 🟢 Xóa bài tập
router.delete("/:id", authMiddleware, teacherMiddleware, deleteExercise);

// 🟢 Nộp bài tập
router.post("/submit/:exerciseId", authMiddleware, submitExercise);

module.exports = router;