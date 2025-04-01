import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {   } from "@fortawesome/free-brands-svg-icons";
import {faKey,faEnvelope, faUser,faRightToBracket} from "@fortawesome/free-solid-svg-icons";

// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import {registerUser} from '../api'
import '../styles/auth.css'
import '../styles/globalstyles.css'


const Register = () => {
    const [formData,setFormData] = useState({
         username: "", email: "", password: "", role: "student"
    })
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async(e) => {
        e.preventDefault();
        try {
            const res = await registerUser(formData);
            console.log(res.data);
            alert("Bạn đã đăng kí thành công");
            
        } catch (error) {
            console.error(error.response.data);
            alert("Lỗi đăng kí!")
            
            
        }

    }

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light body">
        <div className="register-container card grow-item p-4 " style={{ width: "400px" }}>
            <h2 className="text-center mb-3">ĐĂNG KÝ</h2>
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label className="form-label">Tên người dùng <FontAwesomeIcon icon={faUser}/> </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập tên người dùng"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">E-mail <FontAwesomeIcon icon={faEnvelope}/></label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Nhập email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Mật khẩu <FontAwesomeIcon icon={faKey}/></label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="d-grid">
                    <button type="submit" className="btn btn-register">Đăng Ký</button>
                </div>
            </form>
            <p className="text-center mt-3">
                Đã có tài khoản? <a href="/login" className="login-link">Đăng nhập  <FontAwesomeIcon icon={faRightToBracket}/></a>
            </p>
        </div>
    </div>
    );
};

export default Register;