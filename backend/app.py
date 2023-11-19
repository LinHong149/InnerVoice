from flask import Flask, request, jsonify, send_from_directory, Response
from flask_cors import CORS
import whisper
import openai
from pathlib import Path
from io import BytesIO

import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify(
        {"message": "Hello World"}
    )

@app.route('/api/transcribe', methods=['POST'])
def transcribe_audio():
    # return jsonify({
    #     "transcription": "text"
    # })
    if 'file' not in request.files:
        return "No file part", 400

    file = request.files['file']

    if file.filename == '':
        return "No selected file", 400

    if file:
        # Save the file temporarily
        file_path = "temp_audio.ogg"
        file.save(file_path)

        # Load your model and transcribe the audio
        model = whisper.load_model("base")
        result = model.transcribe(file_path)
        return jsonify({
            "transcription": result['text']
        })

    # return "Error processing file", 500
@app.route('/generate-speech', methods=['POST'])
def generate_speech():
    try:
        data = request.json
        input_text = data.get('text', "Sorry, I couldn't catchthat, please try again")
        voice = data.get('voice', 'alloy')
        response = openai.audio.speech.create(
            model="tts-1",
            voice=voice,
            input=input_text,
        )

        audio_data = response.content  # or response.raw.read(), depending on the API

        return Response(audio_data, mimetype='audio/mpeg')
    except Exception as e:
        return jsonify(error=str(e)), 500


if __name__ == '__main__':
    app.run(debug=True, port=8080)
