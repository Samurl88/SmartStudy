import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  function login() {
    console.log(email);
    console.log(password);

    axios.post("http://localhost:8000/login", {
      email: email,
      password: password
    }).then(response => {
      console.log(response);
      if (response.data.message === "success") {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        toast.success("Logged In!");
        navigate("/mycourses");
      } else {
        toast.error("Invalid Credentials");
      }
    });
  }

  return (
    <div className="main flex flex-col items-center h-screen pb-[60] px-20 gap-y-7 m-10">
      <p className="text-5xl">Login</p>
      <div className="text-right p-10 shadow-2xl rounded-xl bg-gray-50 w-1/2">
        <div className="flex flex-col items-center content-center justify-center gap-y-5">
          <input value={email} onChange={evt => setEmail(evt.target.value)} type="text" placeholder="Email" className="input input-bordered w-full max-w-xs" />
          <input type="password" value={password} onChange={evt => setPassword(evt.target.value)} placeholder="Password" className="input input-bordered w-full max-w-xs" />
          <button className="btn btn-primary" onClick={login}>Login</button>
          <div className="text-small">
            <Link to="/register" className="text-sky-500">Or Register Instead</Link>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Login;
