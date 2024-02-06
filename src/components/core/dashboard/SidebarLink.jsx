import React from 'react'
import * as Icons from "react-icons/vsc"
import { NavLink, useLocation, matchPath } from 'react-router-dom';

const SidebarLink = ({link, iconName}) => {

    const Icon = Icons[iconName];
    const location = useLocation();

    const matchRoute = (route)=>{
        return matchPath({path:route}, location.pathname);
    }

    return (
        <div className={`${matchRoute(link.path) ?'bg-yellow-600' :'bg-opacity-0'} relative px-8 py-2 text-sm font-medium`}>
            <NavLink to={link.path}>
                <span className={`absolute left-0 top-0 w-[0.2rem] h-full bg-yellow-50 ${matchRoute(link.path) ? "opactiy-100":"opacity-0"} `}></span>   {/* yellow line */}
                
                <div className="flex items-center gap-x-2">
                    <Icon className="text-lg"/>
                    <span>{link.name}</span>

                </div>
            </NavLink>
        </div>
    )
}

export default SidebarLink
