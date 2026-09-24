const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const wrapAsync = require('../utils/wrapAsync');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', wrapAsync(authController.register));
router.post('/login',wrapAsync(authController.login));
router.post('/logout',authMiddleware,wrapAsync(authController.logout));

// Example Route
router.get('/me',authMiddleware,wrapAsync(authController.getCurrentUser));


module.exports= router;