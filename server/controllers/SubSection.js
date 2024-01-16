const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const uploadImageToCloudinary = require("../utils/imageUploader");
require("dotenv").config();


// create Sub Section
exports.createSubSection = async(req, res) => {
    try{
        const {title, timeDuration, description, sectionID} = req.body;

        // fetch video from files
        const video = req.files.videoFile;

        if(!sectionID || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }
        // upload file to cloudinary
        const uploadedVideo = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        // make new sub section in DB
        const newSubSection = await SubSection.create({title, timeDuration, description, videoURL:uploadedVideo.secure_url});

        // Ref sub section from section using id
        const updatedSection = await Section.findByIdAndUpdate(sectionID, {
                                                                    $push:{
                                                                        subSection: newSubSection._id
                                                                    }
                                                                }, {new: true});
        //HW: log updated section here, after adding populate query

        return res.status(200).json({
            succcess:true,
            message:'Sub Section Created Successfully',
            updatedSection,
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
        const{subSectionID} = req.body;

        await SubSection.findByIdAndDelete(subSectionID);
        //TODO[Testing]: do we need to delete the entry from the section schema ?? -> yes?? 
        return res.status(200).json({
            succcess:true,
            message:'Sub Section Deleted Successfully',
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