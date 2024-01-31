import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { VscEye ,VscEyeClosed } from "react-icons/vsc";
import { Link } from 'react-router-dom';
import { resetPassword } from '../services/operations/authAPI';

const UpdatePassword = () => {

    const dispatch = useDispatch();
    const location = useLocation();

    const {loading}=useSelector((state)=>state.auth);

    const[formData, setFormData] = useState({
        password:"",
        confirmPassword:""
    })

    const[showPassword, setShowPassword] = useState(false);
    const[showConfirmPassword, setShowConfirmPassword] = useState(false);
    const{password, confirmPassword} = formData;

    const handleOnChange = (e) => {
        console.log(e.target.name + " " + e.target.value)
        setFormData((prevData)=>({
            ...prevData,
            [e.target.name]:e.target.value,
        }))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const token = location.pathname.split('/').at(-1);
        dispatch(resetPassword(password, confirmPassword, token))
    }

    return (
        <div className='text-white text-xl flex items-center justify-center'>
            {
                loading? (<div>Loading...</div>) :
                (
                    <div>
                        <h1>Choose new Password</h1>
                        <p>Almost done. Enter your new Password and you're all set</p>
                        <form onSubmit={handleOnSubmit}>
                            <label>
                                <p>New Password*</p>
                                <input className='text-black'
                                required 
                                type={showPassword ? "text" : "password"}
                                name='password'
                                value={password}
                                onChange={handleOnChange}
                                />

                                <span className='cursor-pointer' onClick={()=>{setShowPassword((prev)=>!prev)}}>
                                {
                                    showPassword? <VscEye/> : <VscEyeClosed/>
                                }
                                </span>
                            </label>
                            
                            <label>
                                <p>Confirm New Password*</p>
                                <input className='text-black'
                                required 
                                type={showConfirmPassword ? "text" : "password"}
                                name='confirmPassword'
                                value={confirmPassword}
                                onChange={handleOnChange}
                                />
                                
                                <span className='cursor-pointer' onClick={()=>{setShowConfirmPassword((prev)=>!prev)}}>
                                {
                                    showConfirmPassword? <VscEye/> : <VscEyeClosed/>
                                }
                                </span>
                            </label>

                            <button type='submit'>
                                Reset Passsword
                            </button>
                        </form>

                        <div>
                        <Link to="/login">
                            <p>Back to Login</p>
                        </Link>
                        </div> 
                    </div>
                )
            }
        </div>
    )
}

export default UpdatePassword
