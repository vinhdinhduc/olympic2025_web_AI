import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";
import logo from "../assets/image/logo.png";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(userData);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);
  console.log("isLoggin", isLoggedIn);
  console.log("user", user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container">
        <div className="d-flex align-items-center">
          <img src={logo} alt="Logo" className="navbar-logo" />
          <Link className="navbar-brand glow-text" to="/">
            EDUCATION AI
          </Link>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/")}`} to="/">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/exercises")}`}
                to="/exercises"
              >
                Bài tập
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/profile")}`}
                to="/profile"
              >
                Hồ sơ
              </Link>
            </li>
            {isLoggedIn ? (
              <li className="nav-item dropdown">
                <Link
                  to="#"
                  className="nav-link dropdown-toggle"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={user?.avatar || "/default"}
                    alt="Avatar"
                    className="navbar-avatar"
                  />
                </Link>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Hồ sơ
                    </Link>
                  </li>
                  {user?.role === "student" && (
                    <>
                      <li>
                        <Link className="dropdown-item" to="/language">
                          Ngôn ngữ
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/grades">
                          Điểm
                        </Link>
                      </li>
                    </>
                  )}
                  {user?.role === "teacher" && (
                    <>
                      <li>
                        <Link className="dropdown-item" to="/exercises/new">
                          Tạo bài tập
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/grades">
                          Xem điểm
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link className={`nav-link ${isActive("/login")}`} to="/login">
                  Đăng Nhập
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
