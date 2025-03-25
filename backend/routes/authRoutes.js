const express = require('express');
const { register, login } = require('../controller/auth'); // ✅ Ensure this import is correct

const router = express.Router();

router.post('/register', register); // ✅ This should be a valid function
router.post('/login', login); // ✅ This should be a valid function

module.exports = router;
