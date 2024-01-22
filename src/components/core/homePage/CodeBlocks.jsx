import React from 'react'
import CTAButton from "./Button"
import { FaArrowRight } from "react-icons/fa6";
import { TypeAnimation } from 'react-type-animation'

const CodeBlocks = ({position, heading, subheading, ctabtn1, ctabtn2, codeblock, backgroudGradient, codeColor}) => {
  return (
    <div className={`flex ${position} my-20 justify-between gap-[98px]`}>
        {/* section-1 */}
      <div className='w-[486px] '>
        {heading}
        <div className='text-richblack-300 font-bold '>
            {subheading}
        </div>

        <div className='flex gap-7 mt-7'>
            <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                <div className='flex gap-2 items-center'>
                    {ctabtn1.btnText}
                    <FaArrowRight/>
                </div>
            </CTAButton>

            <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>  
                    {ctabtn2.btnText}
            </CTAButton>
        </div>
      </div>


        {/* section-2 */}
      <div className='w-[534px] relative'>
        {/*HW -> BG gradient*/}
        <div className={`absolute rounded-full aspect-w-4 aspect-h-3 w-[372.95px] h-[257.05px] ${backgroudGradient}`}>

        </div>
        <div className=' h-fit  flex flex-row text-10[px] w-[470px] py-4 bg-gradient-to-tr from-[rgba(14,26,45,0.24)] to-[rgba(17,30,50,0.38)] '>
          <div className='text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold'>
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
                <p>11</p>
            </div>

            <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}>
                <TypeAnimation
                    sequence={[codeblock, 2000, ""]}
                    repeat={Infinity}
                    cursor={true}
                
                    style = {
                        {
                            whiteSpace: "pre-line",
                            display:"block",
                        }
                    }
                    omitDeletionAnimation={true}
                />
            </div>
            
        </div>
      </div>
    </div>
  )
}

export default CodeBlocks
