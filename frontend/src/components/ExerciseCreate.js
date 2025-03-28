import React, { useState } from "react";
import axios from "axios";
import "./../styles/ExerciseCreate.css"; // Import CSS

const ExerciseCreate = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("multiple-choice");
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({ questionText: "", options: [], correctAnswer: "" });

    const handleAddQuestion = () => {
        setQuestions([...questions, newQuestion]);
        setNewQuestion({ questionText: "", options: [], correctAnswer: "" });
    };

    const handleCreate = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:5000/api/exercises", 
                { title, description, type, questions }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Tạo bài tập thành công!");
        } catch (error) {
            alert("Lỗi tạo bài tập!");
        }
    };

    return (
        <div className="exercise-create-container">
            <h2>Tạo bài tập mới</h2>
            <input type="text" placeholder="Tiêu đề" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea placeholder="Mô tả" value={description} onChange={e => setDescription(e.target.value)}></textarea>
            <select value={type} onChange={e => setType(e.target.value)}>
                <option value="multiple-choice">Trắc nghiệm</option>
                <option value="essay">Tự luận</option>
            </select>

            <h3>Thêm câu hỏi</h3>
            <input
                type="text"
                placeholder="Nội dung câu hỏi"
                value={newQuestion.questionText}
                onChange={e => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
            />
            <textarea
                placeholder="Các lựa chọn (ngăn cách bằng dấu phẩy)"
                value={newQuestion.options.join(", ")}
                onChange={e => setNewQuestion({ ...newQuestion, options: e.target.value.split(",") })}
            ></textarea>
            <input
                type="text"
                placeholder="Đáp án đúng"
                value={newQuestion.correctAnswer}
                onChange={e => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
            />
            <button onClick={handleAddQuestion}>Thêm câu hỏi</button>

            <h3>Danh sách câu hỏi</h3>
            <ul>
                {questions.map((q, index) => (
                    <li key={index}>
                        <strong>{q.questionText}</strong>
                        <p>Lựa chọn: {q.options.join(", ")}</p>
                        <p>Đáp án đúng: {q.correctAnswer}</p>
                    </li>
                ))}
            </ul>

            <button onClick={handleCreate}>Tạo bài tập</button>
        </div>
    );
};

export default ExerciseCreate;