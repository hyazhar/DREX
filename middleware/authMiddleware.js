const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const ExpressError = require('../utils/ExpressError');

const authMiddleware = async(req,res,next)=>{
    
    const authHeader = req.headers.authorization;
    if(!authHeader){
        throw new ExpressError(401,"Authentication required");
    }

    if(!authHeader.startsWith("Bearer")){
        throw new ExpressError(401,"Invalid authentication format");
    }
    const token = authHeader.split(" ")[1];
    if(!token){
        throw new ExpressError(401,"Authenticatio token is missing");
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password")
        if(!user){
            throw new ExpressError(401,"user no longer exists");
        }
        req.user=user;
        next();
    }
    catch(error){
        if(error instanceof ExpressError){
            throw error;
        }
        throw new ExpressError(401,"invalid or expired token");
    }
};
module.exports= authMiddleware;
