import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { getPasswordResetToken } from '../services/operations/authAPI';

const ForgotPass = () => {

    const[emailSent, setEmailSent] = useState(false);
    const[email, setEmail] = useState("");
    const{loading} = useSelector((state)=> state.auth);
    const dispatch = useDispatch();

    const handleOnSubmit = (e)=> {
        e.preventDefault(); 
        console.log("submitted")
        dispatch(getPasswordResetToken(email, setEmailSent));         
    }
    return (
        <div className='text-white gap-10 flex flex-col justify-center items-center'>
            {
                loading? (
                    <div> Loading... </div>
                ) : (
                    <div>
                        <div>
                        {
                            emailSent? "Check Your Email" : "Reset Password"          
                        }
                        </div>

                        <div>
                            {
                                emailSent? `We have sent the reset email to ${email}` : "Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
                            }
                        </div>

                        <form onSubmit={handleOnSubmit}>
                            {
                                !emailSent && 
                                    <label>
                                        <p>Email Addres*</p>
                                        <input className='text-richblack-800'
                                            required
                                            type='email'
                                            name='email'
                                            value={email}
                                            onChange={(e)=> setEmail(e.target.value)}
                                            placeholder='Enter Your Email Address' 
                                        />
                                    </label>
                            }

                            <button type='submit' className='border-white border-2 ml-2 mb-2'>
                                {
                                    emailSent? "Resend email" : "Reset Password"
                                }
                            </button> 
                        </form>
                        
                        

                        <div>
                            <Link to="/login">
                                Back to login
                            </Link>
                        </div>
                        
                    </div>
                )
            }
            
        </div>
    )
}

export default ForgotPass
