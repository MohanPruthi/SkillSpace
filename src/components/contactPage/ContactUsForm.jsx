
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import CountryCode from "../../data/countrycode.json"
// import { apiConnector } from '../../services/apiconncetor'
// import { contactusEndpoint } from '../../services/apis'

const ContactUsForm = () => {

    const[loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitSuccessful}
    } = useForm();

    const submitContactForm = async(data) => {
        console.log("Loggin Data:", data);
        setLoading(true);
        try{
            // const response=await apiConnector("POST",contactusEndpoint.CONTACT_US_API,data)
            const response = {status: "ok"};
            console.log("Logging response:", response);
        }
        catch(err){
            console.log("Error :", err.message);
        }
        setLoading(false);
    }

    useEffect(()=>{
        if(isSubmitSuccessful){
            reset({
                firstname:"",
                lastname:"",
                email:"",
                message:"",
                phoneNo:"",
            })
        }
    }, [reset, isSubmitSuccessful]);

    return (
        <div>
            <form onSubmit={handleSubmit(submitContactForm)}>
                <div className="flex flex-col gap-5 py-2">
                    <div className='flex flex-col gap-4 justify-between lg:flex-row'>
                        {/* first name */}
                        <div className="w-[50%]">
                            <label className="flex flex-col lable-style ">
                                First Name
                                <input
                                    type="text"
                                    name="firstName"
                                    id="firstName"
                                    placeholder="Enter your first name"
                                    className=" form-style "
                                    {...register("firstName",{required:true})}
                                />
                                {
                                    errors.firstName && (
                                        <span className="-mt-1 text-[12px] text-yellow-100">Please enter your First Name</span>
                                    )
                                }
                            </label>
                        </div>

                        {/* last name */}
                        <div className='w-[50%]'>
                            <label className="flex flex-col lable-style">
                                Last Name
                                <input
                                    type="text"
                                    name="lastName"
                                    id="lastName"
                                    placeholder="Enter your last name"
                                    className= "form-style"
                                    {...register("lastName")}
                                />
                            </label>
                        </div>
                    </div>

                    {/* email */}
                    <div>
                        <label className="flex flex-col lable-style">
                            Email Address
                            <input 
                                type="email"
                                name="email"
                                id="email"
                                placeholder="enter email address"
                                className="form-style"
                                {...register("email",{required:true})}
                            />
                            {
                                errors.email && (
                                    <span>Please enter your email address</span>
                                )
                            }
                        </label>
                    </div>

                    {/* phoneNo */}
                    <div>
                        <label className="flex flex-col gap-3 py-2 ">
                            Phone Number
                            <div className="flex flex-row gap-5">
                                {/* dropdown */}
                                
                                    <select
                                        name="dropdown"
                                        id="dropdown"
                                        className="w-[20%] form-style"
                                        {...register("countrycode",{required:true})} 
                                    >
                                        {
                                            CountryCode.map((element,index)=>{
                                                return (
                                                    <option key={index} value={element.code}>
                                                        {element.code}-{element.country}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                            
                                {/* phone number field */}
                                
                                    <input
                                        type="number"
                                        name="phoneNumber"
                                        id="phoneNumber"
                                        placeholder="Enter your phone number"
                                        className=" w-[75%] form-style"
                                        {...register("phoneNo",{
                                                                required:{value:true,message:"Please enter Phone Number"},
                                                                maxLength:{value:10,message:"Invalid Phone Number"},
                                                                minLength:{value:8,message:"Invalid Phone Number"}
                                                                })}
                                    />
                            
                                {
                                    errors.phoneNo && (
                                        <span className="-mt-1 text-[12px] text-yellow-100">
                                            {errors.phoneNo.message}
                                        </span>
                                    )
                                }

                            </div>

                        </label>
                    </div>
                        
                    {/* message */}
                    <div>
                        <label className="flex flex-col lable-style">
                            Message
                            <textarea
                                name="message"
                                id="message"
                                cols="30"
                                rows="7"
                                placeholder="Enter your message here"
                                className=" form-style"
                                {...register("message",{required:true})}
                            />
                            {
                                errors.message && (
                                    <span className="-mt-1 text-[12px] text-yellow-100">Please enter your message</span>
                                )
                            }
                        </label> 
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
                        ${
                        !loading &&
                        "transition-all duration-200 hover:scale-95 hover:shadow-none"
                        }  disabled:bg-richblack-500 sm:text-[16px] `}
                    >
                    Send Message
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ContactUsForm
