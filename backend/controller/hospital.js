const express = require('express');
const Hospital = require('../models/Hospital');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

const router = express.Router();

// 📌 Create a new hospital
router.post(
  '/create-hospital',
  catchAsyncErrors(async (req, res, next) => {
    const { name, location, contact, departments, status } = req.body;

    // Check if hospital already exists
    const existingHospital = await Hospital.findOne({ name, location });
    if (existingHospital) {
      return next(new ErrorHandler('Hospital already exists', 400));
    }

    // Create a new hospital
    const hospital = new Hospital({
      name,
      location,
      contact,
      departments,
      status: status || 'active',
    });

    await hospital.save();
    res.status(201).json({ success: true, message: 'Hospital created successfully', hospital });
  })
);

// 📌 Get all hospitals
router.get(
  '/get-all-hospitals',
  catchAsyncErrors(async (req, res, next) => {
    const hospitals = await Hospital.find();
    res.status(200).json({ success: true, hospitals });
  })
);

// 📌 Get a single hospital by ID
router.get(
  '/:hospitalId',
  catchAsyncErrors(async (req, res, next) => {
    const { hospitalId } = req.params;
    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      return next(new ErrorHandler('Hospital not found', 404));
    }

    res.status(200).json({ success: true, hospital });
  })
);

// 📌 Update hospital details
router.put(
  '/update/:hospitalId',
  catchAsyncErrors(async (req, res, next) => {
    const { hospitalId } = req.params;
    const { name, location, contact, departments, status } = req.body;

    const updatedHospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      { name, location, contact, departments, status },
      { new: true }
    );

    if (!updatedHospital) {
      return next(new ErrorHandler('Hospital not found', 404));
    }

    res.status(200).json({ success: true, message: 'Hospital updated successfully', updatedHospital });
  })
);

// 📌 Delete a hospital
router.delete(
  '/delete/:hospitalId',
  catchAsyncErrors(async (req, res, next) => {
    const { hospitalId } = req.params;

    const deletedHospital = await Hospital.findByIdAndDelete(hospitalId);
    if (!deletedHospital) {
      return next(new ErrorHandler('Hospital not found', 404));
    }

    res.status(200).json({ success: true, message: 'Hospital deleted successfully' });
  })
);

module.exports = router;
