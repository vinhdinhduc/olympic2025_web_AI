import React ,{ useEffect, useState }from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import "./home.css"; 
import Footer from '../../layouts/footer';
import home from '../../assets/image/anh_bia.jpg';
import Navbar from '../../layouts/navbar';

const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user"));
    
        if (token && userData) {
            axios
                .get("http://localhost:5000/api/auth/validate-token", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    if (response.data.valid) {
                        setIsLoggedIn(true);
                        setUser(userData);
                    } else {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        setIsLoggedIn(false);
                        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                    }
                })
                .catch(() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setIsLoggedIn(false);
                    alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                });
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleClick = () => {
        if(!isLoggedIn) {
            alert("Vui lòng đăng nhập để bắt đầu sử dụng!");
            
        }
        Navigate("/exercises")

    }
  return (
    <><Container fluid className="home-container">
       
          <Row className="align-items-center">
          <Navbar />
              {/* Hình ảnh */}
              <Col md={6} className="text-center">
                  <div className="image-wrapper">
                      <img
                          src={home}
                          alt="Learning"
                          className="rounded-circle img-fluid" />
                  </div>
              </Col>

              {/* Nội dung */}
              <Col md={6} className="text-center text-md-start text-container">
                  <h1 className="logo">
                      <span className="fw-bold text-muted " style={{fontSize:"2rem"}}>Xin Chào  👋!</span>
                      <span className="text-success">Đinh Đức Vình</span>
                  </h1>
                  <h2 className="fw-bold mt-2">Chào mừng các bạn đến với nền tảng học tập trực tuyến bằng AI</h2>
                  <p className="text-muted mt-3">
                      Trang này sẽ giúp bạn tự học và làm bài tập thông qua các bài tập trực tuyến, đồng thời giúp bạn tìm kiếm và giải quyết các vấn đề liên quan đến lập trình, thiết kế, v.v.
                      <br />
                      Và đây cũng là trang để bạn tìm kiếm và giải quyết các vấn đề liên quan đến khoa học, tin học, v.v.
                      <br />
                      Hãy đăng nhập hoặc đăng ký để bắt đầu học!
                  </p>

                  {/* Nút hành động */}
                  <div className="mt-4">
                    {!isLoggedIn ? (
                     <>
                     <Link to="/login">
                        <Button variant="primary " className="me-2">Login</Button>
                    </Link>
                    <Link to="/register">
                        <Button variant="outline-primary">Register</Button>
                    </Link></>   
                    ): (
                        <p></p>
                    )}
                    </div>
                      

                  <div className="mt-4">
                      <Button variant="success" onClick={handleClick}>START NOW</Button>
                  </div>
              </Col>
          </Row>
      </Container><Footer /></>
  );
};

export default Home;
