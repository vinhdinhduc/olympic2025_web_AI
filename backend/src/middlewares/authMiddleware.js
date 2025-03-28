const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
   try {
      const token = req.header("Authorization");
      if (!token) return res.status(401).json({ message: "Không có token, truy cập bị từ chối!" });

      // Giải mã token
      const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) return res.status(404).json({ message: "Người dùng không tồn tại!" });

      next();
   } catch (error) {
      res.status(401).json({ message: "Token không hợp lệ!" });
   }
};

const teacherMiddleware = (req, res, next) => {
   if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Chỉ giáo viên mới được thực hiện thao tác này!" });
   }
   next();
};

module.exports = { authMiddleware, teacherMiddleware };
