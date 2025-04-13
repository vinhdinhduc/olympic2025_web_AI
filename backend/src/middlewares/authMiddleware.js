const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
   try {
     const authHeader = req.headers.authorization;
 
     if (!authHeader || !authHeader.startsWith("Bearer ")) {
       return res.status(401).json({ message: "Thiếu token xác thực." });
     }
 
     const token = authHeader.split(" ")[1];
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
     const user = await User.findById(decoded.id).select("-password");
     if (!user) {
       return res.status(401).json({ message: "Người dùng không tồn tại." });
     }
 
     req.user = user;
     next();
   } catch (error) {
     console.error("Lỗi xác thực:", error.message);
     res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
   }
 };

const teacherMiddleware = (req, res, next) => {
   if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Chỉ giáo viên mới được thực hiện thao tác này!" });
   }
   next();
};

//Admin
const isAdmin = (req,res,next) => {
   if(req.user.role !== 'admin'){
      return res.status(403).json({
         message: "Access denied. Admin only!"
      })
   }
   next();
}

module.exports = { authMiddleware, teacherMiddleware, isAdmin };
