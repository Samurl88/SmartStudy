import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import 'material-symbols';
import "./courses.css";
import axios from 'axios';
import dayjs from 'dayjs';

function Courses() {
  const [courseName, setCourseName] = useState("");
  const [courses, setCourses] = useState([]);
  const [days, setDays] = useState();

  useEffect(() => {
    axios.post("http://localhost:8000/get-courses", {
      "email": localStorage.getItem('email')
    }).then(response => {
      console.log(response.data);
      setCourses(response.data);
    })
  }, []);

  // Gets days (as Date objects) of current week.
  useEffect(() => {
    const daysList = []
    var startOfWeek = dayjs().startOf("week");
    for (var i = 0; i < 7; i++) {
      var day = startOfWeek.day(i).toDate();
      daysList.push(day);
    }
    setDays(daysList);
    console.log(days);

  }, []);


  if (!days){
    return(
      <>Div</>
    )
  } else {
  return (
    <div className="grid-cols-12 grid m-12 gap-10">
      <div className="flex flex-col align-items bg-secondary col-span-8 rounded-xl h-80 text-primary-content font-extrabold shadow-xl p-5" >
        <div className="mr-auto text-2xl">Your schedule</div>
        <ul className="steps mt-auto">
          {/* <li className="step step-primary" data-content="">{getDay(0)}<br /><br /></li>
          <li className="step step-primary" data-content="">{getDay(1)}<br /><br /></li>
          <li className="step step-accent" data-content="★">{getDay(2)}<br />30 mins today!</li>
          <li className="step" data-content="">{getDay(3)}<br /><br /></li>
          <li className="step" data-content="">{getDay(4)}<br /><br /></li>
          <li className="step step-error" data-content="🗎">{getDay(5)}<br />Calculus Test</li>
          <li className="step" data-content="">{getDay(6)}<br /><br /></li> */}

          {days.map((day) => 
            <li className={"step " + 
              (day.setHours(0, 0, 0, 0) == (new Date).setHours(0, 0, 0, 0) ? "step-accent" : "step-primary")
            }>
              {Number(String(day.getMonth() + 1).padStart(2, '0')) + '/' + Number(String(day.getDate()).padStart(2, '0'))}
            </li>
          )}
        </ul>
        <a href="/studysession" className="btn btn-primary mt-auto">Start Today's Studying</a>
      </div>
      <div className="flex flex-col items-center bg-secondary col-span-4 rounded-xl h-80 text-primary-content text-3xl font-extrabold shadow-xl p-5" >
        <div className="mr-auto">Streak</div>
        2 days
      </div>
      {/* TODO: Add course. */}
      {/* Open the modal using ID.showModal() method */}
      <button className="btn flex btn-accent col-span-4 h-60 rounded-xl text-2xl shadow-xl" onClick={() => window.my_modal_1.showModal()}>+</button>
      <dialog id="my_modal_1" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Create New Course</h3>
          <div className="flex flex-col items-center pt-5">
            <input onChange={evt => setCourseName(evt.target.value)} value={ courseName } type="text" placeholder="Course Name" className="input input-bordered w-full max-w-xs" />
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
    
  );
}
}
export default Courses;
