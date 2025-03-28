import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import '../styles/globalstyles.css';

const Login = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState('');
    const navigate = useNavigate();


   
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Reset lỗi trước khi gửi
    
        // Xác thực phía client
        if (!email || !password) {
            setError("Vui lòng nhập đầy đủ email và mật khẩu!");
            return;
        }
    
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Email không hợp lệ!");
            return;
        }
    
        try {
            const response = await axios.post("http://localhost:5000/api/login", {
                email,
                password,
            });
            console.log("Đăng nhập thành công:", response.data);
            // Lưu token vào localStorage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
    
            navigate("/dashboard"); // Chuyển đến trang chính
        } catch (err) {
            setError(err.response?.data?.message || "Đăng nhập thất bại!");
        }
    };

    return (
        <div className="auth-container">
            <h2>Đăng nhập</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
    );
};

export default Login;
