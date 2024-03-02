// const { markLectureAsComplete } = require("../../src/services/operations/courseDetailsAPI");
const { Mongoose } = require("mongoose");
const Category = require("../models/Category");

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

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

        const {categoryId} = req.body;
        console.log("PRINTING CATEGORY ID: ", categoryId);

        const selectedCategory = await Category.findById({_id: categoryId})
        .populate({
            path: "courses",
            match: { status: "Published" },
            populate: "ratingAndReviews",
          })
          .exec()

        // category is not found
        if (!selectedCategory) {
            console.log("Category not found.")
            return res.status(404).json({ 
                success: false,
                message: "Category not found" 
            })
        }

        // when there are no courses
        // if (selectedCategory.courses.length === 0) {                                 // not working  why??
        //     console.log("No courses found for the selected category.")
        //     return res.status(404).json({
        //     success: false,
        //     message: "No courses found for the selected category.",
        //     })
        // }

        // Get courses for other categories
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        })
        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
            ._id
        )
            .populate({
            path: "courses",
            match: { status: "Published" },
            })
            .exec()

        //get top 10 selling courses
        //HW - write it on your own
        const allCategories = await Category.find()
            .populate({
            path: "courses",
            match: { status: "Published" },
            populate: {
                path: "instructor",
            },
            })
            .exec()
        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10)

        return res.status(200).json({
            success:true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses
            },
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error: error.message,
        });
    }
}