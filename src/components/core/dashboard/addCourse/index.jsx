import React from 'react'
import RenderSteps from './RenderSteps'

const AddCourse = () => {

    return (
        <div className=" text-white flex flex-row gap-11">
            <div className='w-[300px] flex flex-col gap-11'>
                <h1>Add Course</h1>
                <div>
                    <RenderSteps/>
                </div>
            </div>
            <div>
                <p>Code Upload Tips</p>
                <ul>
                    <li>Code .............</li>
                    <li>Code .............</li>
                    <li>Code .............</li>
                    <li>Code .............</li> 
                    <li>Code .............</li>
                    <li>Code .............</li>
                    <li>Code .............</li>
                    <li>Code .............</li>
                    <li>Code .............</li>
                    <li>Code .............</li>
                </ul>
            </div>
        </div>
    )
}

export default AddCourse
