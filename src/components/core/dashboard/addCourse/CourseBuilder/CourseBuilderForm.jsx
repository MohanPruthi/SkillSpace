import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '../../../../common/IconButton';
import {MdAddCircleOutline} from "react-icons/md"
import NestedView from './NestedView';
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice';
import {toast} from 'react-hot-toast';
import {BiRightArrow} from "react-icons/bi"

const CourseBuilderForm = () => {

    const {register, handleSubmit, setValue, formState:{errors} } = useForm();
    const {course} = useSelector((state)=>state.course);
    const {token} = useSelector((state)=>state.auth);
    const [editSectionName, setEditSectionName] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    console.log("C ID " + course._id + "-> " + course.instructions)

    useEffect(() => {
        console.log("UPDATED");
    }, [course])

    const handleOnSubmit = async(data) => {
        setLoading(true);
        let result;
        if(editSectionName){
            result = await updateSection(
                {
                    sectionName: data.sectionName,
                    sectionId: editSectionName,
                    courseId: course._id,
                }, token
            )
        }
        else{
            result = await createSection({
                sectionName: data.sectionName,
                courseId: course._id,
            }, token)
        }

        if(result){
            console.log("updated res " + result)
            dispatch(setCourse(result));
            setEditSectionName(null);
            setValue("sectionName", "");
        }
        setLoading(false);
    }


    const cancelEdit = () => { 
        setEditSectionName(null);
        setValue("sectionName", "");
    }

    const goBack = () => {
        dispatch(setEditCourse(true));
        dispatch(setStep(1));
    }

    const goToNext = () => {
        if(course?.courseContent?.length === 0) {
            toast.error("Please add atleast one Section");
            return;
        } 
        if(course.courseContent.some((section) => section.subSection?.length === 0)) {
            toast.error("Please add atleast one lecture in each section");
            return;
        }
        dispatch(setStep(3));
    }

    const handleChangeEditSectionName = (sectionId, sectionName) => {
        if(editSectionName === sectionId){
            cancelEdit();
            return;
        }
        
        setEditSectionName(sectionId);
        setValue("sectionName", sectionName);
    }

    return (
        <div className=' bg-richblack-800 text-white mt-11'>
            <p>Course Builder</p>
            <form onSubmit={handleSubmit(handleOnSubmit)}>
                <div>
                    <label htmlFor="sectionName"> Section name <sup>*</sup> </label>
                    <input 
                    type="text"
                    placeholder='Add Section Name'
                    {...register("sectionName", {required:true})}
                    className='w-full text-richblue-900'
                    />
                </div>

                <div>
                    <IconButton
                        type="submit"
                        text={editSectionName ? "Edit Section Name" : "Create Section"}
                        outline={true}
                        customClasses={"text-white"}
                    >
                        {
                            !editSectionName && <MdAddCircleOutline className='text-richblack-900'/>
                        }        
                    </IconButton>

                    {
                        editSectionName && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className='text-sm text-richblack-300 underline ml-10'
                            >
                                Cancel Edit
                            </button>
                        )
                    }                   
                </div>
            </form>

            {
                course?.courseContent?.length > 0 && (
                    <NestedView handleChangeEditSectionName={handleChangeEditSectionName}/>
                )
            }

            <div className='flex justify-end gap-x-3 mt-10'>
                <button
                onClick={goBack}
                className='rounded-md cursor-pointer flex items-center bg-richblack-200 py-[8px] px-[20px] font-semibold  text-richblack-900'>
                    Back
                </button>
                <IconButton text="Next" outline={true} onclick={goToNext}>
                <BiRightArrow />
                </IconButton>
            </div>
        </div>
    )
}

export default CourseBuilderForm
