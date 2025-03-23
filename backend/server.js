const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const User = require("./src/models/User");   
const userRoutes = require("./src/routes/userRoutes");

const app = express();
const PORT = 5000;
const SECRET_KEY = "supersecretkey";

app.use(express.json());
app.use(cors());  
app.use("/api", userRoutes); 

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/edu_ai', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Đăng ký người dùng
app.post('/api/register', async (req, res) => {
    try {
        console.log("Received data:", req.body); 
        const { username, email, password, role } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email đã tồn tại" });

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, role });

        await newUser.save();
        res.status(201).json({ message: "Đăng ký thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
});
app.get("/api/users/me", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});



// Đăng nhập người dùng
app.post('/api/login', async (req, res) => { // Thêm /api
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Tài khoản không tồn tại" });
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(400).json({ message: "Mật khẩu không đúng" });
    
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, role: user.role });
});

// Trang chủ API
app.get("/", (req, res) => {
    res.send("Server đang chạy...");
});

app.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`));
