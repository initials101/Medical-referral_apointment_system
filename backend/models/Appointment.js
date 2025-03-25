const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the User model (Patient)
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the User model (Doctor)
      required: true,
    },
    referral: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Referral', // Optional: Link to the Referral model
      required: false,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'canceled'],
      default: 'scheduled',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true } // Auto-adds createdAt & updatedAt fields
);

module.exports = mongoose.model('Appointment', AppointmentSchema);
