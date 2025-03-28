import React from "react";
import { Link } from "react-router-dom";
import '../styles/navbar.css';
import '../styles/home.css'
import logo from '../assets/image/logo.png';


const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container">
        <img className="" src={logo} alt="" />
        <Link className="navbar-brand" to="/">EduAI</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/exercises">Bài tập</Link>
            </li>
            <li>
                    <Link to="/exercises/suggested">Bài tập gợi ý</Link>
                </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">Hồ sơ</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Đăng nhập</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
