import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import QuestionCard from "../layouts/QuestionCard";
import "./exercisesDetail.css";

const ExerciseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `http://localhost:5000/api/exercises/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!res.data) {
          throw new Error("Bài tập không tồn tại");
        }

        setExercise(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy bài tập:", err);
        setError(
          err.response?.data?.message || err.message || "Lỗi khi tải bài tập"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const calculateScore = () => {
    if (!exercise) return 0;

    let correctCount = 0;
    exercise.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    return Math.round((correctCount / exercise.questions.length) * 100);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải chi tiết bài tập...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="back-button" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="not-found-container">
        <p>Không tìm thấy bài tập</p>
        <button className="back-button" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="exercise-detail-container">
      <button className="back-button-detail" onClick={() => navigate("/")}>
        <FontAwesomeIcon icon={faCircleLeft} /> Quay lại
      </button>
      <div className="exercise-header">
        <h2>{exercise.title}</h2>
        <div className="exercise-meta">
          <span className="badge">
            {exercise.type === "multiple-choice" ? "Trắc nghiệm" : "Tự luận"}
          </span>
          <span className="time-limit">⏱️ {exercise.timeLimit} phút</span>
          <span className="points">✨ {exercise.points} điểm</span>
        </div>
        <p className="exercise-description">{exercise.description}</p>
      </div>

      {exercise.questions?.length > 0 ? (
        <>
          <div className="questions-container">
            {exercise.questions.map((question, qIndex) => (
              <QuestionCard
                key={qIndex}
                question={question}
                qIndex={qIndex}
                selectedAnswers={selectedAnswers}
                submitted={submitted}
                handleAnswerSelect={handleAnswerSelect}
              />
            ))}
          </div>

          {!submitted ? (
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={
                Object.keys(selectedAnswers).length < exercise.questions.length
              }
            >
              Nộp bài
            </button>
          ) : (
            <div className="results-container">
              <h3>Kết quả của bạn: {calculateScore()}%</h3>
              <p>
                Bạn đã trả lời đúng{" "}
                {
                  Object.keys(selectedAnswers).filter(
                    (qIndex) =>
                      selectedAnswers[qIndex] ===
                      exercise.questions[qIndex].correctAnswer
                  ).length
                }{" "}
                trên tổng số {exercise.questions.length} câu hỏi.
              </p>
              <button
                className="try-again-btn"
                onClick={() => {
                  setSelectedAnswers({});
                  setSubmitted(false);
                }}
              >
                Làm lại bài tập
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="no-questions">
          <p>Bài tập này chưa có câu hỏi nào</p>
          <button className="back-button" onClick={() => navigate(-1)}>
            Quay lại
          </button>
        </div>
      )}
    </div>
  );
};

export default ExerciseDetail;
