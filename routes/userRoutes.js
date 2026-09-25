const express = require('express');
const router= express.Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const wrapAsync = require('../utils/wrapAsync');

router.get('/profile',authMiddleware,wrapAsync(userController.getProfile));
router.put('/profile',authMiddleware,wrapAsync(userController.updateProfile));
router.put('/password',authMiddleware,wrapAsync(userController.changePassword));

module.exports = router;