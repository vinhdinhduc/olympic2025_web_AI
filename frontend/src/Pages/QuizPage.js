import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/home.css";

const QuizPage = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/exercises/${id}`)
      .then(response => setExercise(response.data))
      .catch(error => console.error("Lỗi tải bài tập:", error));
  }, [id]);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="quiz-container">
      {exercise ? (
        <>
          <h2>{exercise.title}</h2>
          {exercise.questions.map((q, index) => (
            <div key={index} className="quiz-question">
              <p>{q.question}</p>
              <div className="quiz-options">
                {q.options.map((option, idx) => (
                  <label key={idx}>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      onChange={() => setAnswers({ ...answers, [index]: option })}
                      disabled={submitted}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button onClick={handleSubmit} className="btn btn-success mt-3">
            Nộp bài
          </button>
          {submitted && <p className="mt-3">Bài làm đã được ghi nhận!</p>}
        </>
      ) : (
        <p>Đang tải...</p>
      )}
    </div>
  );
};

export default QuizPage;
