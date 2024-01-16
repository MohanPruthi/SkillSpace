const RatingAndReview = require("../models/RatingAndReview"); 
const Course = require("../models/Course");
const {mongoose} = require("mongoose");


exports.createRating = async(req, res) => {
    try{
        const userID = req.user.id;
        const{rating, review, courseID} = req.body;

        //check if user is enrolled or not
        const courseDetails = await Course.findOne({_id: courseID, 
                            studentsEnrolled: {$elemMatch: {$eq: userID}} });

        if(!courseDetails) {
            return res.status(404).json({
                success:false,
                message:'Student is not enrolled in the course',
            });
        }

        //check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({user: userID, course: courseID});

        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:'Course is already reviewed by the user',
            });
        }

        // create new rating and review
        const ratingReview = await RatingAndReview.create({
            rating, review, course:courseID,
            user: userID,
        });
        
        // update course with new rating 
        const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseID},
                                                                    {
                                                                        $push: {
                                                                            ratingAndReviews: ratingReview._id,
                                                                        }
                                                                    },
                                                                    {new: true});
        
        console.log(updatedCourseDetails);
        
        return res.status(200).json({
            success:true,
            message:"Rating and Review created Successfully",
            ratingReview,
        })

    }
    catch(er){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


// READ NEXT TWO FUN
//getAverageRating
exports.getAverageRating = async (req, res) => {
    try {
            //get course ID
            const courseID = req.body.courseID;
            //calculate avg rating

            const result = await RatingAndReview.aggregate([
                {
                    $match:{
                        course: new mongoose.Types.ObjectId(courseID),
                    },
                },
                {
                    $group:{
                        _id:null,
                        averageRating: { $avg: "$rating"},
                    }
                }
            ])

            //return rating
            if(result.length > 0) {

                return res.status(200).json({
                    success:true,
                    averageRating: result[0].averageRating,
                })

            }
            
            //if no rating/Review exist
            return res.status(200).json({
                success:true,
                message:'Average Rating is 0, no ratings given till now',
                averageRating:0,
            })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


//getAllRatingAndReviews
exports.getAllRating = async (req, res) => {
    try{
            const allReviews = await RatingAndReview.find({})
                                    .sort({rating: "desc"})
                                    .populate({
                                        path:"user",
                                        select:"firstName lastName email image",
                                    })
                                    .populate({
                                        path:"course",
                                        select: "courseName",
                                    })
                                    .exec();
            return res.status(200).json({
                success:true,
                message:"All reviews fetched successfully",
                data:allReviews,
            });
    }   
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    } 
}