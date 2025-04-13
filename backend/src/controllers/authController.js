const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//  Đăng ký người dùng
const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã tồn tại!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, role });

        await newUser.save();
        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
        console.error("Lỗi khi đăng ký:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
};

// 
// Đăng nhập người dùng
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra nếu email hoặc password không được gửi
        if (!email || !password) {
            return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu!" });
        }

        // Tìm người dùng theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email không tồn tại!" });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Mật khẩu không đúng!" });
        }

        // Tạo token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || "defaultsecretkey", // Giá trị mặc định nếu JWT_SECRET không tồn tại
            { expiresIn: "1h" }
        );

        // Trả về token và vai trò người dùng
        res.json({ token, role: user.role });
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
};

//  Lấy thông tin người dùng hiện tại

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại!" });
        }
        res.json(user);
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
};

const validate = (req,res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({valid:false, message: "Token không hợp lệ!" });
    }
    try {
        jwt.verify(token,process.env.JWT_SECRET)
        res.json({valid: true,})
    } catch (error) {
        res.status(401).json({
            valid: false,
            message: "Token không hợp lệ!"
        })
    }
}

module.exports = { register, login, getUserProfile ,validate };