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
        className={`flex items-center ${
            outline ? "border border-yellow-50 bg-transparent" : "bg-yellow-50"
          } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 ${customClasses}`}>
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
