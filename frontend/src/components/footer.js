import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/footer.css"; // Import CSS
import logo from "../assets/image/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-logo">
            <img src={logo} alt="Logo" />
            <h3>
              Education <span>AI</span>
            </h3>
          </div>
          <p>Hệ thống học tập trực tuyến bằng công cụ AI.</p>
        </div>

        <div className="footer-bottom">
          <div className="footer-column">
            <h5>Liên kết</h5>
            <ul>
              <li>
                <a href="https://utb.edu.vn">Trường Đại học Tây Bắc</a>
              </li>
              <li>
                <a href="https://example.com">Đức Vình UTB</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h5>Liên hệ</h5>
            <p>
              <strong>Admin@DucVinh</strong>
            </p>
            <p>🏢 K63 ĐHCNTTA</p>
            <p>📞 Điện thoại: 012345678</p>
            <p>
              📧 Email:{" "}
              <a href="mailto:vinhdd.k63dhcntt-a">vinhdd.k63cntt-a@utb.edu.vn</a>
            </p>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        <p>© 2025 phát triển bởi Đức Vình.</p>
      </div>
    </footer>
  );
};

export default Footer;