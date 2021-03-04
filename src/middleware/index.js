const jwt = require('jsonwebtoken');
const env = require('dotenv');

exports.requireSignin = (req,res,next)=>{
    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1];
        var user; 
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded){
            user= decoded;
        });
        if(!user) return res.status(400).json({ message: "Wrong Token Or Token Expired" });
        req.user = user;

    }else{
        return res.status(400).json({message : 'Authorization required'});
    }
    next();
}

exports.adminMiddleware = (req, res, next) => {
    if(req.user.role !== 'admin'){
        return res.status(400).json({message: 'Admin Access denid'})
    }
    next();
} 