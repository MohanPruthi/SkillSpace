import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {toast} from "react-hot-toast"
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ACCOUNT_TYPE } from '../../../utils/constants';
import { setSignupData } from '../../../slices/authSlice';
import { sendOtp } from '../../../services/operations/authAPI';


const SignupForm = ({setIsLoggedIn}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [accType, setaccType] = useState(ACCOUNT_TYPE.STUDENT);

    const [formData, setFormData] = useState({
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        confirmPassword:""
    })

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { firstName, lastName, email, password, confirmPassword } = formData
    
    // Handle input fields, when some value changes
    function handleOnChange(event) {
        setFormData( (prevData) =>(
            {
                ...prevData,
                [event.target.name]:event.target.value
            }
        ) )
    }

    function handleOnSubmit(event) {
        event.preventDefault();

        if(formData.password != formData.confirmPassword) {
            toast.error("Passwords do not match");
            return ;
        }


        const finalData = {
            ...formData,
            accType
        }

        console.log("printing Final account data ");
        console.log(finalData);

        dispatch(setSignupData(finalData));
        dispatch(sendOtp(formData.email, navigate));

        // Reset
        setFormData({ 
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        })
        setaccType(ACCOUNT_TYPE.STUDENT);
    }

    
      
  return (
    <div>
        {/* student-Instructor tab */}
        <div className='flex bg-richblack-800 rounded-full p-1 gap-z-1 my-6 max-w-max border-b-[1px]'>
            <button
            className={`${accType==="Student"? "bg-richblack-900 text-richblack-5" : "bg-transparent text-richblack-200"} 
            py-2 px-5 rounded-full transition-all duration-200`}
            onClick={()=> setaccType("Student")}>
                Student
            </button>

            <button 
            className={`${accType==="Instructor"? "bg-richblack-900 text-richblack-5" : "bg-transparent text-richblack-200"} 
            py-2 px-5 rounded-full transition-all duration-200`}
            onClick={()=> setaccType("Instructor")}>
                Instructor
            </button>
        </div>

        <form onSubmit={handleOnSubmit} className='flex flex-col w-full gap-y-4 mt-6'>
        {/* first name and lastName */}
            <div className='flex flex-row gap-x-4'>
                    <label className='w-full'>
                        <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>
                            First Name<sup className='text-pink-200'>*</sup>
                        </p>
                        <input
                            required
                            type="text"
                            name="firstName"
                            onChange={handleOnChange}
                            placeholder="Enter First Name"
                            value={formData.firstName}
                            className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] border-b-[1px]'
                        />
                    </label>

                    <label className='w-full'>
                        <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>
                            Last Name<sup className='text-pink-200'>*</sup>
                        </p>
                        <input
                            required
                            type="text"
                            name="lastName"
                            onChange={handleOnChange}
                            placeholder="Enter Last Name"
                            value={formData.lastName}
                            className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] border-b-[1px]'
                        />
                    </label>
            </div>
            {/* email Add */}
            <label className='w-full'>
                    <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>
                        Email Address<sup className='text-pink-200'>*</sup>
                    </p>
                    <input
                        required
                        type="email"
                        name="email"
                        onChange={handleOnChange}
                        placeholder="Enter Email Address "
                        value={formData.email}
                        className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] border-b-[1px]'
                    />
            </label>

            {/* createPassword and Confirm Password */}
            <div className='flex flex-row gap-x-4'>
                <label className='w-full relative'>
                    <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>
                        Create Password<sup className='text-pink-200'>*</sup>
                    </p>
                    <input
                        required
                        type= {showPassword ? ("text") : ("password")}
                        name="password"
                        onChange={handleOnChange}
                        placeholder="Enter Password"
                        value={formData.password}
                        className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] border-b-[1px]'
                    />
                    <span onClick={() => setShowPassword((prev) => !prev)} className='absolute right-3 top-[38px] cursor-pointer'>
                        {showPassword ? (<AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF'/>) : (<AiOutlineEye fontSize={24} fill='#AFB2BF'/>)}
                    </span>
                </label>

                <label className='w-full relative'>
                    <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>
                        Confirm Password<sup className='text-pink-200'>*</sup>
                    </p>
                    <input
                        required 
                        type= {showConfirmPassword ? ("text") : ("password")}
                        name="confirmPassword"
                        onChange={handleOnChange}
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] border-b-[1px]'
                    />
                    <span onClick={() => setShowConfirmPassword((prev) => !prev)} className='absolute right-3 top-[38px] cursor-pointer'>
                        {showConfirmPassword ? (<AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF'/>) : (<AiOutlineEye fontSize={24} fill='#AFB2BF'/>)}
                    </span>
                </label>
            </div>
        <button className='bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-6'>
            Create Account
        </button>
        </form>

    </div>
  )
}

export default SignupForm
