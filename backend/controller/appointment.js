const express = require('express');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

const router = express.Router();

// 📌 Create a new appointment
router.post(
  '/create-appointment',
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { patient, doctor, date, notes } = req.body;

      // Check if patient and doctor exist
      const patientExists = await Patient.findById(patient);
      const doctorExists = await Doctor.findById(doctor);
      if (!patientExists || !doctorExists) {
        return next(new ErrorHandler('Patient or Doctor not found', 404));
      }

      // Create the appointment
      const appointment = new Appointment({ patient, doctor, date, notes });
      await appointment.save();

      res.status(201).json({ success: true, message: 'Appointment scheduled successfully', appointment });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// 📌 Get all appointments (Admin/Doctor)
router.get(
  '/get-all-appointments',
  catchAsyncErrors(async (req, res, next) => {
    try {
      const appointments = await Appointment.find()
        .populate('patient', 'user')
        .populate('doctor', 'user specialization');

      res.status(200).json({ success: true, appointments });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// 📌 Get appointments for a specific doctor
router.get(
  '/doctor/:doctorId',
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { doctorId } = req.params;
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return next(new ErrorHandler('Doctor not found', 404));
      }

      const appointments = await Appointment.find({ doctor: doctorId }).populate('patient', 'user');
      res.status(200).json({ success: true, appointments });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// 📌 Get appointments for a specific patient
router.get(
  '/patient/:patientId',
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { patientId } = req.params;
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return next(new ErrorHandler('Patient not found', 404));
      }

      const appointments = await Appointment.find({ patient: patientId }).populate('doctor', 'user specialization');
      res.status(200).json({ success: true, appointments });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// 📌 Update an appointment (Reschedule)
router.put(
  '/update-appointment/:appointmentId',
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { appointmentId } = req.params;
      const { date, status, notes } = req.body;

      const updatedAppointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { date, status, notes },
        { new: true }
      );

      if (!updatedAppointment) {
        return next(new ErrorHandler('Appointment not found', 404));
      }

      res.status(200).json({ success: true, message: 'Appointment updated', updatedAppointment });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// 📌 Cancel an appointment
router.delete(
  '/cancel-appointment/:appointmentId',
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { appointmentId } = req.params;

      const canceledAppointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { status: 'canceled' },
        { new: true }
      );

      if (!canceledAppointment) {
        return next(new ErrorHandler('Appointment not found', 404));
      }

      res.status(200).json({ success: true, message: 'Appointment canceled', canceledAppointment });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
