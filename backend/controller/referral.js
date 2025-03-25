const express = require('express');
const Referral = require('../models/Referral');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

const router = express.Router();

// 📌 Create a new referral
router.post(
  '/create-referral',
  catchAsyncErrors(async (req, res, next) => {
    const { patient, referringDoctor, specialist, referringHospital, destinationHospital, reason, notes } = req.body;

    // Check if patient exists
    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      return next(new ErrorHandler('Patient not found', 404));
    }

    // Check if referring doctor exists
    const referringDoctorExists = await Doctor.findById(referringDoctor);
    if (!referringDoctorExists) {
      return next(new ErrorHandler('Referring doctor not found', 404));
    }

    // Check if specialist exists (if provided)
    if (specialist) {
      const specialistExists = await Doctor.findById(specialist);
      if (!specialistExists) {
        return next(new ErrorHandler('Specialist not found', 404));
      }
    }

    // Check if hospitals exist
    const referringHospitalExists = await Hospital.findById(referringHospital);
    const destinationHospitalExists = await Hospital.findById(destinationHospital);
    if (!referringHospitalExists || !destinationHospitalExists) {
      return next(new ErrorHandler('One or both hospitals not found', 404));
    }

    // Prevent self-referrals to the same hospital
    if (referringHospital === destinationHospital) {
      return next(new ErrorHandler('Cannot refer a patient to the same hospital', 400));
    }

    // Create referral
    const referral = new Referral({
      patient,
      referringDoctor,
      specialist,
      referringHospital,
      destinationHospital,
      reason,
      status: 'pending',
      notes,
    });

    await referral.save();
    res.status(201).json({ success: true, message: 'Referral created successfully', referral });
  })
);

// 📌 Get all referrals
router.get(
  '/get-all-referrals',
  catchAsyncErrors(async (req, res, next) => {
    const referrals = await Referral.find()
      .populate('patient', 'user')
      .populate('referringDoctor', 'user specialization')
      .populate('specialist', 'user specialization')
      .populate('referringHospital', 'name location')
      .populate('destinationHospital', 'name location');

    res.status(200).json({ success: true, referrals });
  })
);

// 📌 Get referrals for a specific patient
router.get(
  '/patient/:patientId',
  catchAsyncErrors(async (req, res, next) => {
    const { patientId } = req.params;
    const referrals = await Referral.find({ patient: patientId })
      .populate('referringDoctor', 'user specialization')
      .populate('destinationHospital', 'name location');

    if (!referrals.length) {
      return next(new ErrorHandler('No referrals found for this patient', 404));
    }

    res.status(200).json({ success: true, referrals });
  })
);

// 📌 Get referrals sent to a specific hospital
router.get(
  '/hospital/:hospitalId',
  catchAsyncErrors(async (req, res, next) => {
    const { hospitalId } = req.params;
    const referrals = await Referral.find({ destinationHospital: hospitalId })
      .populate('patient', 'user')
      .populate('referringDoctor', 'user specialization');

    if (!referrals.length) {
      return next(new ErrorHandler('No referrals found for this hospital', 404));
    }

    res.status(200).json({ success: true, referrals });
  })
);

// 📌 Approve a referral
router.patch(
  '/approve/:referralId',
  catchAsyncErrors(async (req, res, next) => {
    const { referralId } = req.params;

    const referral = await Referral.findById(referralId);
    if (!referral) {
      return next(new ErrorHandler('Referral not found', 404));
    }

    referral.status = 'approved';
    await referral.save();

    res.status(200).json({ success: true, message: 'Referral approved successfully', referral });
  })
);

// 📌 Reject a referral
router.patch(
  '/reject/:referralId',
  catchAsyncErrors(async (req, res, next) => {
    const { referralId } = req.params;

    const referral = await Referral.findById(referralId);
    if (!referral) {
      return next(new ErrorHandler('Referral not found', 404));
    }

    referral.status = 'rejected';
    await referral.save();

    res.status(200).json({ success: true, message: 'Referral rejected', referral });
  })
);

// 📌 Complete a referral
router.patch(
  '/complete/:referralId',
  catchAsyncErrors(async (req, res, next) => {
    const { referralId } = req.params;

    const referral = await Referral.findById(referralId);
    if (!referral) {
      return next(new ErrorHandler('Referral not found', 404));
    }

    referral.status = 'completed';
    await referral.save();

    res.status(200).json({ success: true, message: 'Referral completed successfully', referral });
  })
);

module.exports = router;
