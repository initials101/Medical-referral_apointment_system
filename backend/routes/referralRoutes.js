const express = require('express');
const { getAllReferrals, createReferral } = require('../controller/referral');

const router = express.Router();

router.get('/', getAllReferrals);
router.post('/', createReferral);

module.exports = router;
