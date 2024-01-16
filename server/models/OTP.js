const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: [
        {
            type: Date,
            default: Date.now(),
            expires: 5*60,
        }
    ]
});

// pre schema for OTP mail
async function sendVerifictationEmail(email, otp){
    try{
        const mailResponse = await mailSender(email, "Verification Email from Babbar ki website", otp);
        console.log("Email sent successfully: ", mailResponse);
    }
    catch(err){
        console.log("Error in sending OTP", err);
        throw err;
    }
}

OTPSchema.pre("save", async function(next){
    await sendVerifictationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP", OTPSchema);