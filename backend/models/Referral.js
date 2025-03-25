const mongoose = require('mongoose');

const ReferralSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient', // Links to the Patient model
      required: true,
    },
    referringDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor', // Doctor making the referral
      required: true,
    },
    specialist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor', // Specialist receiving the referral (if applicable)
      required: false,
    },
    referringHospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital', // Hospital where the referring doctor works
      required: true,
    },
    destinationHospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital', // Hospital where the patient is being referred
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment', // Links to the related appointment (if applicable)
      required: false,
    },
  },
  { timestamps: true } // Auto-adds createdAt & updatedAt fields
);

module.exports = mongoose.model('Referral', ReferralSchema);
