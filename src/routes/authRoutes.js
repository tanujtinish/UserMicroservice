const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/validate_two_factor_otp', authController.validateTwoFactorOTP);
router.post('/generate_two_factor_otp', authController.generateTwoFactorOTP);
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
