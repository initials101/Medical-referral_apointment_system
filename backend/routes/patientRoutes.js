const express = require('express');
const { getAllPatients, registerPatient } = require('../controller/patient');

const router = express.Router();

router.get('/', getAllPatients);
router.post('/register', registerPatient);

module.exports = router;
