const express = require("express");
const Exercise = require("../models/Exercise");
const router = express.Router();
const { authMiddleware, teacherMiddleware } = require("../middlewares/authMiddleware");



const checkTeacher = (req, res, next) => {
   if (req.user.role !== "teacher") {
       return res.status(403).json({ message: "Bạn không có quyền tạo bài tập!" });
   }
   next();
};

// 🟢 Thêm bài tập mới (Chỉ giáo viên mới được tạo)
// API: Tạo bài tập mới
router.post("/", authMiddleware, teacherMiddleware, async (req, res) => {
    try {
        const { title, description, type, questions } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!title || !type) {
            return res.status(400).json({ message: "Tiêu đề và loại bài tập là bắt buộc!" });
        }

        // Tạo bài tập mới
        const exercise = new Exercise({
            title,
            description,
            type,
            questions,
            createdBy: req.user._id, // Lấy ID người dùng từ middleware
        });

        await exercise.save();
        res.status(201).json({ message: "Tạo bài tập thành công!", exercise });
    } catch (err) {
        console.error("Lỗi khi tạo bài tập:", err);
        res.status(500).json({ message: "Lỗi server!" });
    }
});
router.post("/submit/:exerciseId", authMiddleware, async (req, res) => {
   try {
       if (req.user.role !== "student") {
           return res.status(403).json({ message: "Chỉ học sinh mới có thể nộp bài!" });
       }

       const { answers } = req.body;
       const exercise = await Exercise.findById(req.params.exerciseId);
       
       if (!exercise) return res.status(404).json({ message: "Bài tập không tồn tại" });

       const submission = {
           studentId: req.user.id,
           exerciseId: exercise._id,
           answers,
           submittedAt: new Date(),
       };

       res.status(200).json({ message: "Bài làm đã được nộp!", submission });
   } catch (error) {
       res.status(500).json({ message: "Lỗi server", error });
   }
});
// 🟢 Lấy danh sách bài tập
// API: Lấy danh sách bài tập gợi ý
router.get("/suggested", async (req, res) => {
    try {
        const userId = req.user.id; // Lấy ID người dùng từ token (middleware xác thực)
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại." });
        }

        // Lấy danh sách bài tập
        const exercises = await Exercise.find();

        // Gợi ý bài tập dựa trên tags
        const userTags = user.interests || []; // Giả sử `interests` là danh sách sở thích của người dùng
        const suggestedExercises = exercises.filter((exercise) =>
            exercise.tags.some((tag) => userTags.includes(tag))
        );

        res.json(suggestedExercises);
    } catch (err) {
        console.error("Lỗi khi lấy bài tập gợi ý:", err);
        res.status(500).json({ message: "Lỗi server." });
    }
});

// 🟢 Thêm bài tập mới


// 🟢 Lấy bài tập theo ID


// 🟢 Cập nhật bài tập
router.put("/:id", async (req, res) => {
   const updatedExercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true });
   res.json(updatedExercise);
});
router.get("/:id", async (req, res) => {
    const exercise = await Exercise.findById(req.params.id);
    res.json(exercise);
 });

// 🟢 Xóa bài tập
router.delete("/:id", async (req, res) => {
   await Exercise.findByIdAndDelete(req.params.id);
   res.json({ message: "Bài tập đã bị xóa" });
});

module.exports = router;
