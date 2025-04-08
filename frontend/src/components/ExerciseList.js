import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/excercisesList.css";

const ExerciseList = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/exercises");
        setExercises(response.data);
        setFilteredExercises(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Lỗi tải bài tập:", error);
        setError("Không thể tải danh sách bài tập. Vui lòng thử lại sau.");
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    if (selectedType === "all") {
      setFilteredExercises(exercises);
    } else {
      setFilteredExercises(
        exercises.filter((exercise) => exercise.type === selectedType)
      );
    }
  }, [selectedType, exercises]);

  const exerciseTypes = [
    { value: "all", label: "Tất cả bài tập" },
    { value: "multiple-choice", label: "Trắc nghiệm" },
    { value: "essay", label: "Tự luận" },
    { value: "practice", label: "Thực hành" },
  ];

  if (isLoading) {
    return <div className="exercises-container">Đang tải...</div>;
  }

  if (error) {
    return <div className="exercises-container">{error}</div>;
  }

  return (
    <div className="exercises-container">
      <h2>Danh sách bài tập</h2>
      
      <div className="exercise-filter">
        <label htmlFor="exercise-type">Lọc theo loại bài tập: </label>
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

      {filteredExercises.length > 0 ? (
        <div className="exercises-list">
          {filteredExercises.map((exercise) => (
            <div key={exercise._id} className="exercise-item">
              <h3>{exercise.title}</h3>
              <div className="exercise-meta">
                <span className={`exercise-type ${exercise.type}`}>
                  {exerciseTypes.find(t => t.value === exercise.type)?.label || exercise.type}
                </span>
                {exercise.deadline && (
                  <span className="exercise-deadline">
                    Hạn chót: {new Date(exercise.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p>{exercise.description}</p>
              <div className="exercise-actions">
                <Link
                  to={`/exercise/${exercise._id}`}
                  className="btn btn-primary"
                >
                  Làm bài
                </Link>
                {exercise.type === "practice" && (
                  <a href={exercise.resourcesUrl} className="btn btn-secondary">
                    Tài liệu hướng dẫn
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Không có bài tập nào thuộc loại này.</p>
      )}
    </div>
  );
};

export default ExerciseList;