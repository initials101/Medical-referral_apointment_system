const express = require('express');
const { getAllDoctors, registerDoctor } = require('../controller/doctor');

const router = express.Router();

router.get('/', getAllDoctors);
router.post('/register', registerDoctor);

module.exports = router;
