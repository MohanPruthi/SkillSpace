const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();



// sendOTP  // generateOTP 
exports.sendOTP = async(req, res) => {
    try{ 
        // fetch email to send OTP
        const{email} = req.body;

        // check if email is registered 
        const chechkUserPresent = User.findOne({email});

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
        
        let result = await OTP.find({otp: otp});

        while(result){
            var otp = otpGenerator.generate(6, {
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            console.log("OTP is: ", otp);
            
            let result = await OTP.find({otp: otp});
        }

        const otpPayload = {email, otp};

        //create an entry for OTP in DB
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

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
        const{firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp} = req.body;

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

        if(recentOTP.length() == 0){
            // OTP not found
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            })
        }
        else if(otp !== recentOTP.otp){
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
            contactNumber,
        });

        const user = await User.create({
            firstName, lastName, email, password:hashedPassword, accountType, contactNumber, additionalDetails:profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastName}`
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
            return res.status(403). json({
                success:false,
                message:'Login failed (All fields are required, please try again)',
            });
        }

        const user = await User.findOne({email});
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
                accountType: user.accoutType
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"2h",
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
            success: flase,
            message: "Unable to login, Try again :(",
        });
    }
    
}


//changePassword
//TODO: HOMEWORK
exports.changePassword = async (req, res) => {
    try{
        const{email, oldPassword, newPassword, confirmNewPassowrd} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.json({
                success: false,
                message: "User does not exists",
            })
        }
        else if(user.password !== oldPassword){
            return res.status(401).json({
                success: false,
                message: "Entered incorrect Old Password, Please retry",
            })
        }
        else if(newPassword !== confirmNewPassowrd){
            return res.status(401).json({
                success: false,
                message: "Passwords does not match",
            }) 
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // update Password in DB
        await User.findOneAndUpdate({password: hashedPassword}, {new: true});

        // send mail for password changed
        await mailSender(email, "Password Changed Successfully", "Password Changed Successfully")

        return res.status(200).json({
            success:true,
            message:'Password changed successful',
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while changing the password'
        })
    }
    //get data from req body
    //get oldPassword, newPassword, confirmNewPassowrd
    //validation

    //update pwd in DB
    //send mail - Password updated
    //return response
}