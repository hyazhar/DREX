const User = require('../models/userSchema');
const bycrypt = require('bcryptjs');
const ExpressError = require('../utils/ExpressError');

module.exports.register= async (req,res)=>{
    const {name,email,password}= req.body;
    if(!name || !email || !password){
        throw new ExpressError(400, "Name, email and password are required");
    }
    const existingUser= await User.findOne({email});
    if (existingUser){
        throw new ExpressError(409,"User already Exists");
    };
    const hashedpassword= await bycrypt.hash(password,10);

    const user= await User.create({
        name,
        email,
        password:hashedpassword
    });
    res.status(201).json({
        success:true,
        message:"User Registered successfully",
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
        },
    });
};