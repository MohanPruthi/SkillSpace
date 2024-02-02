import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../../services/operations/authAPI';


const LoginForm = ({setIsLoggedIn}) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState( {
        email:"", password:""
    })

    const[showPassword, setShowPassword] = useState(false);

    const {email, password} = formData;

    function onChangeHandler(event) {
        setFormData( (prevData) =>(
            {
                ...prevData,
                [event.target.name]:event.target.value
            }
        ) )
    }

    function onSubmitHandler(event) {
        event.preventDefault(); 

        console.log("Printing the form data");
        console.log(formData);

        dispatch(login(formData.email, formData.password, navigate));
    }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full gap-y-4 mt-6'>
        <label className='w-full '>
            <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>
                Email Address<sup className='text-pink-200'>*</sup>
            </p>
            <input 
                required
                type="email"
                value = {formData.email}
                onChange={onChangeHandler}
                placeholder="Enter email id"
                name="email"
                className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] border-b-[1px]'
            />
        </label>

        <label className='relative'>
            <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem] '>
                Password<sup className='text-pink-200'>*</sup>
            </p>
            <input 
                required
                type= {showPassword ? ("text") : ("password")}
                value = {formData.password}
                onChange={onChangeHandler}
                placeholder="Enter Password"
                name="password"
                className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] border-b-[1px]'
            />

            <span onClick={() => setShowPassword((prev) => !prev)} className='absolute right-3 top-[38px] cursor-pointer'>
                {showPassword ? (<AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF'/>) : (<AiOutlineEye fontSize={24} fill='#AFB2BF'/>)}
            </span>

            <Link to="/forgot-password">
                <p className='text-xs text-blue-100 mt-2 max-w-max ml-auto'>
                    Forgot Password
                </p>
            </Link>
        </label>

        <button type='submit' className='bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-6'> 
            Sign In
        </button>

    </form>
  )
}

export default LoginForm
