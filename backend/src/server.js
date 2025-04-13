require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const connectDB = require("./config/database");


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/exercises", exerciseRoutes);

// Kết nối MongoDB
connectDB();

// Trang chủ API
app.get("/", (req, res) => {
    res.send("Server đang chạy...");
});

// Khởi động server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));