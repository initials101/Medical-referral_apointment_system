const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// 📌 Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { patient, doctor, date, notes } = req.body;

    // Check if patient and doctor exist
    const patientExists = await Patient.findById(patient);
    const doctorExists = await Doctor.findById(doctor);
    if (!patientExists || !doctorExists) {
      return res.status(404).json({ error: 'Patient or Doctor not found' });
    }

    // Create the appointment
    const appointment = new Appointment({ patient, doctor, date, notes });
    await appointment.save();

    res.status(201).json({ message: 'Appointment scheduled successfully', appointment });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Get all appointments (Admin/Doctor)
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'user')
      .populate('doctor', 'user specialization');

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Get appointments for a specific doctor
exports.getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const appointments = await Appointment.find({ doctor: doctorId }).populate('patient', 'user');
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Get appointments for a specific patient
exports.getPatientAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const appointments = await Appointment.find({ patient: patientId }).populate('doctor', 'user specialization');
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Update an appointment (Reschedule)
exports.updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { date, status, notes } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { date, status, notes },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment updated', updatedAppointment });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Cancel an appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const canceledAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: 'canceled' },
      { new: true }
    );

    if (!canceledAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment canceled', canceledAppointment });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};
