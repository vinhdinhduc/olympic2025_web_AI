import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import {registerUser} from '../api'

const Register = () => {
    const [formData,setFormData] = useState({
         username: "", email: "", password: "", role: "student"
    })

    const handleSubmit = async(e) => {
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
        <div className="auth-container">
            <h2>Đăng ký</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Tên đăng nhập" onChange={(e) => setFormData({...formData,username: e.target.value})}  />
                <input type="email" name="email" placeholder="Email" onChange={(e) => setFormData({...formData, email:e.target.value})}  />
                <input type="password" name="password" placeholder="Mật khẩu" onChange={(e) => setFormData({...formData, password:e.target.value})} />
                
                <button type="submit">Đăng ký</button>
            </form>
            
        </div>
    );
};

export default Register;