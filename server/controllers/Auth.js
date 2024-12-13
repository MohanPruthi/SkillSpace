const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender")
const {passwordUpdated} = require("../mail/templates/passwordUpdate")
require("dotenv").config(); 


// sendOTP  // generateOTP 
exports.sendOTP = async(req, res) => {
    try{ 
        // fetch email to send OTP
        const{email} = req.body;

        // check if email is registered 
        const chechkUserPresent = await User.findOne({email});

        if(chechkUserPresent){
            return res.status(401).json({
                success: false,
                message: "User already exists"
            })
        }
        
        // generate new unique OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP is: ", otp);
        
        const result = await OTP.findOne({otp: otp});

        while(result){
                otp = otpGenerator.generate(6, {
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });

            result = await OTP.findOne({otp: otp});
        }
        console.log("OTP F is: ", otp);
        const otpPayload = {email, otp};

        //create an entry for OTP in DB
        const otpBody = await OTP.create(otpPayload);
        console.log(otp.body);

        res.status(200).json({
            success:true,
            message:'OTP Sent Successfully',
            otp,
        }) 
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}


// signUp 
exports.signUp = async(req,res) => {
    try{
        // fetch data from req
        const{firstName, lastName, email, password, confirmPassword, accountType, otp} = req.body;

        // validate 
        if(await User.findOne({email})){
            return res.status(401).json({
                success: false, 
                message: "Unable to SingUp (User already exists)",
            })
        }
        else if(password !== confirmPassword){
            return res.status(401).json({
                success: false,
                message: "Unable to SingUp (Passwords does not match)",
            })
        }
        else if(!firstName || !lastName || !email || !password || !confirmPassword|| !otp) {
            return res.status(403).json({
                success:false,
                message:"Unable to SingUp (All fields are required)",
            })
        }

        //find most recent OTP stored for the user
        const recentOTP = await OTP.find({email}).sort({createdAt:-1}).limit(1); // fun to find most recent otp in DB

        if(!recentOTP){
            // OTP not found
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            })
        }
        else if(otp !== recentOTP[0].otp){
            //wrong OTP
            return res.status(400).json({
                success: false,
                message: "OTP invalid"
            })
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // crate entry in DB
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth: null,
            about:null,
            contactNumber:null,
        });

        const user = await User.create({
            firstName, lastName, email, password:hashedPassword, accountType, additionalDetails:profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${""}${lastName}`
        })
        console.log("New User created: ", user);

        return res.status(200).json({
            success:true,
            message:'User is registered Successfully',
            user,
        });
    }
    catch(err){
        console.log(err);
        return res.status(400).json({
            success: false,
            Message: "SingUp failed, Try again :(",
        })
    }
}

// login
exports.login = async(req, res) => {
    try{
        const{email, password} = req.body;

        if(!email || !password) {
            return res.status(403).json({
                success:false,
                message:'Login failed (All fields are required, please try again)',
            });
        }

        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(402).json({
                success: false,
                message: "Login failed (User is not registrered, please signup first)"
            })
        }

        // Match passwords and genrate JWT, cookies
        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"24h",
            });
            user.token = token;
            user.password = undefined;

            // cookie
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:'Logged in successfully',
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:'Login failed (Password is incorrect)',
            });
        }
    }
    catch(err){
        console.log(err);
        return res.status(400).json({
            success: false,
            message: "Unable to login, Try again :(",
        });
    }
    
}


// Controller for Changing Password
exports.changePassword = async (req, res) => {
    try {
      // Get user data from req.user
      const userDetails = await User.findById(req.user.id)
  
      // Get old password, new password, and confirm new password from req.body
      const { oldPassword, newPassword } = req.body
  
      // Validate old password
      const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        userDetails.password
      )
      if (!isPasswordMatch) {
        // If old password does not match, return a 401 (Unauthorized) error
        return res
          .status(401)
          .json({ success: false, message: "The password is incorrect" })
      }
  
      // Update password
      const encryptedPassword = await bcrypt.hash(newPassword, 10)
      const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        { password: encryptedPassword },
        { new: true }
      )
  
      // Send notification email
      try {
        const emailResponse = await mailSender(
          updatedUserDetails.email,
          "Password for your account has been updated",
          passwordUpdated(
            updatedUserDetails.email,
            `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
          )
        )
        console.log("Email sent successfully:", emailResponse.response)
      } catch (error) {
        // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while sending email:", error)
        return res.status(500).json({
          success: false,
          message: "Error occurred while sending email",
          error: error.message,
        })
      }
  
      // Return success response
      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" })
    } catch (error) {
      // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while updating password:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
      })
    }
  }