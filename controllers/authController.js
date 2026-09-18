const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

module.exports.login = async (req,res)=>{
    const {email,password}= req.body;
    
    if(!email || !password){
        throw new ExpressError(400, "Email and password are required");
    }
    const user = await User.findOne({
        email:email.toLowerCase(),
    });
    
    if(!user){
        throw new ExpressError(401,"Invalid email or password");
    }

    const isPasswordCorrect = await bcrypt.compare(password,user.password);

    if(!isPasswordCorrect){
        throw new ExpressError(401,"Invalid email and Password");
    }

    const token = jwt.sign(
        {
            userId: user._id,
            role : user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"7d",
        }
    );

    res.status(200).json({
        success:true,
        message:"Login Successful",
        token,
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
        },
    });
};