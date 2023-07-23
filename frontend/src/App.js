import './App.css';
import React, { useState, useEffect } from 'react';
import Courses from './pages/Courses';
import SpecificCourse from './pages/SpecificCourse';
import StudySession from './pages/StudySession';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Sidebar from "./components/Sidebar";
import axios from 'axios';

import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';

function App() {

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.post("http://localhost:8000/get-courses", {
      "email": localStorage.getItem('email')
    }).then(response => {
      setCourses(response.data.map((item) => item.course));
    })
  }, []);

  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mycourses" element={
            <Sidebar component={<Courses courses={courses} />} courses={courses}></Sidebar>
        }
      />
      <Route path="/mycourses/:course" element={
        <Sidebar component={<SpecificCourse />} courses={courses}></Sidebar>
      } />
      <Route path="/login" element={
        <Sidebar component={<Login />} courses={courses}></Sidebar>
      } />
      <Route path="/register" element={<Sidebar component={<Register />} courses={courses}></Sidebar>} />
      <Route path="/studysession" element={<StudySession />} />
    </Routes>
  );
}

export default App;
