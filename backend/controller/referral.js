const Referral = require('../models/Referral');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const Appointment = require('../models/Appointment');

// 📌 Create a new referral
exports.createReferral = async (req, res) => {
  try {
    const { patient, referringDoctor, specialist, referringHospital, destinationHospital, reason, notes } = req.body;

    // Check if patient exists
    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Check if referring doctor exists
    const referringDoctorExists = await Doctor.findById(referringDoctor);
    if (!referringDoctorExists) {
      return res.status(404).json({ error: 'Referring doctor not found' });
    }

    // Check if specialist exists (if provided)
    if (specialist) {
      const specialistExists = await Doctor.findById(specialist);
      if (!specialistExists) {
        return res.status(404).json({ error: 'Specialist not found' });
      }
    }

    // Check if hospitals exist
    const referringHospitalExists = await Hospital.findById(referringHospital);
    const destinationHospitalExists = await Hospital.findById(destinationHospital);
    if (!referringHospitalExists || !destinationHospitalExists) {
      return res.status(404).json({ error: 'One or both hospitals not found' });
    }

    // Prevent self-referrals to the same hospital
    if (referringHospital === destinationHospital) {
      return res.status(400).json({ error: 'Cannot refer a patient to the same hospital' });
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
    res.status(201).json({ message: 'Referral created successfully', referral });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Get all referrals
exports.getAllReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find()
      .populate('patient', 'user')
      .populate('referringDoctor', 'user specialization')
      .populate('specialist', 'user specialization')
      .populate('referringHospital', 'name location')
      .populate('destinationHospital', 'name location');

    res.status(200).json(referrals);
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Get referrals for a specific patient
exports.getReferralsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const referrals = await Referral.find({ patient: patientId })
      .populate('referringDoctor', 'user specialization')
      .populate('destinationHospital', 'name location')
      .populate('status');

    if (!referrals.length) {
      return res.status(404).json({ error: 'No referrals found for this patient' });
    }

    res.status(200).json(referrals);
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Get referrals sent to a specific hospital
exports.getReferralsByHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const referrals = await Referral.find({ destinationHospital: hospitalId })
      .populate('patient', 'user')
      .populate('referringDoctor', 'user specialization');

    if (!referrals.length) {
      return res.status(404).json({ error: 'No referrals found for this hospital' });
    }

    res.status(200).json(referrals);
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Approve a referral
exports.approveReferral = async (req, res) => {
  try {
    const { referralId } = req.params;

    const referral = await Referral.findById(referralId);
    if (!referral) {
      return res.status(404).json({ error: 'Referral not found' });
    }

    referral.status = 'approved';
    await referral.save();

    res.status(200).json({ message: 'Referral approved successfully', referral });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Reject a referral
exports.rejectReferral = async (req, res) => {
  try {
    const { referralId } = req.params;

    const referral = await Referral.findById(referralId);
    if (!referral) {
      return res.status(404).json({ error: 'Referral not found' });
    }

    referral.status = 'rejected';
    await referral.save();

    res.status(200).json({ message: 'Referral rejected', referral });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Complete a referral
exports.completeReferral = async (req, res) => {
  try {
    const { referralId } = req.params;

    const referral = await Referral.findById(referralId);
    if (!referral) {
      return res.status(404).json({ error: 'Referral not found' });
    }

    referral.status = 'completed';
    await referral.save();

    res.status(200).json({ message: 'Referral completed successfully', referral });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};
