import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/exercisesDetail.css";

const ExerciseDetail = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/exercises/${id}`)
      .then((response) => setExercise(response.data))
      .catch((error) => console.error("Lỗi tải chi tiết bài tập:", error));
  }, [id]);

  return (
    <div className="exercise-detail-container">
      {exercise ? (
        <>
          <h2>{exercise.title}</h2>
          <p>{exercise.description}</p>
          <h4>Câu hỏi:</h4>
          <ul>
            {exercise.questions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>Đang tải chi tiết bài tập...</p>
      )}
    </div>
  );
};

export default ExerciseDetail;