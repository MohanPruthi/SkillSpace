import React, { useState } from 'react'
import { HomePageExplore } from '../../../data/homepage-explore';
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';

const tabsname = ["Free", "New to coding", "Most popular", "Skills paths", "Career paths"];



const ExploreMore = () => {

    const [currentTab, setCurrentTab] = useState(tabsname[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCards = (value) => {
        setCurrentTab(value);                  // sus
        const result = HomePageExplore.filter((course) => course.tag === value);      
        setCourses(result[0].courses);
        setCurrentTab(result[0].courses[0].heading);
    }
    return (
        <div className='relative'>
            <div className='text-4xl font-semibold text-center'>
                Unlock the <HighlightText text={"Power of Code"}/>
            </div>

            <p className='text-center text-richblack-300 text-lg mt-3'>
                Learn to build anything you can imagine
            </p>

            <div className='mt-5 flex flex-row rounded-full bg-richblack-800 mb-5 px-2 py-2 border-b-[1px] border-richblack-50'>
                {
                    tabsname.map( (element, index) => {
                        return (
                            <div className={`text-[16px] flex flex-row items-center gap-2  ${currentTab === element? "bg-richblack-900 text-richblack-5 font-medium" : "text-richblack-200"}
                            rounded-full translation-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-25 px-7 py-3 m`}
                            key={index}
                            onClick={() => setMyCards(element)}
                            >
                                {element}
                            </div>
                        )
                    })
                }
            </div>

            <div className='lg:h-[200px]'></div>

            {/* course cards */}
            <div className='flex flex-row justify-between absolute translate-y-[-50%] translate-x-[-20%] z-10 gap-10'>   
                {
                    courses.map((course, index) => {
                        return (
                            <CourseCard
                            key={index}
                            cardData = {course}
                            currentCard = {currentCard}
                            setCurrentCard = {setCurrentCard}
                            />
                        )
                    })
                }


            </div>
        </div>
    )
}

export default ExploreMore
