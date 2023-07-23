import os
import json
import datetime

import PyPDF2
import cv2
import numpy as np
import pytesseract
from PIL import Image
from bson import json_util
from dateutil import parser
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS

load_dotenv()

from generate_content import get_flashcards_from_textbook, get_test_from_textbook


app = Flask(__name__)
app.config["MONGO_URI"] = os.environ["MONGO_URI"]
mongo = PyMongo(app)
db = mongo.cx["dev"]
CORS(app)


# Returns "hi". Quintessential feature of program.
@app.route("/")
def index():
    return "hi"


# Attempts to log user in.
@app.route("/login", methods=["POST"])
def login():
    email = request.json["email"]
    password = request.json["password"]

    if db.users.find_one({"email": email, "password": password}):
        return jsonify({"message": "success"})

    return jsonify({"message": "invalid credentials"})


# Attempts to register new user.
@app.route("/register", methods=["POST"])
def register():
    email = request.json["email"]
    password = request.json["password"]

    if db.users.find_one({"email": email}):
        return jsonify({"message": "user already exists"})

    db.users.insert_one({"email": email, "password": password})
    return jsonify({"message": "success"})


# Adds a pratice test to course of user.
@app.route("/add-practice-test", methods=["POST"])
def add_practice_test():
    email = request.json["email"]
    course = request.json["course"]
    test = json.loads(request.json["test"])

    db.flashcards.insert_one({"email": email, "course": course, "test": test})
    return jsonify({"message": "success"})


# Adds flashcards to user's course.
@app.route("/add-flashcard", methods=["POST"])
def add_flashcard():
    email = request.json["email"]
    course = request.json["course"]
    question = request.json["question"]
    answer = request.json["answer"]

    db.flashcards.insert_one(
        {
            "email": email,
            "question": question,
            "answer": answer,
            "course": course,
            "bin": 1,
            "last_reviewed": "",
        }
    )
    return jsonify({"message": "success"})


# Sets given flashcard to an indicated bin.
@app.route("/move-flashcard-to-bin", methods=["POST"])
def move_flashcard_to_bin():
    email = request.json["email"]
    course = request.json["course"]
    question = request.json["question"]
    new_bin = int(request.json["bin"])

    db.flashcards.update_one(
        {"email": email, "question": question, "course": course},
        {"$set": {"bin": new_bin}},
    )

    return jsonify({"message": "success"})


# Updates time when a certain flashcard was reviewed last.
@app.route("/flashcard-last-reviewed", methods=["POST"])
def flashcard_last_reviewed():
    print(request.json)
    email = request.json["email"]
    course = request.json["course"]
    question = request.json["question"]
    last_reviewed = parser.parse(int(request.json["last_reviewed"]))

    db.flashcards.update_one(
        {"email": email, "question": question, "course": course},
        {"$set": {"last_reviewed": last_reviewed}},
    )

    db.days_reviewed.insert_one({
        "date": last_reviewed,
        "email": email,
    })

    return jsonify({"message": "success"})


# Returns flashcards for a given course.
@app.route("/get-flashcards", methods=["POST"])
def get_flashcards():
    print(request.json)
    email = request.json["email"]
    course = request.json["course"]

    return jsonify(
        json.loads(
            json_util.dumps(db.flashcards.find({"email": email, "course": course}))
        )
    )


# Returns flashcards reviewed on date.
@app.route("/flashcards-reviewed-on", methods=["POST"])
def reviewed_on():
    email = request.json["email"]
    date = parser.parse(request.json["date"])

    if db.days_reviewed.find_one({"email": email, "date": date}):
        return True

    return False


# Creates a course for a user.
@app.route("/create-course", methods=["POST"])
def create_course():
    email = request.json["email"]
    course = request.json["course"]

    db.courses.insert_one({"email": email, "course": course})
    return jsonify({"message": "success"})


# Returns user's courses.
@app.route("/get-courses", methods=["POST"])
def get_courses():
    email = request.json["email"]

    return jsonify(json.loads(json_util.dumps(db.courses.find({"email": email}))))


# Deletes course from mongoDB.
@app.route("/delete-course", methods=["POST"])
def delete_course():
    email = request.json["email"]
    course = request.json["course"]

    db.courses.delete_one({"email": email, "course": course})
    db.flashcards.delete_many({"email": email, "course": course})

    return jsonify({"message": "success"})


#
@app.route("/update-test-date", methods=["POST"])
def update_test_date():
    email = request.json["email"]
    course = request.json["course"]
    date = request.json["newTestDate"]

    db.courses.update_one(
        {"email": email, "course": course}, {"$set": {"test_date": date}}
    )

    return jsonify({"message": "success"})


# Read upload file. Returns flashcards.
@app.route("/read", methods=["POST", "GET"])
def read_pdf():
    # Get the uploaded PDF file
    try:
        print(request.files["file"])
        if "pdf" not in str(request.files["file"]):
            file = request.files["file"].read()

            nparr = np.frombuffer(file, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            # convert to grayscale image
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

            # checking whether thresh or blur]
            cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
            cv2.medianBlur(gray, 3)

            textbook = pytesseract.image_to_string(Image.fromarray(gray))
            flashcards = get_flashcards_from_textbook(textbook)
            test = get_test_from_textbook(textbook)
            # test_dict = {"email": }
            # db.practice_tests.insert_one(test)
            return jsonify(flashcards)
            # reader = easyocr.Reader(['en'])
            # result = reader.readtext(file.read(), detail=0)
            # print(result)
            # return str(result)
        else:
            pdf = request.files["file"]
            start_page = 1  # int(request.form["start_page"]) - 1
            end_page = 2  # int(request.form["end_page"]) - 1
            # return "text"
            if start_page < 0 or start_page > end_page:
                return "Invalid start page"

            # Open the PDF file using PyPDF2
            # return "text"
            pdf_reader = PyPDF2.PdfReader(pdf)
            # return "text"
            # Read the text from each page of the PDF file
            # return "text"
            text = ""
            bold_words = []
            # return "text"
            for i in range(start_page, end_page + 1):
                page = pdf_reader.pages[i]
                page_text = page.extract_text()
                text += page_text + "\n"

                # Find bolded words in the page text
                for word in page_text.split():
                    if word.startswith("<b>") and word.endswith("</b>"):
                        bold_words.append(word[3:-4])

            textbook = str(text)
            result = get_flashcards_from_textbook(textbook)
            return jsonify(result)
    except Exception as e:
        print(e)
        return str(e)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
