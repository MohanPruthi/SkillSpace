import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {apiConnector} from "../services/apiconnector"
import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import Footer from "../components/common/Footer"
import Course_Card from '../components/core/catalog/Course_Card';
import CourseSlider from '../components/core/catalog/CourseSlider';


const Catalog = () => {

    const {catalogName} = useParams();
    console.log(catalogName + "    s s")
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");

    //Fetch all categories
    useEffect(()=> {
        const getCategories = async() => {
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            console.log("cat res  " + res.data.allCategories)
            const categorie_id = res?.data?.allCategories?.filter((ct)=> ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
            setCategoryId(categorie_id);
        }

        getCategories();
    }, [catalogName]); 

    // Fetch catalog page data for seletected category
    useEffect(()=>{
        const getCategoryDetails = async() => {
            const res = await getCatalogaPageData(categoryId);
            console.log("Printing cat page res " + res);
            setCatalogPageData(res);
        }

        if(categoryId){
            getCategoryDetails();
        }
    }, [categoryId])

    return (
        <div className='text-white'>

            <div>
                <p>{`Home / Catalog /`}
                <span>
                    {catalogPageData?.data?.selectedCategory?.name}
                </span></p>
                <p> {catalogPageData?.data?.selectedCategory?.name} </p>
                <p> {catalogPageData?.data?.selectedCategory?.description}</p>
            </div>

            <div>
                {/* section1 */}
                <div>
                <div>Courses to get you started</div>
                    <div className=' flex gap-x-3'>
                        <p>Most Popular</p>
                        <p>New</p>
                    </div>
                    <div>
                        <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses} />
                    </div>
                </div>  

                {/* section2 */}
                <div>
                <div>Top Courses in {catalogPageData?.data?.selectedCategory?.name}</div>
                    <div>
                        <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses}/>
                    </div>
                </div>

                {/* section3 */}
                <div>
                    <div>Frequently Bought</div>
                    <div className='py-8'>

                        <div className='grid grid-cols-1 lg:grid-cols-2'>

                            {
                                catalogPageData?.data?.mostSellingCourses?.slice(0,4)
                                .map((course, index) => (
                                    <Course_Card course={course} key={index} Height={"h-[400px]"}/>
                                ))
                            }

                        </div>

                    </div>
                </div>

            </div>
        <Footer />
        </div>
    )
}

export default Catalog
