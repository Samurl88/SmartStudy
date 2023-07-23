import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import ReactCardFlip from "react-card-flip";
import axios from 'axios';
import 'material-symbols';
import "./courses.css";

function StudySession() {
  const [courses, setCourses] = useState(null);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [flashcards, setFlashcards] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flip, setFlip] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    axios.post("http://localhost:8000/get-courses", {
      email: localStorage.getItem("email"),
    }).then(response => {
      console.log(response);
      setCourses(response.data);
    });
  }, []);

  useEffect(() => {
    if (courses === null) return;
    axios.post("http://localhost:8000/get-flashcards", {
      email: localStorage.getItem("email"),
      course: courses[currentCourseIndex].course,
    }).then(e => {
      setFlashcards(e.data);
    });
  }, [courses]);

  function getNextFlashcard() {
    setCurrentCardIndex(currentCardIndex + 1);
    if (currentCardIndex >= flashcards.length - 1) {
      setFinished(true);
      return;
    }
  }

  function correctAnswer() {
    setLastReviewed(flashcards[currentCardIndex].question);
    if (flashcards[currentCardIndex].bin !== 3) {
      moveFlashcardtoBin(flashcards[currentCardIndex].question, flashcards[currentCardIndex].bin + 1);
    }

    getNextFlashcard();
    setFlip(false);
  }

  function incorrectAnswer() {
    moveFlashcardtoBin(flashcards[currentCardIndex].question, 1);
    setLastReviewed(flashcards[currentCardIndex].question);

    getNextFlashcard();
    setFlip(false);
  }

  function moveFlashcardtoBin(question, bin) {
    axios.post("http://localhost:8000/move-flashcard-to-bin", {
      email: localStorage.getItem("email"),
      course: courses[currentCourseIndex].course,
      question: question,
      bin: bin,
    }).then(e=>{});
  }

  function setLastReviewed(question) {
    axios.post("http://localhost:8000/flashcard-last-reviewed", {
      email: localStorage.getItem("email"),
      course: courses[currentCourseIndex].course,
      question: question,
      last_reviewed: new Date().toISOString()
    });
  }

  function getFlashcardsInBin(bin) {
    return flashcards.filter((flashcard) => flashcard.bin === bin);
  }

  return (
    <>
      {courses === null ?
        <div className="flex flex-col items-center content-center justify-center h-screen">
          <CircularProgress />
        </div>:
        <div>
          <div className="w-full h-12 bg-primary text-primary-content flex flex-row items-center">
            <a href="/mycourses" className="px-2 mx-2 flex-grow text-xl">SmartStudy</a>
            <div className="font-bold text-xl bg-secondary rounded-lg p-0.5 mr-5 px-2">{courses[currentCourseIndex].course}</div>
            <progress className="progress progress-accent w-5/12" value={flashcards == null ? 0 : (currentCardIndex / flashcards.length * 100)} max="100" />
            <div className="font-bold text-xl bg-secondary rounded-lg p-0.5 ml-5 px-2">{currentCardIndex}/{flashcards == null ? "" : flashcards.length}</div>
            <div className="px-2 mx-2 flex-grow"></div>
            <div className="flex-none">
              <ul className="menu menu-horizontal px-1">
                <li>
                  <details>
                    <summary className="text-xl px-10">
                      Options
                    </summary>
                    <ul className="text-xl text-primary-content p-2 bg-primary">
                      <li><button className="btn-primary">Skip Class</button></li>
                      {/* <li><button>Skip Class</button></li> */}
                    </ul>
                  </details>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center content-center justify-center w-full pt-20">
            {flashcards == null ? 
              <div className="flex flex-col items-center content-center justify-center">
                <CircularProgress />
              </div> :
              currentCardIndex == flashcards.length ? <div className="text-center">
                <p>You have finished studying this class!</p>
                <p>Would you like to move onto the next one?</p>
                <div className="flex flex-row items-center gap-5">
                  <button className="btn btn-primary" variant="contained" color="primary"><span className="material-symbols-outlined">done</span>Yes</button>
                  <Link to="/mycourses"><button className="btn btn-primary" variant="contained" color="primary"><span className="material-symbols-outlined">keyboard_return</span>Go Back to My Courses</button></Link>
                </div>
              </div> : <>
                <ReactCardFlip containerClassName="w-full" isFlipped={flip}
                  flipDirection="vertical">
                  <div onClick={() => setFlip(!flip)} className="flex flex-col items-center content-center justify-center">
                    <div className="text-center rounded-3xl px-4 w-1/2 bg-gray-100 h-60 shadow-xl flex flex-col items-center content-center justify-center">
                      <p className="text-2xl">Question</p>
                      {flashcards[currentCardIndex].question}
                    </div>
                  </div>
                  <div onClick={() => setFlip(!flip)} className="flex flex-col items-center content-center justify-center">
                    <div className="text-center rounded-3xl w-1/2 px-4 bg-gray-100 h-60 shadow-xl flex flex-col items-center content-center justify-center">
                      <p className="text-2xl">Answer</p>
                      {flip ? flashcards[currentCardIndex].answer: ""}
                    </div>
                  </div>
                </ReactCardFlip>
                <br />
                <div className="flex flex-row items-center gap-5">
                  <button onClick={() => incorrectAnswer()} className="btn btn-primary" variant="contained" color="primary"><span className="material-symbols-outlined">close</span>Incorrect</button>
                  <button onClick={() => setFlip(!flip)} className="btn btn-primary" variant="contained" color="primary"><span className="material-symbols-outlined">flip</span>Flip Card</button>
                  <button onClick={() => correctAnswer()} className="btn btn-primary" variant="contained" color="primary"><span className="material-symbols-outlined">done</span> Correct</button>
                </div>
              </>
            }
          </div>
        </div>
      }
    </>
  );
}

export default StudySession;