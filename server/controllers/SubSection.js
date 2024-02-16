const Section = require("../models/Section");
const Course = require("../models/Course")
const SubSection = require("../models/SubSection");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
require("dotenv").config();


// create Sub Section
exports.createSubSection = async(req, res) => {
    try{
        const {title, description, sectionId, courseId} = req.body;          

        // fetch video from files
        const video = req.files.video;
        console.log("sub seccc-> " + "tit " + title + " ds " + description + " sec " +  sectionId + " vid " + video + " cou " + courseId)
        if(!sectionId || !title  || !description || !video) {     
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }
        // upload file to cloudinary
        const uploadedVideo = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        // make new sub section in DB
        const newSubSection = await SubSection.create({title, description,
            timeDuration: `${uploadedVideo.duration}`, videoURL:uploadedVideo.secure_url});    

        // Ref sub section from section using id
        const updatedSection = await Section.findByIdAndUpdate(sectionId, {
                                                                    $push:{
                                                                        subSection: newSubSection._id
                                                                    }
                                                                }, {new: true}).populate("subSection");
        //HW: log updated section here, after adding populate query

        // find and return course
        const course1 = await Course.findById(courseId).populate({
            path: "courseContent", 
            populate:{
                path: "subSection"
            }
        }).exec();


        return res.status(200).json({
            success:true,
            message:'Sub Section Created Successfully',
            course1,
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:err.message,
        })
    }
}


//HW: updateSubSection
exports.updateSubSection = async(req, res) => {
    try{
        const{title, timeDuration, description, subSectionID} = req.body;
        const video = req.files.videoFile;

        if(!subSectionID || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }

        const newUploadedVideo = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        const updatedSubSection = await SubSection.findByIdAndUpdate(subSectionID, 
                                                {title, timeDuration, description, videoURL:newUploadedVideo.secure_url},
                                                {new: true});
        
        return res.status(200).json({
            succcess:true,
            message:'Sub Section updated Successfully',
            updatedSubSection,
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:err.message,
        })
    }
}

//HW:deleteSubSection
exports.deleteSubSection = async(req, res) => {
    try{
        const{subSectionId, sectionId, courseId} = req.body;
        console.log("here.........")
        //TODO[Testing]: do we need to delete the entry from the section schema ?? -> yes??  (ye kr diya)
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
              $pull: {
                subSection: subSectionId,
              },
            }
        )
        // delete sub section
        await SubSection.findByIdAndDelete(subSectionId);
        
        const course1 = await Course.findById(courseId).populate({
            path: "courseContent", 
            populate:{
                path: "subSection"
            }
        }).exec();

        return res.status(200).json({
            success:true,
            message:'Sub Section Deleted Successfully',
            course1
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:err.message,
        })
    }
}