const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require('crypto');



//resetPasswordToken
exports.resetPasswordToken = async(req, res) => {
    try{
        console.log("object server")
        const email = req.body.email;

        const user = User.findOne({email: email});
        if(!user){ 
            return res.json({
                success:false,
                message:'Your Email is not registered with us'
            });
        }

        //generate token 
        const token = crypto.randomUUID();

        //update user by adding token and expiration time
        const updateDetails = await User.findOneAndUpdate({email:email},{token:token, resetPasswordExpires: Date.now() + 5*60*1000,}, {new:true});
        
        // url to be sent in mail
        const url = `http://localhost:3000/update-password/${token}`;

        // send mail 
        await mailSender(email, "Password reset link: ", `Password Reset Link: ${url}`);

        return res.json({
            success:true,
            message:'Email sent successfully, please check email and change pwd',
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while sending reset pwd mail'
        })
    }
}

//resetPassword
exports.resetPassword = async(req, res) => {
    try{
        const {password, confirmPassword, token} = req.body;

        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:'Reset failed (Password not matching)',
            });
        }
        
        //get userdetails from db using token
        const userDetails = User.findOne({token: token});

        if(!userDetails){
            return res.json({
                success:false,
                message:'Token is invalid',
            });
        }

        //Token expired 
        if(userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success:false,
                message:'Token is expired, please regenerate your token',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Update new password in DB
        await User.findOneAndUpdate({token: token}, {password: hashedPassword}, {new: true}); 

        return res.status(200).json({
            success:true,
            message:'Password reset successful',
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while resetting password'
        })
    }
}