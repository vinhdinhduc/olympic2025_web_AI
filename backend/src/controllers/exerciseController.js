const Exercise = require("../models/Exercise");
const User = require("../models/User");
const { OpenAIApi, Configuration } = require("openai");
// const configuration = new Configuration({
    
//     apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

//  Tạo bài tập mới
const createExercise = async (req, res) => {
    try {
        const { title, description, type, topic, tags } = req.body;
        
        // Validate required fields
        if (!title || !type || !topic) {
            return res.status(400).json({ message: "Tiêu đề, loại bài tập và chủ đề là bắt buộc!" });
        }

        // Create base exercise object
        const exerciseData = {
            title,
            description,
            type,
            tags,
            topic,
            createdBy: req.user._id,
            createdAt: new Date()
        };

        // Add type-specific fields
        switch (type) {
            case 'multiple-choice':
                if (!req.body.questions || !Array.isArray(req.body.questions)) {
                    return res.status(400).json({ message: "Câu hỏi trắc nghiệm là bắt buộc!" });
                }
                exerciseData.questions = req.body.questions.map(q => ({
                    questionText: q.questionText,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    points: q.points || 1
                }));
                exerciseData.totalPoints = req.body.questions.reduce((sum, q) => sum + (q.points || 1), 0);
                break;

            case 'essay':
                if (!req.body.guidelines) {
                    return res.status(400).json({ message: "Hướng dẫn làm bài là bắt buộc cho bài tự luận!" });
                }
                exerciseData.guidelines = req.body.guidelines;
                exerciseData.wordLimit = req.body.wordLimit || 500;
                exerciseData.totalPoints = req.body.totalPoints || 10;
                break;

            case 'practice':
                if (!req.body.resourcesUrl) {
                    return res.status(400).json({ message: "URL tài nguyên thực hành là bắt buộc!" });
                }
                exerciseData.resourcesUrl = req.body.resourcesUrl;
                exerciseData.submissionType = req.body.submissionType || 'file'; // file or url
                exerciseData.totalPoints = req.body.totalPoints || 10;
                break;

            default:
                return res.status(400).json({ message: "Loại bài tập không hợp lệ!" });
        }

        // Add deadline if provided
        if (req.body.deadline) {
            exerciseData.deadline = new Date(req.body.deadline);
        }

        const exercise = new Exercise(exerciseData);
        await exercise.save();
        
        res.status(201).json({ 
            message: "Tạo bài tập thành công!", 
            exercise: {
                _id: exercise._id,
                title: exercise.title,
                type: exercise.type,
                topic: exercise.topic
            }
        });
    } catch (err) {
        console.error("Lỗi khi tạo bài tập:", err);
        res.status(500).json({ message: "Lỗi server!" });
    }
};
// Cấu hình OpenAI với API Key từ file .env

// Hàm gợi ý bài tập bằng GPT
const getAIBasedSuggestions = async (req, res) => {
    try {
        const prompt = `
            Tôi là một giáo viên. Dựa trên sở thích của học sinh, hãy gợi ý 5 bài tập phù hợp.
            Sở thích của học sinh: toán, vật lý.
        `;

        // Gửi yêu cầu đến OpenAI GPT
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 100,
        });

        // Trả về gợi ý từ GPT
        const suggestions = response.data.choices[0].text.trim();
        res.json({ suggestions });
    } catch (err) {
        console.error("Lỗi khi gợi ý bài tập bằng AI:", err);
        res.status(500).json({ message: "Lỗi server!" });
    }
};

//  Lấy danh sách bài tập gợi ý (cải tiến thuật toán)
const getSuggestedExercises = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại." });
        }

        // Lấy danh sách bài tập đã làm của học sinh
        const completedExercises = await Exercise.find({ _id: { $in: user.completedExercises } });

        let suggestedExercises = [];

        if (completedExercises.length === 0) {
            // Nếu chưa làm bài, lấy bài tập phổ biến nhất
            suggestedExercises = await Exercise.find().sort({ createdAt: -1 }).limit(5);
        } else {
            // Lấy danh sách chủ đề từ bài tập đã làm
            const topics = [...new Set(completedExercises.map(ex => ex.topic))];

            // Lấy bài tập thuộc các chủ đề đó nhưng chưa làm
            suggestedExercises = await Exercise.find({
                topic: { $in: topics },
                _id: { $nin: user.completedExercises }
            }).limit(5);
        }

        res.json(suggestedExercises);
    } catch (err) {
        console.error("Lỗi khi lấy bài tập gợi ý:", err);
        res.status(500).json({ message: "Lỗi server." });
    }
};

// 🟢Lấy bài tập theo ID
const getExerciseById = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) {
            return res.status(404).json({ message: "Bài tập không tồn tại!" });
        }
        res.json(exercise);
    } catch (err) {
        console.error("Lỗi khi lấy bài tập:", err);
        res.status(500).json({ message: "Lỗi server!" });
    }
};
const getAllExercises = async (req, res) => {
    try {
      const exercises = await Exercise.find();
      res.json(exercises); // Đảm bảo trả về JSON hợp lệ
    } catch (error) {
      res.status(500).json({ message: "Lỗi server" });
    }
  };

// Cập nhật bài tập
const updateExercise = async (req, res) => {
    try {
        const updatedExercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedExercise) {
            return res.status(404).json({ message: "Bài tập không tồn tại!" });
        }
        res.json(updatedExercise);
    } catch (err) {
        console.error("Lỗi khi cập nhật bài tập:", err);
        res.status(500).json({ message: "Lỗi server!" });
    }
};

//  Xóa bài tập (ĐÃ SỬA LỖI)
const deleteExercise = async (req, res) => {
    try {
        const deletedExercise = await Exercise.findByIdAndDelete(req.params.id);
        if (!deletedExercise) {
            return res.status(404).json({ message: "Bài tập không tồn tại!" });
        }
        res.json({ message: "Bài tập đã bị xóa!" });
    } catch (err) {
        console.error("Lỗi khi xóa bài tập:", err);
        res.status(500).json({ message: "Lỗi server!" });
    }
};

//  Nộp bài tập (ĐÃ SỬA - LƯU VÀO DB)
const submitExercise = async (req, res) => {
    try {
        if (req.user.role !== "student") {
            return res.status(403).json({ message: "Chỉ học sinh mới có thể nộp bài!" });
        }

        const { answers } = req.body;
        const exercise = await Exercise.findById(req.params.exerciseId);

        if (!exercise) {
            return res.status(404).json({ message: "Bài tập không tồn tại!" });
        }

        // Lưu kết quả làm bài vào User
        await User.findByIdAndUpdate(req.user.id, {
            $addToSet: { completedExercises: exercise._id }
        });

        const submission = {
            studentId: req.user.id,
            exerciseId: exercise._id,
            answers,
            submittedAt: new Date(),
        };

        res.status(200).json({ message: "Bài làm đã được nộp!", submission });
    } catch (err) {
        console.error("Lỗi khi nộp bài tập:", err);
        res.status(500).json({ message: "Lỗi server!" });
    }
};

module.exports = {
    createExercise,
    getSuggestedExercises,
    getExerciseById,
    updateExercise,
    deleteExercise,
    submitExercise,
    getAIBasedSuggestions ,
    getAllExercises,
};
