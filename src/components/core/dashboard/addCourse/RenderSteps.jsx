import React from 'react'
import { useSelector } from 'react-redux'
import {FaCheck} from "react-icons/fa"
import CourseInformationForm from './courseInformation/CourseInformationForm'
import CourseBuilderForm from './CourseBuilder/CourseBuilderForm'

const RenderSteps = () => {

    const {step} = useSelector((state)=>state.course);
    // const step = 2;
    const steps = [
        {
          id: 1,
          title: "Course Information",
        },
        {
          id: 2,
          title: "Course Builder",
        },
        {
          id: 3,
          title: "Publish",
        },
    ];

    return (
        <div>
            <div className='flex flex-row gap-11'>
                {
                    steps.map((item)=>(
                        <>
                        <div className={`${item.id===step? "bg-yellow-900 text-yellow-50 border-yellow-50" : 
                        "border-richblack-600 bg-richblack-800 text-richblack-300"}
                        ${item.id<step && "bg-yellow-50 text-richblack-800"}
                        w-[50px] h-[50px] rounded-full flex flex-col items-center justify-center border-2`}>
                            {step > item.id ? (<FaCheck/>):(item.id)}
                        </div>
                        </>
                    ))
                }
            </div>

            <div className='flex flex-row gap-11'>
                {steps.map((item)=>(
                    <>
                        <div>
                            <p>{item.title}</p>
                        </div>
                    </>
                ))}
            </div>

            {step===1 && <CourseInformationForm/>}
            {step===2 && <CourseBuilderForm/>}
            {/*{step===3 &&} */}
        </div>
        
    )
}

export default RenderSteps
