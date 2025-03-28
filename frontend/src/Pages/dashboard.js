import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        axios.get("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            console.log("Thông tin người dùng:", res.data);
            setUser(res.data);
        })
        .catch((err) => {
            console.error("Lỗi xác thực:", err.response?.data || err.message);
            localStorage.removeItem("token");
            navigate("/login");
        });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="dashboard-container">
            {user ? (
                <>
                    <h2>Chào mừng, {user.username}!</h2>
                    <p>Email: {user.email}</p>
                    <p>Vai trò: {user.role}</p>
                    <button onClick={handleLogout}>Đăng xuất</button>
                </>
            ) : (
                <p>Đang tải thông tin người dùng...</p>
            )}
        </div>
    );
};

export default Dashboard;
