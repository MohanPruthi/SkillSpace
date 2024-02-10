import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

const CourseBuilderForm = () => {

    const {register, handleSubmit, setValue, formState:{errors} } = useForm();
    const {course} = useSelector((state)=>state.course);
    const {token} = useSelector((state)=>state.auth);
    const [editSectionName, setEditSectionName] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();


    return (
        <div>
            section
        </div>
    )
}

export default CourseBuilderForm
