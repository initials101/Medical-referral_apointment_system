const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Links to the User model
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
      required: false,
    },
    medicalHistory: {
      type: [String], // Example: ['Diabetes', 'Hypertension']
      default: [],
    },
    emergencyContact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      relationship: { type: String, required: true },
    },
    assignedDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor', // Links to the Doctor model
      required: false,
    },
  },
  { timestamps: true } // Auto-adds createdAt & updatedAt fields
);

module.exports = mongoose.model('Patient', PatientSchema);
