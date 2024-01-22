import React from 'react'

const CourseCard = ({key, cardData, currentCard, setCurrentCard}) => {
    return (
        <div className={`h-[300px] w-[360px] cursor-pointer transition-all duration-200 hover:bg-richblack-5 hover:text-richblue-500 group 
        ${currentCard === cardData.heading? "bg-white shadow-[12px_12px_0_0] shadow-yellow-50  text-richblack-800 transition-all duration-200":
        "bg-richblack-800 text-richblack-25"}`}
        onClick={() => setCurrentCard(cardData.heading)}>
            <div className='h-[80%] border-b-2 border-dashed border-richblack-400 p-6'>
                <div className='text-2xl font-semibold  mb-4 group-hover:text-richblack-800'>
                    {cardData.heading } 
                </div>

                <p className='text-[16px] text-richblack-400 mb-8'>
                    {cardData.description}
                </p>
            </div>
            


            <div className='flex flex-row justify-between text-blue-300 px-6 py-3 font-medium'>
                <div>
                    {cardData.level}
                </div>

                <div>
                    {cardData.lessionNumber}
                </div>
            </div>
        </div>
    )
}

export default CourseCard
