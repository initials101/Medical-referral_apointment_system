const Patient = require('../models/Patient');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

// 📌 Register a new patient
exports.registerPatient = async (req, res) => {
  try {
    const { userId, dateOfBirth, gender, bloodType, medicalHistory, emergencyContact, assignedDoctor } = req.body;

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if patient already exists
    const existingPatient = await Patient.findOne({ user: userId });
    if (existingPatient) {
      return res.status(400).json({ error: 'Patient already registered' });
    }

    // Check if assigned doctor exists (if provided)
    if (assignedDoctor) {
      const doctorExists = await Doctor.findById(assignedDoctor);
      if (!doctorExists) {
        return res.status(404).json({ error: 'Assigned doctor not found' });
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
    res.status(201).json({ message: 'Patient registered successfully', patient });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('user', 'name email')
      .populate('assignedDoctor', 'user specialization');

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Get a patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId)
      .populate('user', 'name email')
      .populate('assignedDoctor', 'user specialization');

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Update patient details
exports.updatePatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { dateOfBirth, gender, bloodType, medicalHistory, emergencyContact, assignedDoctor } = req.body;

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { dateOfBirth, gender, bloodType, medicalHistory, emergencyContact, assignedDoctor },
      { new: true }
    ).populate('user', 'name email');

    if (!updatedPatient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.status(200).json({ message: 'Patient updated successfully', updatedPatient });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Delete a patient
exports.deletePatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const deletedPatient = await Patient.findByIdAndDelete(patientId);
    if (!deletedPatient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};
