const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
      },
    },
    departments: {
      type: [String], // Example: ['Cardiology', 'Neurology', 'Orthopedics']
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    doctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor', // Links to the Doctor model
      },
    ],
  },
  { timestamps: true } // Auto-adds createdAt & updatedAt fields
);

module.exports = mongoose.model('Hospital', HospitalSchema);
