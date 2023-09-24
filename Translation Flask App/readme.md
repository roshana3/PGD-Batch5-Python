# Translation Flask Web App

This Flask-based web application allows users to perform various speech and text translation tasks, including Speech to Speech Translation, Speech to Text Translation, Text to Text Translation, Text to Speech Translation, and Automatic Speech Recognition (ASR).


### Prerequisites

Before you can run the application, make sure you have the following prerequisites installed:

- [Python](https://www.python.org/downloads/) (version 3.x recommended)


 The app.py file contains the information relevant to convert audio to text and vice versa
 The app.js logical work when perform action on html

**app.py**

The entry point to the application, wsgi.py

**wsgi.py**

```
from app import app
if __name__ == "__main__":
  app.run()
```

We can  run the application in our local system

```
% python wsgi.py
```

and verify that it works locally

This has the following requirements.txt 

```
Flask==2.0.1
SpeechRecognition==3.8.1
googletrans==4.0.0rc1
gtts==2.3.
pydub==0.25.1
pyaudio==0.2.13
```

we requiere a  **runtime.txt** file for supportted python version

```
python-3.11.3
```


**Congratulation!** You were able to create a web app that can convert your audio to text

