const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const wrapAsync = require('../utils/wrapAsync');

router.post('/register', wrapAsync(authController.register));



module.exports= router;