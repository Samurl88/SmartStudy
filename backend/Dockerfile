FROM python:3.9-slim-buster

RUN apt-get update && \
    apt-get -qq -y install tesseract-ocr && \
    apt-get -qq -y install libtesseract-dev && \
    apt-get -qq -y install python3-dev && \
    apt-get -qq -y install build-essential && \
    apt-get -qq -y install ffmpeg && \
    apt-get -qq -y install libsm6 && \
    apt-get -qq -y install libxext6

WORKDIR /backend

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

CMD ["gunicorn", "app:app"]
