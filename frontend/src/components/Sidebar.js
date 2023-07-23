import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import '../App.css';

function Sidebar({ component, courses }) {
    return(
        <div className="drawer lg:drawer-open main">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {component}
                <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label>
            </div> 
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label> 
                <ul className="menu p-8 w-70 h-full bg-primary text-primary-content text-lg">
                    <a className="text-3xl font-extrabold pb-4" href="/">SmartStudy</a>
                    <a className="text-2xl font-bold" href="/mycourses">Courses</a>
                    {/* List of courses */}
                    {courses.map((course) => 
                        <li><Link to={"/mycourses/" + course}>{course}</Link></li>
                    )}
                </ul>
            
            </div>
        </div>
    )
}


export default Sidebar;