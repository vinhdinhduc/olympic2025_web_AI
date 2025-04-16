import React from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = localStorage.getItem("role");

  return (
    <div className="dashboard-container">
      <h1>Chào mừng, {user.email || "Người dùng"}!</h1>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Bài tập đã hoàn thành</h3>
          <p>10</p>
        </div>
        <div className="stat-card">
          <h3>Điểm trung bình</h3>
          <p>85</p>
        </div>
        {role === "teacher" && (
          <div className="stat-card">
            <h3>Bài tập đã tạo</h3>
            <p>5</p>
          </div>
        )}
      </div>

      <div className="quick-links">
        <Link to="/exercises" className="btn">
          Xem danh sách bài tập
        </Link>
        {role === "teacher" && (
          <Link to="/exercise/create" className="btn">
            Tạo bài tập mới
          </Link>
        )}
      </div>

      <div className="notifications">
        <h3>Thông báo</h3>
        <ul>
          <li>Hạn chót nộp bài: 20/04/2025</li>
          <li>Bài tập mới: "Trắc nghiệm JavaScript"</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
