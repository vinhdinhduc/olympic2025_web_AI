import React, { useState } from "react";
import axios from "axios";

const SubmitExercise = () => {
    const [answer, setAnswer] = useState("");
    const [result, setResult] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        axios.post("http://localhost:5000/api/exercises/submit", { answer }, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            setResult(res.data);
        })
        .catch((err) => {
            console.error("Lỗi khi chấm điểm:", err.response?.data || err.message);
        });
    };

    return (
        <div className="submit-exercise-container">
            <h2>Nộp bài tập</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Nhập câu trả lời của bạn"
                />
                <button type="submit">Nộp bài</button>
            </form>
            {result && <p>Kết quả: {result.score}</p>}
        </div>
    );
};

export default SubmitExercise;