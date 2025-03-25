const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// 📌 Authenticate User (Verify JWT)
exports.authenticateUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request object

    // Check if user exists
    const userExists = await User.findById(decoded.id);
    if (!userExists) {
      return res.status(401).json({ error: 'User not found' });
    }

    next(); // Move to the next middleware/controller
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// 📌 Authorize Role (Admin Only)
exports.authorizeAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// 📌 Authorize Role (Doctor Only)
exports.authorizeDoctor = async (req, res, next) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Access denied. Doctors only' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// 📌 Authorize Role (Patient Only)
exports.authorizePatient = async (req, res, next) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ error: 'Access denied. Patients only' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
