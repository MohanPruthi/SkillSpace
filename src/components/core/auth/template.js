import React from "react";
import frame from "../../../assets/Images/frame.png"
import Loginform from "./loginform";
import Sginupform from "./signupform";
import {FcGoogle, fcGoogle} from "react-icons/fc"

const template = (props) => {
    let title = props.title;
    let desc1 = props.desc1;
    let desc2 = props.desc2;
    let image = props.image;
    let formtype = props.formtype;
    let setIsLoggedIn = props.setIsLoggedIn;
    return(
        <div className="flex justify-between w-11/12 max-w-[1160px] py-12 mx-auto gap-x-12 gap-y-0">
            <div className="w-11/12 max-w-[450px]">
                <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">{title}</h1>

                <p className="text=[1.25rem leading-[1.625rem] mt-4">
                    <span className="text-richblack-100">{desc1}</span>
                    <br />
                    <span className="text-blue-100 italic">{desc2}</span>
                </p>

                {(formtype==="login")? <Loginform setIsLoggedIn={setIsLoggedIn}/> : <Sginupform setIsLoggedIn={setIsLoggedIn}/>}

                <div className="flex w-full items-center my-4 gap-x-2">
                    <div className="w-full h-[1px] bg-richblack-700"></div>
                    <p className="text-richblack-700 font-medium leading[1.375rem]">
                        OR
                    </p>
                    <div className="w-full h-[1px] bg-richblack-700"></div>
                </div>

                <button className="w-full flex justify-center items-center rounded-[8px] font-medium text-richblack-100 border border-richblack-700 px-[12px] py-[8px] gap-x-2 mt-6">
                    <FcGoogle/>
                    <p>Sing Up with Google</p>
                </button>
            </div>

           

            <div className="relative w-11/12 max-w-[450px]">
                <img src={image} loading="lazy" width={558} height={504} className="absolute -top-4 right-4"/>

                <img src={frame} loading="lazy" width={558} height={504} />
            </div>
        </div>
    )
}

export default template