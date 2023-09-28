const express = require('express');
const protectedController = require('../controllers/protectedController');

const router = express.Router();

router.get('/', protectedController.protected);

module.exports = router;
