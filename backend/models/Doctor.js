const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Links to the User model
      required: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number, // Number of years in practice
      required: true,
      min: 0,
    },
    hospital: {
      type: String,
      required: true,
      trim: true,
    },
    availability: {
      type: [String], // Example: ['Monday', 'Wednesday', 'Friday']
      enum: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      default: [],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true } // Auto-adds createdAt & updatedAt
);

module.exports = mongoose.model('Doctor', DoctorSchema);
