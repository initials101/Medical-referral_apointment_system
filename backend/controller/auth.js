const express = require('express');
const User = require('../models/User');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// 📌 Register a new user
router.post(
  '/register',
  catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorHandler('User already exists', 400));
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ success: true, message: 'User registered successfully', user });
  })
);

// 📌 Login a user
router.post(
  '/login',
  catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorHandler('Invalid credentials', 401));
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new ErrorHandler('Invalid credentials', 401));
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true, message: 'Login successful', token, user });
  })
);

module.exports = router;
