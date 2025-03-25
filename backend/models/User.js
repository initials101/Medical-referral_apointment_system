const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Prevent password from being sent in queries
    },
    role: {
      type: String,
      enum: ['admin', 'doctor', 'patient'],
      default: 'patient',
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    avatar: {
      type: String, // URL to profile picture (Cloudinary, etc.)
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false, // Email verification status
    },
  },
  { timestamps: true } // Auto-adds createdAt & updatedAt fields
);

// 📌 Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 📌 Compare passwords for authentication
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 📌 Generate JWT Token
UserSchema.methods.generateJWT = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

module.exports = mongoose.model('User', UserSchema);
