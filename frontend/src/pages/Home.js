import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

import './home.css';

function Courses() {


    return (
        <div id='main' className="font-mono">
            <div className="drawer-content flex flex-col">
                {/* Navbar */}
                <div className="w-full navbar bg-primary text-primary-content">
                    <div className="flex-1 px-2 mx-2"></div>
                    <div className="flex-none hidden lg:block">
                        <ul className="menu menu-horizontal">
                            <li><Link to="/login">Log In</Link></li>
                            <li><Link to="/register">Register</Link></li>
                            <li><a>About</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div id='fillerThing' className="bg-primary h-96 pt-72"></div>
            <div id='topBar'>
                <h1 className="text-primary-content text-center pt-20">Introducing StudySmart</h1>
                <h2 className="text-primary-content text-center">
                    Elevating Learning with AI-Powered Flashcards and the Leitner Studying System
                </h2>
            </div>
            <svg className="fill-primary relative block" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
            </svg>
            <div className="flex flex-col items-center justify-center">
                <a className="btn btn-secondary" variant="contained" color="primary" href="/mycourses">Go to My Courses</a>
                <p className="font-medium text-base">Or <Link to="/login" className="text-sky-500">Login</Link> or <Link to="/register" className="text-sky-500">Register</Link></p>
            </div>
            <br />
            <div id="firstP" className="flex justify-evenly items-center">
                <p className="text-2xl">
                    StudySmart is revolutionizing the way you learn and retain information with its innovative combination of artificial intelligence and the proven Leitner studying system. Our product aims to make studying efficient, effective, and enjoyable, all while reducing the burden of memorization.
                </p>
                <img src="https://cdn-icons-png.flaticon.com/512/2753/2753156.png" />
            </div>
            <h2>"An investment in knowledge pays the best interest."</h2>
            <h3 id="name">-Benjamin Franklin</h3>
            <div className="flex justify-evenly items-center" id='secondP'>
                <img src='https://image.jimcdn.com/app/cms/image/transf/dimension=origxorig:format=png/path/s34c0b9e8de7eea18/image/i072ae9b8c6e4915d/version/1367682237/caja-de-tarjeta.png' />
                <p className="text-2xl">
                    StudySmart is a cutting-edge educational tool designed to help students and learners of all ages master new concepts, facts, and information. By utilizing AI technology, StudySmart generates personalized flashcards tailored to your specific learning needs. Whether you're preparing for exams, learning a new language, or enhancing your professional skills, StudySmart is your ideal study companion.
                </p>
            </div>
            <div className="flex justify-center">
                <div className="grid-cols-10 grid m-12 gap-10 place-content-center">
                    <div className="card" className="flex col-span-5 h-70 rounded-xl card w-96 text-primary-content border border-primary">
                        <div className="card-body">
                            <h2 className="card-title text-primary">The Leitner System</h2>
                            <p className='text-primary'>StudySmart employs the proven Leitner system, a method based on spaced repetition, to enhance memory retention. The system organizes flashcards into different boxes based on how well you remember each card. As you review the cards, StudySmart adapts to your progress and schedules future reviews accordingly.</p>
                        </div>
                    </div>
                    <div className="card" className="flex col-span-5 h-70 rounded-xl card w-96 text-primary-content border border-primary">
                        <div className="card-body">
                            <h2 className="card-title text-primary">AI-Powered Flashcards</h2>
                            <p className='text-primary'>Say goodbye to the tedious task of creating flashcards manually. StudySmart's AI algorithms analyze your learning materials and automatically generate interactive flashcards. This saves you valuable time and ensures that the most crucial information is covered.</p>
                        </div>
                    </div>
                    <div className="card" className="flex col-span-5 h-70 rounded-xl card w-96 text-primary-content border border-primary">
                        <div className="card-body">
                            <h2 className="card-title text-primary">Intuitive User Interface</h2>
                            <p className='text-primary'>StudySmart boasts a user-friendly interface that makes navigating through your flashcards a breeze. The sleek design ensures a seamless learning experience.</p>
                        </div>
                    </div>
                    <div className="card" className="flex col-span-5 h-70 rounded-xl card w-96 text-primary-content border border-primary">
                        <div className="card-body">
                            <h2 className="card-title text-primary">Personalized Study Schedule</h2>
                            <p className='text-primary'>StudySmart automatically creates an optimized schedule for maximum performance on your test day. </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Courses;
