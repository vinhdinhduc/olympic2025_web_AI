import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEnvelope, faUser, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { registerUser } from '../api';
import '../styles/register.css';
import '../styles/globalstyles.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: "", email: "", password: "", role: "student"
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await registerUser(formData);
            console.log(res.data);
            alert("Bạn đã đăng ký thành công");
        } catch (error) {
            console.error(error.response.data);
            alert("Lỗi đăng ký!");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 body">
            <div className="register-container card grow-item p-4">
                <h2 className="animation">ĐĂNG KÝ</h2>
                <form onSubmit={handleRegister}>
                    <div className="form-group mb-3">
                        <label className="form-label">Tên người dùng <FontAwesomeIcon icon={faUser}/></label>
                        <input
                            type="text"
                            className="form-control"
                            name="username"
                            placeholder="Nhập tên người dùng"
                            value={formData.username}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label className="form-label">E-mail <FontAwesomeIcon icon={faEnvelope}/></label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="Nhập email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label className="form-label">Mật khẩu <FontAwesomeIcon icon={faKey}/></label>
                        <div className="input-group">
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                placeholder="Nhập mật khẩu"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-register w-100">Đăng Ký</button>
                </form>
                <p className="text-center mt-3 text-black">
                    Đã có tài khoản? <a href="/login" className="login-link">Đăng nhập <FontAwesomeIcon icon={faRightToBracket}/></a>
                </p>
            </div>
        </div>
    );
};

export default Register;