const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const uploadImageToCloudinary = require("../utils/imageUploader");

//createCourse
exports.createCourse = async(req, res) => {
    try{ 
        console.log("1")
        // fetch data
        const {courseName, courseDescription, whatYouWillLearn, price, category, instructions, status} = req.body;   //,tag

        // fetch image
        // const thumbnail = req.files.thumbnailImage;

        console.log("2")
        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category ) {   //|| !thumbnail
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }
        if (!status || status === undefined) {
			status = "Draft";
		}
        console.log("3")
        // check instructor
        const instructorDetails = req.user.id;  // jo user course create kr rha h uski user id = instructorId
        console.log("Instructor Details: " , instructorDetails);
        
        // ^ differnet from babbar bhaiya code   
        // const userId = req.user.id;
        // const instructorDetails = await User.findById(userId);
        // console.log("Instructor Details: " , instructorDetails);
        // //TODO: Verify that userId and instructorDetails._id  are same or different ?

        if(!instructorDetails) {
            return res.status(404).json({
                success:false,
                message:'Instructor Details not found',
            });
        }
        console.log("4")
        //check given Category is valid or not
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails) {
            return res.status(404).json({
                success:false,
                message:'Category Details not found',
            });
        }
        console.log("5")
        //Upload Image top Cloudinary
        // const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for new Course
        const newCourse = Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails,
            whatYouWillLearn,
            price,
            category:categoryDetails._id,
            // thumbnail:thumbnailImage.secure_url,
            // tag,
            status,
            instructions
        })
        console.log("6")
        //add the new course to the user schema of Instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails},
            {
                $push: {
                    courses: newCourse._id,
                }
            }, 
            {new:true},
        );
        console.log("7")
        console.log("cat id " + category)
        //update TAG ka schema  -> done (I guess?) 
        //TODO: HW

        // Add the new course to the Categories
        await Category.findByIdAndUpdate(
            {_id: category},
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            {new:true},
        );
        console.log("8")
        //return response
        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse,
        });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({ 
            success:false,
            message:'Failed to create Course',
            error: err.message,
        })
    }
}

//getAllCourses 
exports.getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find(
			{},
			{
				courseName: true,
				price: true,
				thumbnail: true,
				instructor: true,
				ratingAndReviews: true,
				studentsEnroled: true,
			}
		).populate("instructor")
		    .exec();

            return res.status(200).json({
                success:true,
                message:'Data for all courses fetched successfully',
                data:allCourses,
            })

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot Fetch course data',
            error:error.message,
        })
    }
}


//getCourseDetails
exports.getCourseDetails = async (req, res) => {
    try {
            //get id
            const {courseId} = req.body;
            //find course details
            const courseDetails = await Course.find(
                                        {_id:courseId})
                                        .populate(
                                            {
                                                path:"instructor",
                                                populate:{
                                                    path:"additionalDetails",
                                                },
                                            }
                                        )
                                        .populate("category")
                                        .populate("ratingAndreviews")
                                        .populate({
                                            path:"courseContent",
                                            populate:{
                                                path:"subSection",
                                            },
                                        })
                                        .exec();

                //validation
                if(!courseDetails) {
                    return res.status(400).json({
                        success:false,
                        message:`Could not find the course with ${courseId}`,
                    });
                }
                //return response
                return res.status(200).json({
                    success:true,
                    message:"Course Details fetched successfully",
                    data:courseDetails,
                })

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}