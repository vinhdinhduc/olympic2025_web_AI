import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./ExerciseCreate.css";
import "bootstrap/dist/css/bootstrap.min.css";

const ExerciseCreate = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [type, setType] = useState("multiple-choice");
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 1,
    },
  ]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topic: "",
    tags: "",
    deadline: "",
    guidelines: "",
    wordLimit: 500,
    resourcesUrl: "",
    submissionType: "file",
    totalPoints: 10,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode) {
      const fetchExercise = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:5000/api/exercises/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const exercise = response.data;
          setFormData({
            title: exercise.title,
            description: exercise.description,
            topic: exercise.topic,
            tags: exercise.tags?.join(", ") || "",
            deadline: exercise.deadline?.split("Z")[0] || "",
            guidelines: exercise.guidelines || "",
            wordLimit: exercise.wordLimit || 500,
            resourcesUrl: exercise.resourcesUrl || "",
            submissionType: exercise.submissionType || "file",
            totalPoints: exercise.totalPoints || 10,
          });

          setType(exercise.type);

          if (exercise.type === "multiple-choice" && exercise.questions) {
            setQuestions(exercise.questions);
          }
        } catch (err) {
          setError(err.response?.data?.message || "Lỗi khi tải bài tập");
          console.error("Error fetching exercise:", err);
        }
      };

      fetchExercise();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const handleQuestionChange = (index, field, payload) => {
    const updatedQuestions = [...questions];

    if (field === "options") {
      const { optionIndex, value } = payload;
      updatedQuestions[index].options[optionIndex] = value;
    } else if (field === "addOption") {
      updatedQuestions[index].options.push(payload.value);
    } else if (field === "removeOption") {
      const { optionIndex } = payload;
      updatedQuestions[index].options = updatedQuestions[index].options.filter(
        (_, i) => i !== optionIndex
      );
    } else {
      updatedQuestions[index][field] =
        field === "correctAnswer" || field === "points"
          ? parseInt(payload)
          : payload;
    }

    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        points: 1,
      },
    ]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        ...formData,
        type,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
      };

      if (type === "multiple-choice") {
        payload.questions = questions;
      }

      const token = localStorage.getItem("token");
      let response;

      if (isEditMode) {
        response = await axios.put(
          `http://localhost:5000/api/exercises/${id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:5000/api/exercises",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      navigate("/exercises");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Lỗi khi ${isEditMode ? "cập nhật" : "tạo"} bài tập`
      );
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} exercise:`,
        err
      );
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài tập này?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/exercises/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate("/exercises");
      } catch (err) {
        setError(err.response?.data?.message || "Lỗi khi xóa bài tập");
        console.error("Error deleting exercise:", err);
      }
    }
  };

  return (
    <div className="exercise-form-container">
      <h2>{isEditMode ? "Chỉnh Sửa Bài Tập" : "Tạo Bài Tập Mới"}</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Loại bài tập:</label>
          <select
            value={type}
            onChange={handleTypeChange}
            required
            disabled={isEditMode} // Không cho phép thay đổi loại bài tập khi chỉnh sửa
          >
            <option value="multiple-choice">Trắc nghiệm</option>
            <option value="essay">Tự luận</option>
            <option value="practice">Thực hành</option>
          </select>
        </div>

        <div className="form-group">
          <label>Tiêu đề:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Mô tả:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Chủ đề:</label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Tags (phân cách bằng dấu phẩy):</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Hạn chót (nếu có):</label>
          <input
            type="datetime-local"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />
        </div>

        {/* Type-specific fields */}
        {type === "multiple-choice" && (
          <div className="mcq-section">
            <h3>Câu hỏi trắc nghiệm</h3>
            {questions.map((q, index) => (
              <div key={index} className="question-group">
                <div className="form-group">
                  <label>Câu hỏi {index + 1}:</label>
                  <input
                    type="text"
                    value={q.questionText}
                    onChange={(e) =>
                      handleQuestionChange(
                        index,
                        "questionText",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Đáp án:</label>
                  {q.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="option-group">
                      <input
                        type="text"
                        value={option}
                        placeholder={`Đáp án ${optionIndex + 1}`}
                        onChange={(e) =>
                          handleQuestionChange(index, "options", {
                            optionIndex,
                            value: e.target.value,
                          })
                        }
                        required
                      />
                      {q.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() =>
                            handleQuestionChange(index, "removeOption", {
                              optionIndex,
                            })
                          }
                          className="remove-option-btn"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  ))}
                  {q.options.length < 4 && (
                    <button
                      type="button"
                      onClick={() =>
                        handleQuestionChange(index, "addOption", { value: "" })
                      }
                      className="add-option-btn"
                    >
                      Thêm đáp án
                    </button>
                  )}
                </div>
                <div className="form-group">
                  <label>Đáp án đúng (nhập số thứ tự, bắt đầu từ 0):</label>
                  <input
                    type="number"
                    min="0"
                    max="3"
                    value={q.correctAnswer}
                    onChange={(e) =>
                      handleQuestionChange(
                        index,
                        "correctAnswer",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Điểm:</label>
                  <input
                    type="number"
                    min="1"
                    value={q.points}
                    onChange={(e) =>
                      handleQuestionChange(index, "points", e.target.value)
                    }
                  />
                </div>

                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="remove-btn"
                  >
                    Xóa câu hỏi
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addQuestion} className="add-btn">
              Thêm câu hỏi
            </button>
          </div>
        )}

        {type === "essay" && (
          <div className="essay-section">
            <div className="form-group">
              <label>Hướng dẫn làm bài:</label>
              <textarea
                name="guidelines"
                value={formData.guidelines}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Giới hạn từ:</label>
              <input
                type="number"
                name="wordLimit"
                min="100"
                value={formData.wordLimit}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Tổng điểm:</label>
              <input
                type="number"
                name="totalPoints"
                min="1"
                value={formData.totalPoints}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {type === "practice" && (
          <div className="practice-section">
            <div className="form-group">
              <label>URL tài nguyên hướng dẫn:</label>
              <input
                type="url"
                name="resourcesUrl"
                value={formData.resourcesUrl}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Hình thức nộp bài:</label>
              <select
                name="submissionType"
                value={formData.submissionType}
                onChange={handleChange}
              >
                <option value="file">File đính kèm</option>
                <option value="url">URL (GitHub, CodeSandbox, etc.)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tổng điểm:</label>
              <input
                type="number"
                name="totalPoints"
                min="1"
                value={formData.totalPoints}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {isEditMode ? "Cập Nhật Bài Tập" : "Tạo Bài Tập"}
          </button>

          {isEditMode && (
            <button type="button" onClick={handleDelete} className="delete-btn">
              Xóa Bài Tập
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ExerciseCreate;
