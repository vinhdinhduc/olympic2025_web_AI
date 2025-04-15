import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./excercisesList.css";

const ExerciseList = () => {
  const [exercises, setExercises] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const exerciseTypes = [
    { value: "all", label: "Tất cả bài tập" },
    { value: "multiple-choice", label: "Trắc nghiệm" },
    { value: "essay", label: "Tự luận" },
    { value: "practice", label: "Thực hành" },
  ];

  const difficultyLevels = [
    { value: "all", label: "Tất cả độ khó" },
    { value: "Dễ", label: "Dễ" },
    { value: "Trung bình", label: "Trung bình" },
    { value: "Khó", label: "Khó" },
  ];

  const filterExercises = () => {
    let result = exercises;

    if (selectedType !== "all") {
      result = result.filter((exercise) => exercise.type === selectedType);
    }

    if (selectedDifficulty !== "all") {
      result = result.filter(
        (exercise) => exercise.difficulty === selectedDifficulty
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (exercise) =>
          exercise.title.toLowerCase().includes(query) ||
          exercise.description.toLowerCase().includes(query)
      );
    }

    setFilteredExercises(result);
  };
  const handleDelete = async (exerciseId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài tập này?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/exercises/${exerciseId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Xóa bài tập thất bại");
      }

      // Cập nhật state sau khi xóa thành công
      setExercises((prev) => prev.filter((ex) => ex._id !== exerciseId));
    } catch (error) {
      console.error("Lỗi khi xóa bài tập:", error);
      alert("Xóa bài tập thất bại: " + error.message);
    }
  };
  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/exercises", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error("Lỗi server:", errText);
          throw new Error("Không thể tải bài tập.");
        }

        const data = await response.json();

        const transformedData = data.map((item) => ({
          _id: item._id,
          title: item.title,
          description: item.description,
          type: item.type,
          difficulty: item.difficulty || "Không rõ",
          topic: item.topic,
          points: item.totalPoints || 0,
          deadline: item.deadline,
          questionsCount: item.questions?.length || 0,
          resourcesUrl: item.resourcesUrl || null,
        }));

        setExercises(transformedData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bài tập:", error);
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [selectedType, selectedDifficulty, searchQuery, exercises]);

  return (
    <div className="exercises-container">
      <div className="exercises-header">
        <h2 className="title-name">Danh sách bài tập</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm bài tập..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="exercise-type">Loại bài tập:</label>
          <select
            id="exercise-type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {exerciseTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="exercise-difficulty">Độ khó:</label>
          <select
            id="exercise-difficulty"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            {difficultyLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredExercises.length > 0 ? (
        <div className="exercises-list">
          {filteredExercises.map((exercise) => (
            <div key={exercise._id} className="exercise-item">
              <div className="exercise-header">
                <h3>{exercise.title}</h3>
                <div className="exercise-meta">
                  <span className={`exercise-type ${exercise.type}`}>
                    {exerciseTypes.find((t) => t.value === exercise.type)
                      ?.label || exercise.type}
                  </span>
                  <span
                    className={`exercise-difficulty ${exercise.difficulty.toLowerCase()}`}
                  >
                    {exercise.difficulty}
                  </span>
                  <span className="exercise-points">
                    ✨ {exercise.points} điểm
                  </span>
                  {exercise.questionsCount > 0 && (
                    <span className="exercise-questions">
                      ❓ {exercise.questionsCount} câu hỏi
                    </span>
                  )}
                </div>
              </div>

              <p className="exercise-description">{exercise.description}</p>

              <div className="exercise-footer">
                {exercise.deadline && (
                  <div className="deadline-info">
                    <span className="deadline-label">⏰ Hạn chót:</span>
                    <span className="deadline-date">
                      {new Date(exercise.deadline).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}

                <div className="exercise-actions">
                  <Link
                    to={`/exercise/detail/${exercise._id}`}
                    className="btn btn-primary"
                  >
                    {exercise.type === "practice"
                      ? "Bắt đầu thực hành"
                      : "Làm bài"}
                  </Link>

                  {userRole === "teacher" && (
                    <>
                      <Link
                        to={`/exercise/edit/${exercise._id}`}
                        className="btn btn-warning"
                      >
                        Sửa
                      </Link>

                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(exercise._id)}
                      >
                        Xóa
                      </button>
                    </>
                  )}

                  {exercise.resourcesUrl && (
                    <a
                      href={exercise.resourcesUrl}
                      className="btn btn-secondary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Tài liệu hướng dẫn
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>Không tìm thấy bài tập phù hợp.</p>
          <button
            className="btn btn-reset"
            onClick={() => {
              setSelectedType("all");
              setSelectedDifficulty("all");
              setSearchQuery("");
            }}
          >
            Đặt lại bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default ExerciseList;
