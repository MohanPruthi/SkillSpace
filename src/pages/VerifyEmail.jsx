import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import OTPInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import { sendOtp } from '../services/operations/authAPI';
import { signUp } from '../services/operations/authAPI';
import { Link } from 'react-router-dom';

const VerifyEmail = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {loading, signupData} = useSelector((state) => state.auth);
    const[otp, setOtp] = useState("");

    useEffect(()=>{
        if(!signupData){
            navigate("/signup")
        }
    }, [])

    const {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword
    } = signupData

    const handleOnSubmit = (event) => {
        event.preventDefault();
        dispatch(signUp(accountType, firstName, lastName, email, password, confirmPassword, otp, navigate));
    }

    return (
        <div className='flex items-center justify-center text-white '>
            {
                loading ? (<div> Loading... </div>) : 
                (
                     <div>
                         <h1>Verify Email</h1>
                         <p>A verification code has been sent to you. Enter the code below</p>
                         <form onSubmit={handleOnSubmit}>
                             <OTPInput
                             value={otp}
                             onChange={setOtp}
                             numInputs={6}
                             renderSeparator={<span>-</span>}
                             renderInput={(props) => <input {...props} placeholder="-" className='bg-richblack-700' />}
                             />

                            <button type='submit' className='cursor-pointer'>
                                Verify Email
                            </button>
                         </form>

                        <div>
                            <Link to="/login">
                                <p>Back to Login</p>
                            </Link>
                        </div> 

                        <button onClick={() => dispatch(sendOtp)(email)}>
                            Resend OTP
                        </button>
                     </div>
                )
            }
            
        </div>
    )
}

export default VerifyEmail
