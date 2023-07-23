import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './home.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const nagivate = useNavigate();

  function register() {
    console.log(email);
    console.log(password);

    axios.post("http://localhost:8000/register", {
      email: email,
      password: password
    }).then(response => {
      console.log(response);
      console.log(response.data);
      if (response.data.message === "success") {
        toast.success("Successfully registered!");
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        nagivate("/mycourses");
      } else {
        toast.error("Registration failed! Username or password already exists.");
      }
    });
  }

  return (
    <div className="main flex flex-col items-center h-screen pb-[60] px-20 gap-y-7 m-10">
      <p className="text-5xl">Register</p>
      <div className="text-right p-10 shadow-2xl rounded-xl bg-gray-50 w-1/2">
        <div className="flex flex-col items-center content-center justify-center gap-y-5">
          <input value={email} onChange={evt => setEmail(evt.target.value)} type="text" placeholder="Email" className="input input-bordered w-full max-w-xs" />
          <input type="password" value={password} onChange={evt => setPassword(evt.target.value)} placeholder="Password" className="input input-bordered w-full max-w-xs" />
          <button className="btn btn-primary" onClick={register}>Register</button>
          <div className="text-small">
            <Link to="/login" className="text-sky-500">Or Login Instead</Link>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
    // <>
    //   <div className="flex flex-col items-center content-center justify-center">
    //     <h1>Register</h1>
    //     <div className="text-right p-10 shadow-2xl rounded-xl">
    //       <div className="flex flex-col items-center content-center justify-center">
    //         <input value={email} onChange={evt => setEmail(evt.target.value)} type="text" placeholder="email" className="input input-bordered w-full max-w-xs" />
    //         <br />
    //         <input type="password" value={password} onChange={evt => setPassword(evt.target.value)} placeholder="Password" className="input input-bordered w-full max-w-xs" />
    //         <br />
    //         <button className="btn btn-primary" onClick={register}>register</button>
    //         <br />
    //         <div className="text-small">
    //           <Link to="/login" className="text-sky-500">Or Login Instead</Link>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   <ToastContainer />
    // </>
  );
}

export default Register;
