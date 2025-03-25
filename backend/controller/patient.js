const express = require('express');
const Patient = require('../models/Patient');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

const router = express.Router();

// 📌 Register a new patient
router.post(
  '/register',
  catchAsyncErrors(async (req, res, next) => {
    const { userId, dateOfBirth, gender, bloodType, medicalHistory, emergencyContact, assignedDoctor } = req.body;

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return next(new ErrorHandler('User not found', 404));
    }

    // Check if patient already exists
    const existingPatient = await Patient.findOne({ user: userId });
    if (existingPatient) {
      return next(new ErrorHandler('Patient already registered', 400));
    }

    // Check if assigned doctor exists (if provided)
    if (assignedDoctor) {
      const doctorExists = await Doctor.findById(assignedDoctor);
      if (!doctorExists) {
        return next(new ErrorHandler('Assigned doctor not found', 404));
      }
    }

    // Create a new patient entry
    const patient = new Patient({
      user: userId,
      dateOfBirth,
      gender,
      bloodType,
      medicalHistory,
      emergencyContact,
      assignedDoctor,
    });

    await patient.save();
    res.status(201).json({ success: true, message: 'Patient registered successfully', patient });
  })
);

// 📌 Get all patients
router.get(
  '/get-all-patients',
  catchAsyncErrors(async (req, res, next) => {
    const patients = await Patient.find()
      .populate('user', 'name email')
      .populate('assignedDoctor', 'user specialization');

    res.status(200).json({ success: true, patients });
  })
);

// 📌 Get a patient by ID
router.get(
  '/:patientId',
  catchAsyncErrors(async (req, res, next) => {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId)
      .populate('user', 'name email')
      .populate('assignedDoctor', 'user specialization');

    if (!patient) {
      return next(new ErrorHandler('Patient not found', 404));
    }

    res.status(200).json({ success: true, patient });
  })
);

// 📌 Update patient details
router.put(
  '/update/:patientId',
  catchAsyncErrors(async (req, res, next) => {
    const { patientId } = req.params;
    const { dateOfBirth, gender, bloodType, medicalHistory, emergencyContact, assignedDoctor } = req.body;

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { dateOfBirth, gender, bloodType, medicalHistory, emergencyContact, assignedDoctor },
      { new: true }
    ).populate('user', 'name email');

    if (!updatedPatient) {
      return next(new ErrorHandler('Patient not found', 404));
    }

    res.status(200).json({ success: true, message: 'Patient updated successfully', updatedPatient });
  })
);

// 📌 Delete a patient
router.delete(
  '/delete/:patientId',
  catchAsyncErrors(async (req, res, next) => {
    const { patientId } = req.params;

    const deletedPatient = await Patient.findByIdAndDelete(patientId);
    if (!deletedPatient) {
      return next(new ErrorHandler('Patient not found', 404));
    }

    res.status(200).json({ success: true, message: 'Patient deleted successfully' });
  })
);

module.exports = router;
