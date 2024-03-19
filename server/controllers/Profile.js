const User = require("../models/User");
const Profile = require("../models/Profile");
const Course = require("../models/Course")
const { findByIdAndDelete } = require("../models/Section");

//update profile
exports.updateProfile = async(req, res) => {
    try{
        const{gender, dateOfBirth="", contactNumber, about=""} = req.body; //keeping the field empty by default i.e if not passed in body

        //get userId
        const id = req.user.id;
        //validation
        if(!contactNumber || !gender || !id) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        } 

        // find profile details from userId
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        //update profile details
        profileDetails.gender = gender;
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.contactNumber = contactNumber;
        profileDetails.about = about;

        //save in DB
        await profileDetails.save();

        return res.status(200).json({
            success:true,
            message:'Profile Updated Successfully',
            profileDetails,
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            error:error.message,
        });
    }
}

//deleteAccount
//Explore -> how can we schedule this deletion operation
exports.deleteAccount = async (req, res) => {
    try{
        // fetch user id
        const id = req.user.id;
        // find user with that id
        const userDetails = await User.findById(id);
        if(!userDetails) {
            return res.status(404).json({
                success:false,
                message:'User not found',
            });
        }
        const profileID = userDetails.additionalDetails;

        await Profile.findByIdAndDelete(profileID);

        //TOOD: HW unenroll user form all enrolled courses
        userDetails.courses="";

        await User.findByIdAndDelete(id);
        
        

        return res.status(200).josn({
            seccess: true,
            message: "Account Deleted!!"
        })
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:'User cannot be deleted successfully',
        });
    }
};


// get all user details
exports.getAllUserDetails = async (req, res) => {

    try {
        //get id
        const id = req.user.id;
        console.log(id + "..." + req.user) 

        //validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        //return response
        return res.status(200).json({
            success:true,
            message:'User Data Fetched Successfully',
            userDetails
        });
       
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}


exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      }).populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec()
        
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};



exports.instructorDashboard = async (req, res) => {
  try {
    console.log("0")

    const courseDetails = await Course.find({ instructor: req.user.id })
    console.log(" --  " + courseDetails)
    console.log("1")
    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price
    console.log("2")

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }
    console.log("3")

      return courseDataWithStats
    })
    console.log("4")

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}