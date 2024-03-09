import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useAsyncError, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'

const VideoDetailsSidebar = ({setReviewModal}) => {

    const {sectionId, subSectionId} = useParams();
    const [activeStatus, setActiveStatus] = useState("");
    const [videoBarActive, setVideoBarActive] = useState("")
    const navigate = useNavigate();
    const location = useLocation();
    const {courseSectionData, courseEntireData, totalNoOfLectures, completedLectures, } = useSelector((state)=>state.viewCourse);


    return (
        <div>

        </div>
    )
}

export default VideoDetailsSidebar
