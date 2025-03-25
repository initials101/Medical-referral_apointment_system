const express = require('express');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

const router = express.Router();

// 📌 Register a new doctor
router.post(
  '/register',
  catchAsyncErrors(async (req, res, next) => {
    const { userId, specialization, experience, hospital, availability, phone } = req.body;

    // Check if the user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return next(new ErrorHandler('User not found', 404));
    }

    // Check if the hospital exists
    const hospitalExists = await Hospital.findById(hospital);
    if (!hospitalExists) {
      return next(new ErrorHandler('Hospital not found', 404));
    }

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ user: userId });
    if (existingDoctor) {
      return next(new ErrorHandler('Doctor already registered', 400));
    }

    // Create a new doctor entry
    const doctor = new Doctor({
      user: userId,
      specialization,
      experience,
      hospital,
      availability,
      phone,
    });

    await doctor.save();
    res.status(201).json({ success: true, message: 'Doctor registered successfully', doctor });
  })
);

// 📌 Get all doctors
router.get(
  '/get-all-doctors',
  catchAsyncErrors(async (req, res, next) => {
    const doctors = await Doctor.find()
      .populate('user', 'name email')
      .populate('hospital', 'name location');

    res.status(200).json({ success: true, doctors });
  })
);

// 📌 Get a single doctor by ID
router.get(
  '/:doctorId',
  catchAsyncErrors(async (req, res, next) => {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId)
      .populate('user', 'name email')
      .populate('hospital', 'name location');

    if (!doctor) {
      return next(new ErrorHandler('Doctor not found', 404));
    }

    res.status(200).json({ success: true, doctor });
  })
);

// 📌 Get doctors by hospital
router.get(
  '/hospital/:hospitalId',
  catchAsyncErrors(async (req, res, next) => {
    const { hospitalId } = req.params;

    // Check if hospital exists
    const hospitalExists = await Hospital.findById(hospitalId);
    if (!hospitalExists) {
      return next(new ErrorHandler('Hospital not found', 404));
    }

    const doctors = await Doctor.find({ hospital: hospitalId })
      .populate('user', 'name email')
      .populate('hospital', 'name location');

    res.status(200).json({ success: true, doctors });
  })
);

// 📌 Update a doctor's details
router.put(
  '/update/:doctorId',
  catchAsyncErrors(async (req, res, next) => {
    const { doctorId } = req.params;
    const { specialization, experience, hospital, availability, phone, status } = req.body;

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { specialization, experience, hospital, availability, phone, status },
      { new: true }
    ).populate('user', 'name email');

    if (!updatedDoctor) {
      return next(new ErrorHandler('Doctor not found', 404));
    }

    res.status(200).json({ success: true, message: 'Doctor updated successfully', updatedDoctor });
  })
);

// 📌 Activate or deactivate a doctor
router.patch(
  '/toggle-status/:doctorId',
  catchAsyncErrors(async (req, res, next) => {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return next(new ErrorHandler('Doctor not found', 404));
    }

    doctor.status = doctor.status === 'active' ? 'inactive' : 'active';
    await doctor.save();

    res.status(200).json({ success: true, message: `Doctor ${doctor.status}`, doctor });
  })
);

module.exports = router;
