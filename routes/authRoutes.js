const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const wrapAsync = require('../utils/wrapAsync');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware= require('../middleware/adminMiddleware');
router.post('/register', wrapAsync(authController.register));
router.post('/login',wrapAsync(authController.login));
router.post('/logout',authMiddleware,wrapAsync(authController.logout));

// Example Route
router.get('/admin',authMiddleware,adminMiddleware,(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Welcome Admin",
    });
});

module.exports= router;