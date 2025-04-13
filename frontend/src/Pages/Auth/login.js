import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import {faKey,faEnvelope, faRightToBracket, faUserPlus,faEyeSlash,faEye} from "@fortawesome/free-solid-svg-icons";



import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, signInWithGitHub } from "../../config/firebase";
import { loginUser } from '../../api';
import '../../styles/globalstyles.css';
import './login.css';

const Login = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [showPassword,setShowPassword] = useState(false);
    const [error,setError] = useState('');
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            const user = await signInWithGoogle();
            console.log("Đăng nhập Google thành công:", user);
            // Xử lý logic sau khi đăng nhập thành công
        } catch (error) {
            console.error("Lỗi đăng nhập Google:", error);
            alert("Đăng nhập Google thất bại!");
        }
    };

    const handleGitHubLogin = async () => {
        try {
            const user = await signInWithGitHub();
            console.log("Đăng nhập GitHub thành công:", user);
            // Xử lý logic sau khi đăng nhập thành công
        } catch (error) {
            console.error("Lỗi đăng nhập GitHub:", error);
            alert("Đăng nhập GitHub thất bại!");
        }
    };

   
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Reset lỗi trước khi gửi
    
        
        if (!email || !password) {
            setError("Vui lòng nhập đầy đủ email và mật khẩu!");
            return;
        }
    
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Email không hợp lệ!");
            return;
        }
    
        try {
            const response = await loginUser(formData)
            console.log("Đăng nhập thành công:", response.data);
            // Lưu token vào localStorage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("user", JSON.stringify({
                _id: response.data.userId,
                email: email,
                role: response.data.role,
            }));     
    
            navigate("/exercises/new"); // Chuyển đến trang chính
        } catch (err) {
            setError(err.response?.data?.message || "Đăng nhập thất bại!");
        }
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    return (
        
        <div className=" container-login d-flex justify-content-center align-items-center min-vh-100   ">
            <div className="card grow-item p-4 bg-bg-secondary-subtle login-container" style={{ width: "400px" }}>
                <h2 className="text-center mb-3 animation ">ĐĂNG NHẬP </h2>
                <p className="text-center text-muted">Bạn chưa có tài khoản?
                    <a href="/register" className='link-register'><FontAwesomeIcon icon={faUserPlus}/> Đăng ký </a>
                </p>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">E-mail <FontAwesomeIcon icon={faEnvelope}/> </label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Nhập email..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Mật Khẩu <FontAwesomeIcon icon={faKey}/></label>
                       <div className='input-group'>
                            <input
                                type={showPassword ? "text": "password"}
                                className="form-control"
                                placeholder="Nhập mật khẩu..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span className="password-toggle" onClick={togglePasswordVisibility} >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </span>
                       </div>
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary ">Đăng Nhập  <FontAwesomeIcon icon={faRightToBracket}/></button>
                    </div>
                        {/* Nút đăng nhập bằng Google & GitHub */}
                <div className="text-center mt-3">
                    <p>Hoặc đăng nhập bằng:</p>
                    <button onClick={handleGoogleLogin} className="btn btn-danger w-100 mb-2">
                    <FontAwesomeIcon icon={faGoogle}/> Đăng nhập với Google 
                    </button>
                    <button onClick={handleGitHubLogin} className="btn btn-dark w-100">
                    <FontAwesomeIcon icon={faGithub}/> Đăng nhập với GitHub 
                    </button>
                </div>
                </form>
                <p className="text-center mt-3">
                    <a href="/forgot-password" className="text-decoration-none">Quên mật khẩu?</a>
                </p>
            </div>
        </div>
    );
};

export default Login;