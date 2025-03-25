const Hospital = require('../models/Hospital');

// 📌 Create a new hospital
exports.createHospital = async (req, res) => {
  try {
    const { name, location, contact, departments, status } = req.body;

    // Check if hospital already exists
    const existingHospital = await Hospital.findOne({ name, location });
    if (existingHospital) {
      return res.status(400).json({ error: 'Hospital already exists' });
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
    res.status(201).json({ message: 'Hospital created successfully', hospital });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Get all hospitals
exports.getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.status(200).json(hospitals);
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Get a single hospital by ID
exports.getHospitalById = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    res.status(200).json(hospital);
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Update hospital details
exports.updateHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { name, location, contact, departments, status } = req.body;

    const updatedHospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      { name, location, contact, departments, status },
      { new: true }
    );

    if (!updatedHospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    res.status(200).json({ message: 'Hospital updated successfully', updatedHospital });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// 📌 Delete a hospital
exports.deleteHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    const deletedHospital = await Hospital.findByIdAndDelete(hospitalId);
    if (!deletedHospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    res.status(200).json({ message: 'Hospital deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};
