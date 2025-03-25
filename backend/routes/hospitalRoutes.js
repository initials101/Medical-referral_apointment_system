const express = require('express');
const { getAllHospitals, createHospital } = require('../controller/hospital');

const router = express.Router();

router.get('/', getAllHospitals);
router.post('/', createHospital);

module.exports = router;
