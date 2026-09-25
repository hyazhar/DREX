const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const ExpressError = require('../utils/ExpressError');

module.exports.getProfile= async(req,res)=>{
    const user= await User.findById(req.user._id).select("-password");
    if(!user){
        throw new ExpressError(404,"user not found");
    };
    res.status(200).json({
        success:true,
        user,
    })
};

module.exports.updateProfile = async(req,res)=>{

    const {name,email}= req.body;
    if(!name && !email){
        throw new ExpressError(400,"Name or Email is required");
    }
    const updateData={};
    if(name){
        if(name.trim().length<2){
            throw new ExpressError(400,"Name must be at least 2 character");
        };
        updateData.name=name.trim();
    }
    if(email){
        const normalizedEmail= email.toLowerCase().trim();
        const emailRegex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(normalizedEmail)){
            throw new ExpressError(400,"Invalid email address");
        };
        const existingUser= await User.findOne({
            email:normalizedEmail,_id:{$ne:req.user_id},
        });
        if(existingUser){
            throw new ExpressError(409,"Email already in use");
        }
        updateData.email=normalizedEmail;
    }
    const user=await User.findByIdAndUpdate(req.user._id,updateData,{
        new:true,
        runValidators:true,
    }).select("-password");
    if(!user){
        throw new ExpressError(404,"User not found");
    };
    res.status(200).json({
        success:true,
        message:"Profile updated successfully",
        user,
    })
};

module.exports.changePassword = async (req,res)=>{
    const {currentpassword,newPassword}= req.body;
    if(!currentpassword|| !newPassword){
        throw new ExpressError(400,"Current Password and new password are required");
    }
    if(newPassword.length<6){
        throw new ExpressError(400,"Password Must be atleast 6 characters");
    }
    const user= await User.findById(req.user._id);
    if(!user){
        throw new ExpressError(404, "user not found");
    }
    const isPasswordCorrect = await bcrypt.compare(currentpassword,user.password);
    if(!isPasswordCorrect){
        throw new ExpressError(401,"Current password is incorrect");
    }
    const hashedPassword= await bcrypt.hash(newPassword,10);
    user.password=hashedPassword;
    await user.save();
    res.status(200).json({
        success:true,
        message:"Password changes successfully",
    })
};