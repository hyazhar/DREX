const ExpressError = require('../utils/ExpressError');

const adminMiddleware = (req,res,next)=>{
    if(!req.user){
        throw new ExpressError(401, "Authentication Required");
    }
    if(req.user.role!=="admin"){
        throw new ExpressError(403,"Admin Access required");
    }
    next();
};
module.exports= adminMiddleware;