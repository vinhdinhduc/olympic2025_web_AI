require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");

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
mongoose
    .connect(process.env.MONGO_URI || "mongodb://localhost:27017/edu_ai"
       
    )
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Trang chủ API
app.get("/", (req, res) => {
    res.send("Server đang chạy...");
});

// Khởi động server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));