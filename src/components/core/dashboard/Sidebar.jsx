import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {sidebarLinks} from "../../../data/dashboard-links"
import { logout } from '../../../services/operations/authAPI'
import { useNavigate } from 'react-router-dom'
import SidebarLink from './SidebarLink'

const Sidebar = () => {

    const {user, loading:profileLoading}=useSelector((state)=>state.profile);
    const {loading:authLoading}=useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    if(profileLoading || authLoading){
        return(
            <div>Loading...</div>
        )
    }

    return (
        <div className='text-white'>
            <div className="flex min-w-[232px] flex-col border-r-[1px] border-r-richblack-700 h-[calc(100vh-3.5rem)] bg-richblack-800 py-10">
                <div className='flex flex-col'>
                    {
                        sidebarLinks.map((link)=>{
                            if(link.type && user?.accountType !== link.type) return null;
                            return(
                                <SidebarLink link={link} iconName={link.icon} key={link.id}/>
                            )
                        })
                    }
                </div>

                <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-600"></div>

                <div>
                    
                </div>
            </div>
        </div>
    )
}

export default Sidebar
