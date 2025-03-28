import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/home.css";

const ExerciseList = () => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/exercises")
      .then(response => setExercises(response.data))
      .catch(error => console.error("Lỗi tải bài tập:", error));
  }, []);

  return (
    <div className="exercises-container">
      <h2>Danh sách bài tập</h2>
      {exercises.length > 0 ? (
        exercises.map((exercise) => (
          <div key={exercise._id} className="exercise-item">
            <h3>{exercise.title}</h3>
            <p>{exercise.description}</p>
            <Link to={`/exercise/${exercise._id}`} className="btn btn-primary">
              Làm bài
            </Link>
          </div>
        ))
      ) : (
        <p>Không có bài tập nào.</p>
      )}
    </div>
  );
};

export default ExerciseList;
