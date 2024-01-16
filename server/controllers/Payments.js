const User = require("../models/User");
const Course = require("../models/Course");
const instance = require("../config/razorpay");
const courseEnrollmentEmail = require("../mail/templates/courseEnrollmentEmail");
const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

exports.capturePayment = async(req, res) => {
    try{
        const {courseId} = req.body;
        const userID = req.user.id;

        if(!userID || !courseId){
            return res.status(401).json({
                success: false,
                message: "Please provide valid Details"
            })
        }

        let course;
        try{
            course = await Course.findById(courseId);

            if(!course){
                return res.json({
                    success:false,
                    message:'Could not find the course',
                });
            }

            //user already paid for the same course
            const uid = new mongoose.Schema.Types.ObjectId(userID);     //lafda
            if(course.studentsEnrolled.includes(uid)){
                return res.status(200).json({
                    success:false,
                    message:'Student is already enrolled',
                });
            }
        }
        catch(e){
            console.error(e);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }

        //order create
        const currency = "INR";

        const options = {
            amount: course.price*100,
            currency: "INR",
            receipt: Math.random(Date.now()).toString(),
            notes: {
                courseId, userID
            }
        }

        try{
            //initiate the payment using razorpay
            const paymentResponse = await instance.orders.create(options);
            return res.status(200).json({
                success:true,
                courseName:course.courseName,
                courseDescription:course.courseDescription,
                thumbnail: course.thumbnail,
                orderId: paymentResponse.id,
                currency:paymentResponse.currency,
                amount:paymentResponse.amount,
            });
        }
        catch(er){
            console.log(er);
            res.json({
                success:false,
                message:"Could not initiate order",
            });
        }
    }
    catch(err){
        console.log(err);
        res.json({
            success:false,
            message:"Payment Failed",
        });
    }
}


//verify Signature of Razorpay and Server
exports.verifySignature = async(req, res) => {
    try{
        const webhookSecret = "12345678";  // to .env ??

        const signature = req.headers("x-razorpay-signature");

        // 3 steps of hashing
        const shasum =  crypto.createHmac("sha256", webhookSecret); //1
        shasum.update(JSON.stringify(req.body));    //2
        const digest = shasum.digest("hex");    //3

        if(digest === signature){
            console.log("Payment authorised");

            const {courseId, userId} = req.body.payload.payment.entity.notes;

            try{
                //fulfil the action

                //find the course and enroll the student in it
                const enrolledCourse = await Course.findOneAndUpdate(
                                                {_id: courseId},
                                                {$push:{studentsEnrolled: userId}},
                                                {new:true},
                );

                if(!enrolledCourse) {
                    return res.status(500).json({
                        success:false,
                        message:'Course not Found',
                    });
                }

                console.log(enrolledCourse);

                //find the student and add the course to their courses array
                const enrolledStudent = await User.findOneAndUpdate(
                                                {_id:userId},
                                                {$push:{courses:courseId}},
                                                {new:true},
                );

                console.log(enrolledStudent);

                //mail send krdo confirmation wala 
                const emailResponse = await mailSender(
                                        enrolledStudent.email,
                                        "Congratulations from CodeHelp",
                                        "Congratulations, you are onboarded into new CodeHelp Course",
                );

                console.log(emailResponse);
                return res.status(200).json({
                    success:true,
                    message:"Signature Verified and COurse Added",
                });
            }       
            catch(error) {
                console.log(error);
                return res.status(500).json({
                    success:false,
                    message:error.message,
                });
            }
        }
        else {
            return res.status(400).json({
                success:false,
                message:'Invalid request',
            });
        }
    }
    catch(err){
        return res.status(400).json({
            success:false,
            message:'Invalid request',
        });
    }
}