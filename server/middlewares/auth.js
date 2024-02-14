const jwt = require("jsonwebtoken");
require("dotenv").config();

//auth
exports.auth = async(req, res, next) => {
    try{
        // extract token
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ", "");

        if(!token){
            return res.status(400).json({
                success: false,
                message: "Token Absent",
            })
        }

        // verify token 
        try{
            const decode =  jwt.verify(token, process.env.JWT_SECRET);
            console.log("123..")
            console.log(decode);
            console.log("...12")
            req.user = decode;
        }
        catch(err) {
            //verification - issue
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }   
}

//is student
exports.isStudent = async(req, res, next) => {
    try{
        if(req.user.accountType !== "Student") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Students only',
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        })
    }
}

//is admin
exports.isAdmin = async(req, res, next) => {
    try{
        if(req.user.accountType !== "Admin") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Admin only',
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        })
    }
}

//is instructor
exports.isInstructor = async(req, res, next) => {
    try{
        if(req.user.accountType !== "Instructor") { 
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Instructor only',
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        })
    }
}