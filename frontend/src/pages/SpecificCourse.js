import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import "material-symbols";
import axios from "axios";
import ReactCardFlip from "react-card-flip";
import "../App.css";


function Courses() {

  let { course } = useParams();

  const [flashcards, setFlashcards] = useState([]);
  const [flip, setFlip] = useState(false);
  const [finished, setFinished] = useState(false);
  const [index, setIndex] = useState(1);
  const [currentBin, setCurrentBin] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fetchingData, setFetchingData] = useState(false);
  const [files, setFiles] = useState([]);

  const [testDate, setTestDate] = useState();
  const [newTestDate, setNewTestDate] = useState();


  useEffect(() => {
    if (course == undefined) {
      return;
    };

    setTestDate(null);
    setNewTestDate(null);
    setIndex(1);

    axios.post("http://localhost:8000/get-flashcards", {
      email: localStorage.getItem("email"),
      course: course,
    }).then(e => {
      setFlashcards(e.data);
    });

    axios.post("http://localhost:8000/get-test-date", {
      email: localStorage.getItem("email"),
      course: course,
    }).then(e => {
      try {
        if (e.data[0].test_date)
          setTestDate((new Date(e.data[0].test_date)).toLocaleDateString("en-US", {"timeZone": "UTC"}))
      } catch {console.log("no date")}
    });
  }, [course]);



  function updateTestDate() {
    if (newTestDate) {
      console.log(newTestDate)
      axios.post("http://localhost:8000/update-test-date", {
        email: localStorage.getItem("email"),
        course: course,
        newTestDate: new Date(newTestDate).toUTCString(),
      }).then(e => {
        setTestDate((new Date(newTestDate)).toLocaleDateString("en-US", {"timeZone": "UTC"}));
        console.log("Done!")
      });
    }
  }

  function getNextFlashcard() {
    setCurrentIndex(currentIndex + 1);
    if (currentIndex >= flashcards.length - 1) {
      setFinished(true);
      return;
    }
  }

  function correctAnswer() {
    getNextFlashcard();
    setFlip(false);
  }

  function incorrectAnswer() {
    getNextFlashcard();
    setFlip(false);
  }

  function submitFile() {
    console.log(files);
    let file = files[0];

    if (file) {
      let data = new FormData();
      data.append("file", file);
      console.log(data);
      setFetchingData(true);
      axios.post("http://127.0.0.1:8000/read", data, {
        "content-type": "multipart/form-data",
      }).then((response) => {
        console.log(response);
        console.log(response.data);
        let responseDataParsed = JSON.parse(response.data);
        for (const questionAndAnswer of responseDataParsed) {
          console.log(questionAndAnswer);
          axios.post("http://localhost:8000/add-flashcard", {
            email: localStorage.getItem("email"),
            course: course,
            question: questionAndAnswer.q,
            answer: questionAndAnswer.a,
          }).then(e => { });
        }
        setFlashcards([responseDataParsed]);
        setFetchingData(false);
      });
    }
  }

  return (
    <>
      <div className="main flex items-center flex-col h-screen w-full">
        <div className="flex flex-col pb-[60] px-20 gap-y-8 w-full m-10">
          <div className="text-5xl">{course}</div>
          
          <div className="flex space-x-3 items-center pb-8">
            <div className="text-2xl">Your next test date:</div>
            {testDate ? 
              <div className="text-2xl">{testDate}</div>
              :
              <div className="join">
                <input onChange={evt => setNewTestDate(evt.target.value)} value={ newTestDate } type="date" placeholder="Enter Date" className="text-2xl input input-sm input-bordered join-item"/>
                <button onClick={() => updateTestDate()} class="btn btn-primary btn-sm join-item">Save</button>
              </div>
            }
          </div>

          <div className="flex flex-row self-center">
            <div className="tabs tabs-boxed flex-grow">
              <a onClick={() => setIndex(0)} className={"tab" + (index === 0 ? " tab-active" : "")}>Upload</a>
              <a onClick={() => setIndex(1)} className={"tab" + (index === 1 ? " tab-active" : "")}>Flashcards</a>
              <a onClick={() => setIndex(2)} className={"tab" + (index === 2 ? " tab-active" : "")}>Practice Test</a>
            </div>
          </div>
          <div className="flex flex-col justify-center content-center items-center">
            {index === 0 ?
              <>
                <label id="styled_file_input_ui"
                  className="flex justify-center w-7/12 h-32 px-4 transition bg-white dark:bg-slate-800 border-2 border-gray-300 border-dashed rounded-2xl appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
                  onDragOver={e => e.preventDefault()} onDrop={e => e.preventDefault()} onChange={e => {
                    setFiles(e.target.files);
                  }}>
                  <div className="flex items-center justify-center flex-col space-x-2 space-y-2">
                    <span className="flex items-center text-gray-600 dark:text-white">
                      <span className="material-symbols-outlined w-6 h-6">cloud_upload</span>
                      <span className="font-medium">
                        Drop a file to attach, or&nbsp;
                        <span className="text-blue-600 underline">browse</span>
                      </span>
                    </span>
                    <p className="dark:text-white font-medium text-base" id="file_display_area">{files.length === 0 ? "No file chosen" : files[0].name}</p>
                  </div>
                  <input type="file" name="file_upload" className="hidden" accept="application/pdf,image/*" />
                </label>
                {fetchingData ? <span className="loading loading-bars loading-lg"></span> : null}
                <div className="pt-5">
                  <button id="make_flashcards" className="btn btn-success" disabled={files.length === 0 || fetchingData} onClick={submitFile}>Make Flashcards</button>
                </div>
              </>
              : null}
            {index === 1 ?
              <div className="Course-selection-div">
                {flashcards && flashcards.length > 0 ?
                  finished ? 
                  <div className="flex flex-col items-center">
                    <h1 className="text-5xl pb-5">Finished</h1>
                    <button onClick={() => { 
                      setCurrentIndex(0);
                      setFinished(false);
                      }
                    } style={{ fontSize: 20 }} variant="text" className="btn btn-success">
                      <span className="material-symbols-outlined pr-4">replay</span>
                      Restart Studying
                    </button>
                  </div> 

                  : <div className="flex flex-col items-center justify-center">
                    <ReactCardFlip isFlipped={flip}
                      flipDirection="vertical">
                      <div className="text-center rounded-3xl px-4 w-[32rem] bg-gray-100 h-60 shadow-xl flex flex-col items-center content-center justify-center">
                        <p className="text-2xl">Question</p>
                        {flashcards[currentIndex].question}
                      </div>
                      <div className="text-center rounded-3xl w-[32rem] px-4 bg-gray-100 h-60 shadow-xl flex flex-col items-center content-center justify-center">
                        <p className="text-2xl">Answer</p>
                        {flashcards[currentIndex].answer}
                      </div>
                    </ReactCardFlip>
                    <br />
                    <div className="flex flex-row items-center gap-5 justify-center">
                      <button onClick={() => incorrectAnswer()} className="btn btn-error" variant="contained" color="primary"><span className="material-symbols-outlined">close</span>Incorrect</button>
                      <button onClick={() => setFlip(!flip)} className="btn btn-primary" variant="contained" color="primary"><span className="material-symbols-outlined">flip</span>Flip Card</button>
                      <button onClick={() => correctAnswer()} className="btn btn-success" variant="contained" color="primary"><span className="material-symbols-outlined">done</span> Correct</button>
                    </div>
                  </div>
                  : <div><br /><p>Click on the "Upload" tab to begin!</p></div>}
              </div> : null
            }

            {index === 2 ?
              <div className="Course-selection-div">
                <div className="Subtitle">
                  Practice test here!
                </div>
              </div>
              : null}
          </div>
        </div>

      </div>
    </>
  );
}

export default Courses;
