const jwt = require('jsonwebtoken');
require('dotenv').config();

// 📌 Generate JWT Token
exports.generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // Token expires in 1 hour
  );
};

// 📌 Verify JWT Token
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null; // Invalid or expired token
  }
};
