const Section = require("../models/Section");
const Course = require("../models/Course");

// create Section
exports.createSection = async(req, res) => {
    try{
        const {sectionName, courseId} = req.body;

        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "Insufficent data sent"
            })
        }

        const newSection = await Section.create({sectionName});

        //update course with section ObjectID
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId, 
                                                                        {
                                                                        $push:{
                                                                        courseContent: newSection._id
                                                                            }
                                                                        }, {new: true}
                                                                    );
        //HW: use populate to replace sections/sub-sections both in the updatedCourseDetails

        return res.status(200).json({
            success: true,
            message: "New section created",
            updatedCourseDetails
        })
                                                                    
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to create Section, please try again",
            error:err.message,
        });
    }
}


//update section
exports.updateSection = async(req, res) => {
    try{
        const{sectionName, sectionID} = req.body;

        if(!sectionName || !sectionID){
            return res.status(401).json({
                success:false,
                message: "can't update section details"
            })
        }

        const updatedSection = await Section.findByIdAndUpdate(sectionID, {sectionName}, {new: true});

        return res.status(200).json({
            success: true,
            message: "Section updated!"
        })
    }
    catch(err){
        return res.status(500).josn({
            success: false,
            message: "Unable to Update section"
        })
    }
}


//delete section
exports.deleteSection = async(req, res) => {
    try{
        const {sectionID} = req.body;

        await Section.findByIdAndDelete(sectionID);
        //TODO[Testing]: do we need to delete the entry from the course schema ??
        return res.status(200).josn({
            success: true,
            message: "Section Deleted"
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to delete Section, please try again",
            error:err.message,
        });
    }
}