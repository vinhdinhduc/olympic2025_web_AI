import React from "react";
import "../styles/home.css";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="profile-container">
      <img src="https://via.placeholder.com/100" alt="User Avatar" />
      <h2>{user?.username || "Người dùng"}</h2>
      <p>Email: {user?.email || "Không có email"}</p>
      <p>Vai trò: {user?.role === "teacher" ? "Giáo viên" : "Học sinh"}</p>
    </div>
  );
};

export default Profile;
