import React from 'react'

const IconButton = ({
    text,
    onclick,
    children,
    disabled,
    outline = false,
    customClasses,
    type
}) => {
    return (
        <button disabled={disabled} onClick={onclick} type={type}
        className={`cursor-pointer rounded-md ${outline? "bg-yellow-50 text-black" : "bg-richblack-200 text-richblack-900"}  py-[8px] px-[20px] font-semibold `}>
            {
                children? (
                <div className='flex flex-row items-center gap-2'>
                    <div>
                        {text}
                    </div>
                    <div> {children} </div>
                    
                </div>) : 
                (text)
            }
        </button>
    )
}

export default IconButton
