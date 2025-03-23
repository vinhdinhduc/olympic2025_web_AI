import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './auth.css'

const Login = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState('');
    const navigate = useNavigate();


   
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError();//reset lỗi trước khi gửi
        try {
            const response = await axios.post("http://localhost:5000/api/login",{
                email,
                password
            })

            //Lưu token vào localS

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);

            navigate('/dashboard');//Chuyển đến trang chính
        } catch (err) {
            setError(err.response?.data?.message || "Đăng nhập thất bạn ! ");
        }
    };

    return (
        <div className="auth-container">
            <h2>Đăng nhập</h2>
            {
                error && <p style={{color:"red"}}>{error}</p>
            }
            <form onSubmit={handleSubmit}>
                <label htmlFor="">Email:</label>
                <input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)}  />
                <label htmlFor="">Mật khẩu:</label>
                <input type="password" name="password" placeholder="Mật khẩu" value={password} onChange={(e) =>setPassword(e.target.value) } required />
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
    );
};

export default Login;
