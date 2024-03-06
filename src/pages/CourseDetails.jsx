import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchCourseDetails } from '../services/operations/courseDetailsAPI';
import GetAvgRating from "../utils/avgRating"
import setConfirmationModal from "../components/common/ConfirmationModal"
import Error from "./Error";
import CourseDetailsCard from '../components/core/course/CourseDetailsCard';
import RatingStars from "../components/common/RatingStars";
import {formatDate} from "../services/formatDate";
import ConfirmationModal from '../components/common/ConfirmationModal';

const CourseDetails = () => {

    const {loading} = useSelector((state)=>state.profile);
    const {courseId} = useParams();
    const [courseData, setCourseData] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState(null);

    useEffect(()=> {
        const getCourseFullDetails = async() => {
            try{
                const res = await fetchCourseDetails(courseId);
                setCourseData(res);
            }
            catch(err){
                console.log("could not fetch course details..")
            }
        }
        getCourseFullDetails();
    }, [courseId])

    const [avgReviewCount, setAverageReviewCount] = useState(0);

    useEffect(()=> {
        const count = GetAvgRating(courseData?.courseDetails.ratingAndReviews);
        setAverageReviewCount(count);
    }, [courseData])

    const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);

    useEffect(()=> {
        let lectures = 0;
        courseData?.courseDetails.courseContent?.forEach((sec) => {
            console.log("object " + sec.subSection.length)
            lectures += sec.subSection.length || 0
        })
        setTotalNoOfLectures(lectures);
    }, [courseData])

    const [isActive, setIsActive] = useState(Array(0));

    const handleActive = (id) => {
        setIsActive(
            !isActive.includes(id)
             ? isActive.concat(id)
             : isActive.filter((e)=> e != id)
        )
    }

    if(loading || !courseData) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    if(!courseData.success) {
        return (
            <div>
                <Error />
            </div>
        )
    }

    console.log("...")

 
    const {
        // _id: course_id,
        courseName,
        courseDescription,
        // thumbnail,
        // price,
        whatYouWillLearn,
        courseContent,
        ratingAndReviews,
        instructor,
        studentsEnrolled,
        createdAt,
    } = courseData?.courseDetails;

    return (
        <div className='flex flex-col  text-white'>

            <div className='relative flex flex-col justify-start p-8'>
                <p>{courseName}</p>
                <p>{courseDescription}</p>
                <div className='flex gap-x-2'>
                    <span>{avgReviewCount}</span>
                    <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                    <span>{`(${ratingAndReviews.length} reviews) `}</span>
                    <span>{`(${studentsEnrolled.length} students enrolled)`}</span>
                </div>

                <div>
                    <p>Created By {`${instructor.firstName}`}</p>
                </div>

                <div className='flex gap-x-3'>
                    <p>
                        Created At {formatDate(createdAt)}
                    </p>
                    <p>
                        {" "} English
                    </p>
                </div>

                <div>
                    <CourseDetailsCard 
                        course = {courseData?.courseDetails}
                        setConfirmationModal = {setConfirmationModal}
                    />
                </div>
            </div>

            <div>
                <p> What You WIll learn </p>
                <div>
                    {whatYouWillLearn}
                </div>
            </div>

            <div>
                <div>
                    <p>Course Content:</p>
                </div>

                <div className='flex gap-x-3 justify-between'>

                    <div>
                        <span>{courseContent.length} section(s)</span>

                            <span>
                                {totalNoOfLectures} lectures 
                            </span>
                            <span>
                                {courseData?.totalDuration} total length
                            </span>
                    </div>

                    <div>
                            <button
                                onClick={() => setIsActive([])}>
                                Collapse all Sections
                            </button>
                    </div>

                </div>
            </div>

            {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
        
        </div>
    )
}

export default CourseDetails
