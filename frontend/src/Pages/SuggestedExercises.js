import React, { useEffect, useState } from "react";
import axios from "axios";

const SuggestedExercises = () => {
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get("http://localhost:5000/api/exercises/suggested", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            setExercises(res.data);
        })
        .catch((err) => {
            console.error("Lỗi khi tải bài tập:", err.response?.data || err.message);
        });
    }, []);

    return (
        <div className="suggested-exercises-container">
            <h2>Bài tập được gợi ý</h2>
            <ul>
                {exercises.map((exercise) => (
                    <li key={exercise.id}>
                        <h3>{exercise.title}</h3>
                        <p>{exercise.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SuggestedExercises;