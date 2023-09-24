from flask import Flask, render_template, request,jsonify
import speech_recognition as sr
from googletrans import Translator, LANGUAGES
from gtts import gTTS
from pydub import AudioSegment
from globalFunctions import unique_filename, uploadedFilePath, empty_folder
import pyaudio
import threading
import wave
import os
import time

app = Flask(__name__, static_folder='static')

TRANS_AUDIO_DIR = './static/audio/'
UPLOAD_AUDIO_DIR = './static/upload/'
REC_AUDIO_FILE = unique_filename(UPLOAD_AUDIO_DIR, ".wav")

recording = False

# Supported languages
supported_languages = {
    'en': 'English',
    'ur': 'Urdu',
    'es': 'Spanish',
    'fr': 'French',
    'ar': 'Arabic',
}

# Supported Conversion
supported_task = {
    '1': 'S2ST (Speech to Speech Translation)',
    '2': 'S2TT (Speech to text Translation)',
    '3': 'T2ST (text to Text Translation)',
    '4': 'T2TT (Text to Speech Translation)',
    '5': 'ASR (Automatic Speech Recognition)',
}

#rneder home page
@app.route('/')
def index():
    return render_template('index.html',task=supported_task, languages=supported_languages)

#Text Input
@app.route('/txtInput', methods=['POST', 'GET'])
def translation():
    if request.method == "POST":
        data = request.get_json()
        print("req data:", data)
        target_language = data['target_language']
        input_text = data['input_text']
        selected_task = data['selected_task']

        # Text translation
        txt_translation = translate_text(input_text, target_language)        
        if selected_task == "3":  
            # Convert the translated text to speech
            file_path = text_to_speech(txt_translation, target_language)
            response_data = {'message': 'Success', "output": txt_translation, "input_text": input_text,
                             "file_path": file_path}
        else:
            response_data = {'message': 'Success', "output": txt_translation, "input_text": input_text}
        #print("response_data: ", response_data)
        return jsonify(response_data)
           
    return jsonify("")

#Speech/Audio Input
@app.route('/voiceInput', methods=['POST'])
def convert():
   if request.method == "POST":
        data = request.get_json()
        print("req data:", data)
        target_language = data['target_language']
        selected_task = data['selected_task']

        # Get audio 
        audio_file_path = uploadedFilePath(UPLOAD_AUDIO_DIR)
        # convert audio into text 
        recognized_text = speech_to_text(audio_file_path)

        if recognized_text:
            # Translate the recognized text to the target language
            txt_translation = translate_text(recognized_text, target_language)
        
        if selected_task == "2" or selected_task == "5" :  
            response_data = {'message': 'Success', "output": txt_translation}
        else:
            # Convert the translated text to speech
            file_path = text_to_speech(txt_translation, target_language)
            response_data = {'message': 'Success', "output": txt_translation,"file_path": file_path}
        print("response_data: ", response_data)
        return jsonify(response_data)
    
   return jsonify("")

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part'

    file = request.files['file']

    if file.filename == '':
        return 'No selected file'

    empty_folder(UPLOAD_AUDIO_DIR)
    # Save the uploaded file to the specified folder
    file_path = os.path.join(UPLOAD_AUDIO_DIR, file.filename)
    file.save(file_path)
    return jsonify({'message': 'Success',"file_path": file_path}) 

# Trnalator
def translate_text(text,target_lang):
    # src=source_lang
    translator = Translator()
    translated = translator.translate(text, dest=target_lang)
    return translated.text

# text-to-Speech
def text_to_speech(text, target_lang):
    tts = gTTS(text=text, lang=target_lang, slow=False)
    # usage:
    file_path = unique_filename(TRANS_AUDIO_DIR, ".mp3")
    tts.save(file_path)
    return file_path

# Speech-to-text
def speech_to_text(audio_file_path):
    # Initialize the recognizer
    recognizer = sr.Recognizer()
  
    # Load the audio file and convert it to PCM WAV format
    try:
        audio = AudioSegment.from_file(audio_file_path)
        audio.export("temp.wav", format="wav")  # Convert to WAV
        with sr.AudioFile("temp.wav") as source:
            audio_data = recognizer.record(source)

        # Recognize the speech using Google Web Speech API
        text = recognizer.recognize_google(audio_data)
        return text
    except sr.UnknownValueError:
        print("Google Web Speech API could not understand the audio")
    except sr.RequestError as e:
        print(f"Could not request results from Google Web Speech API; {e}")
    finally:
    #     # Clean up temporary WAV file
         os.remove("temp.wav")


def record_audio():
    global recording, audio_frames
    audio_frames = []
    
    # Initialize audio recording
    p = pyaudio.PyAudio()
    stream = p.open(format=pyaudio.paInt16, channels=1, rate=44100, input=True, frames_per_buffer=1024)

    recording = True
    print("Recording...")

    while recording:
        audio_data = stream.read(1024)
        audio_frames.append(audio_data)

    print("Finished recording.")
    stream.stop_stream()
    stream.close()
    p.terminate()
     # Save audio data to a WAV file
    empty_folder(UPLOAD_AUDIO_DIR)
    with wave.open(REC_AUDIO_FILE, 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(p.get_sample_size(pyaudio.paInt16))
        wf.setframerate(44100)
        wf.writeframes(b''.join(audio_frames))
        # empty_folder(UPLOAD_AUDIO_DIR)


@app.route('/start_record', methods=['POST'])
def start_record():
    global recording
    if not recording:
        recording_thread = threading.Thread(target=record_audio)
        recording_thread.start()
        return jsonify(message='Recording started')
    
    return jsonify(message='Recording is already in progress')


@app.route('/stop_record', methods=['POST'])
def stop_record():
    global recording
    if recording:
        recording = False
        time.sleep(10)
        return jsonify({'message': 'Success',"file_path": REC_AUDIO_FILE}) 
    
    return jsonify(message='No recording in progress')


@app.route('/remove_upload', methods=['POST'])
def removeFiles():
    empty_folder(UPLOAD_AUDIO_DIR)
    return jsonify({'message': 'Success'}) 

if __name__ == '__main__':
    app.run(debug=True)


