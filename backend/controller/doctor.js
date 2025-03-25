const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Hospital = require('../models/Hospital');

// 📌 Register a new doctor
exports.registerDoctor = async (req, res) => {
  try {
    const { userId, specialization, experience, hospital, availability, phone } = req.body;

    // Check if the user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the hospital exists
    const hospitalExists = await Hospital.findById(hospital);
    if (!hospitalExists) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ user: userId });
    if (existingDoctor) {
      return res.status(400).json({ error: 'Doctor already registered' });
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
    res.status(201).json({ message: 'Doctor registered successfully', doctor });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate('user', 'name email')
      .populate('hospital', 'name location');

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Get a single doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId)
      .populate('user', 'name email')
      .populate('hospital', 'name location');

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Get doctors by hospital
exports.getDoctorsByHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    // Check if hospital exists
    const hospitalExists = await Hospital.findById(hospitalId);
    if (!hospitalExists) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    const doctors = await Doctor.find({ hospital: hospitalId })
      .populate('user', 'name email')
      .populate('hospital', 'name location');

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Update a doctor's details
exports.updateDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { specialization, experience, hospital, availability, phone, status } = req.body;

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { specialization, experience, hospital, availability, phone, status },
      { new: true }
    ).populate('user', 'name email');

    if (!updatedDoctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.status(200).json({ message: 'Doctor updated successfully', updatedDoctor });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Activate or deactivate a doctor
exports.toggleDoctorStatus = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    doctor.status = doctor.status === 'active' ? 'inactive' : 'active';
    await doctor.save();

    res.status(200).json({ message: `Doctor ${doctor.status}`, doctor });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};
