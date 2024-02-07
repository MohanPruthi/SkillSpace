const express = require("express")
const router = express.Router()

const { auth } = require("../middlewares/auth")
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  // updateDisplayPicture,
  getEnrolledCourses,
} = require("../controllers/Profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delete User Account
router.delete("/deleteProfile", auth, deleteAccount)  // why no auth?
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
// Get Enrolled Courses
/router.get("/getEnrolledCourses", auth, getEnrolledCourses)   // pending controller
// router.put("/updateDisplayPicture", auth, updateDisplayPicture) // pending controller

module.exports = router