// const { markLectureAsComplete } = require("../../src/services/operations/courseDetailsAPI");
const Category = require("../models/Category");

exports.createCategory = async(req, res) => {
    try{
        const {name, description} = req.body;

        if(!name || !description){
            return res.status(401).json({
                success: false,
                message: "All fileds required"
            })
        }

        const categoryDetails = await Category.create({name, description});
        console.log(categoryDetails);

        return res.status(200).json({
            success: true,
            message: "category created",
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}



exports.getAllCategories = async (req, res) => {
    try{
        const allCategories = await Category.find({}, {name: true, description: true});

        return res.status(200).json({
            success:true,
            message:"All Categories returned successfully",
            allCategories,
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}

// categoryPageDetails 
// seletced category filter

exports.categoryPageDetails = async(req, res) => {
    try{

        const {categoryID} = req.body;

        const selectedCategory = await Category.findById({categoryID}).populate("courses").exec();

        if(!selectedCategory) {
            return res.status(404).json({
                success:false,
                message:'Data Not Found',
            });
        }

        //get courses for different categories
        const differentCategories = await Category.find({_id: {$ne: categoryID}}).populate("course").exec();
        
        if(!differentCategories){
            return res.status(404).json({
                success:false,
                message:'Data Not Found',
            });
        }

        //get top 10 selling courses
        //HW - write it on your own

        return res.status(200).json({
            success:true,
            data: {
                selectedCategory,
                differentCategories,
            },
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}