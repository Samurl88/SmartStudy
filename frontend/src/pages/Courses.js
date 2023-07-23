import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import 'material-symbols';
import CircularProgress from '@mui/material/CircularProgress';
import "./courses.css";
import axios from 'axios';
import dayjs from 'dayjs';

function Courses() {
  const [courseName, setCourseName] = useState("");
  const [courses, setCourses] = useState([]);
  const [days, setDays] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [daysReviewed, setDaysReviewed] = useState();

  const navigate = useNavigate();

  // Get courses.
  useEffect(() => {
    axios.post("http://localhost:8000/get-courses", {
      "email": localStorage.getItem('email')
    }).then(response => {
      console.log(response.data);
      setCourses(response.data);
    })
  }, []);

  // Get days completed.
  useEffect(() => {
    axios.post("http://localhost:8000/get-days-reviewed", {
      "email": localStorage.getItem('email')
    }).then(response => {
      console.log(response.data);
      setDaysReviewed(response.data)
    })
  }, [])

  useEffect(() => {
    if (courses && daysReviewed) {
      const daysList = []
      // var startOfWeek = dayjs().startOf("week")
      var startOfWeek = dayjs().subtract(2, 'day')
      // var startOfWeek = dayjs("Sun Jul 21 2023 00:00:00 GMT-0700 (Pacific Daylight Time)");
      console.log(startOfWeek)
      for (var i = 0; i < 7; i++) {
        // var day = startOfWeek.day(i).toDate();
        var day = startOfWeek.add(i, "day").toDate();
        var tests = []
        // Check if test is on day.
        courses.forEach((course, i) => {
          if (new Date(course.test_date).toLocaleDateString("en-US", { "timeZone": "UTC" }) == day.toLocaleDateString("en-US", { "timeZone": "UTC" })) {
            tests.push(course.course);
          }

        })
        var info = {};
        info[day] = tests;
        daysList.push(info);
      }

      setDays(daysList);
      console.log(days);
      setIsLoading(false);
    }

  }, [courses])




  if (localStorage.getItem("email") == null) {
    navigate("/login");
  } if (isLoading) {
    return (
      <div class="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    )
  } else {
    return (
      <>
            <div className="w-full navbar">
      <div className="flex-none lg:hidden">
        <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </label>
      </div> 
      <div className="flex-1 px-2 mx-2"></div>
      <div className="flex-none hidden lg:block">
        <ul className="menu menu-horizontal">
          <li><a>{localStorage.getItem("email")}</a></li>
            <div className="dropdown">
            <button className="btn btn-circle">
              <span tabIndex={0} style={{ fontSize: "3rem" }} className="material-symbols-outlined">
                account_circle
              </span>
            </button>
            <ul tabIndex={0} className="dropdown-content right-5 z-[1] menu shadow bg-base-100 rounded-box">
              <li><a onClick={() => {
                localStorage.clear();
                navigate("/");
              }}>Logout</a></li>
            </ul>
          </div>
        </ul>
      </div>
    </div>
        <div className="grid-cols-12 grid mx-12 my-6 gap-10">
          <div className="flex flex-col align-items bg-secondary col-span-12 rounded-xl h-80 text-primary-content font-extrabold shadow-xl p-5" >
            <div className="mr-auto text-2xl">Your schedule</div>
            <ul className="steps mt-auto">
              {days.map((day) =>
                <li className={"step " +
                  // If today, turn step accent
                  (new Date(Object.keys(day)[0]).setHours(0, 0, 0, 0) <= (new Date).setHours(0, 0, 0, 0)
                    ? "step-primary"
                    // If yesterday, turn step primary (will need to add check for if completed)
                    : new Date(Object.keys(day)[0]).setHours(0, 0, 0, 0) < (new Date).setHours(0, 0, 0, 0)
                      ? "step-primary"
                      : day[Object.keys(day)[0]][0]
                        ? "step-error"
                        : ""
                  )
                }
                  data-content={(new Date(Object.keys(day)[0]).setHours(0, 0, 0, 0) == (new Date).setHours(0, 0, 0, 0)) ? "⭑"
                    : day[Object.keys(day)[0]][0]
                      ? "!"
                      : ""
                  }
                >
                  {Number(String((new Date(Object.keys(day)[0])).getMonth() + 1).padStart(2, '0')) + '/' + Number(String((new Date(Object.keys(day)[0])).getDate()).padStart(2, '0'))}
                  {day[Object.keys(day)[0]][0]
                    ? <div>{day[Object.keys(day)[0]]} Test</div>
                    : <div><br /></div>
                  }

                </li>
              )}
            </ul>
            <a href="/studysession" className="btn btn-primary mt-auto">Start Today's Studying</a>
          </div>
          {/* <div className="flex flex-col items-center bg-secondary col-span-4 rounded-xl h-80 text-primary-content text-3xl font-extrabold shadow-xl p-5" >
        <div className="mr-auto">Streak</div>
        2 days
      </div> */}
          {/* TODO: Add course. */}
          {/* Open the modal using ID.showModal() method */}
          <button className="btn flex btn-accent col-span-4 h-60 rounded-xl text-2xl shadow-xl" onClick={() => window.my_modal_1.showModal()}>+</button>
          <dialog id="my_modal_1" className="modal">
            <form method="dialog" className="modal-box">
              <h3 className="font-bold text-lg">Create New Course</h3>
              <div className="flex flex-col items-center pt-5">
                <input onChange={evt => setCourseName(evt.target.value)} value={courseName} type="text" placeholder="Course Name" className="input input-bordered w-full max-w-xs" />
              </div>
              <div className="modal-action">
                {/* if there is a button in form, it will close the modal */}
                <button onClick={() => {
                  axios.post("http://127.0.0.1:8000/create-course", { "email": localStorage.getItem('email'), "course": courseName }, {
                    "content-type": "multipart/form-data",
                  }).then((response) => {
                    console.log(response);
                  });
                  axios.post("http://localhost:8000/get-courses", {
                    "email": localStorage.getItem('email')
                  }).then(response => {
                    console.log(response.data);
                    setCourses(response.data);
                  });
                }} className="btn">Confirm</button>
                <button className="btn">Close</button>
              </div>
            </form>
          </dialog>
          {courses.map((course) =>
            <a href={"/mycourses/" + course.course} className="btn flex btn-accent col-span-4 h-60 rounded-xl text-2xl shadow-xl">
              {course.course}
            </a>
          )}
          <div id="modalBack">

          </div>
        </div>
      </>
    );
  }
}
export default Courses;
