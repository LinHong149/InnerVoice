# InnerVoice

InnerVoice is a multi-persona AI web app that speaks your mind—and opinions—back to you. Designed for the indecisive (or the simply curious), InnerVoice generates spoken responses from diverse AI personalities, letting users explore contrasting perspectives without typing a single word.

---

## ✨ Features

- **Eight AI Personas**  
  From The Practical Realist to The Creative Dreamer—each with unique takes on life.

- **Text-to-Speech (TTS) Output**  
  Powered by OpenAI’s TTS API to read responses aloud.

- **Speech-to-Text (STT) Input**  
  Speak instead of type, using OpenAI’s Whisper API.

- **Dynamic Conversations**  
  Watch different personalities debate topics in real time.

- **Responsive UI**  
  Built with modern frontend tools for a seamless experience on desktop and mobile.

---

## 🧰 Tech Stack

| Frontend | Backend | AI / APIs | Other Tools |
|----------|---------|-----------|-------------|
| ![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white) <br> ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) <br> ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white) <br> ![DaisyUI](https://img.shields.io/badge/DaisyUI-FF69B4?logo=daisyui&logoColor=white) <br> ![Figma](https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white) | ![Flask](https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white) <br> ![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white) | ![OpenAI](https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=white) <br> ![LangChain](https://img.shields.io/badge/LangChain-0F172A?logo=data&logoColor=white) <br> ![Whisper](https://img.shields.io/badge/Whisper-FFB6C1?logo=openai&logoColor=white) <br> ![TTS](https://img.shields.io/badge/TTS-4B5563?logo=speech&logoColor=white) | ![Postman](https://img.shields.io/badge/Postman-FF6C37?logo=postman&logoColor=white) <br> Virtual Python Environments |

---

## 🛠️ Installation

### Prerequisites

- Node.js (v18+)
- Python 3.9+
- OpenAI API Key

### Clone the Repository

```bash
git clone https://github.com/your-username/innervoice.git
cd innervoice
```

### Frontend Setup

cd frontend
npm install
npm run dev

### Backend Setup

cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py

Note: Add your OpenAI API keys to your .env files as required.


### Development Process

InnerVoice was built solo during a hackathon, involving:
* Design
* Rapid UI design in Figma, completed in under two hours for all screens and components.
* Focused on a minimal, visually engaging interface to emphasize the personalities’ voices.
* Frontend Development
* Built with Next.js and TypeScript.
* Styled using Tailwind CSS and DaisyUI for fast, consistent styling.
* Integrated seamlessly with backend APIs for speech-to-text and text-to-speech functions.
* Backend Development
* Developed using Flask in Python.
* Managed routing, API integration, and persona orchestration via LangChain.
* Tested and debugged endpoints extensively using Postman.


## Challenges & Resolutions

Challenge: Backend Complexity
* **Issue**:
Backend development was unfamiliar territory, especially implementing new APIs like TTS and Whisper with limited documentation.
* **Resolution**:
* Learned Flask from scratch, covering routing, GET vs POST requests, and environment management.
* Used Postman to test API payloads and troubleshoot endpoint issues.
* Researched community posts and OpenAI docs to piece together solutions.


### Challenge: API Integration (TTS & STT)
* **Issue**:
The new TTS API had sparse examples and minimal guides, making integration difficult under hackathon time constraints.
* **Resolution**:
 * Used Postman to understand API payloads and required parameters.
 * Built backend logic incrementally to connect Flask with OpenAI’s TTS endpoints.
 * Successfully integrated Whisper for speech-to-text, enabling voice input functionality.


### Challenge: Full-Stack Architecture
* **Issue**:
Managing communication between the frontend and backend while maintaining a fast, seamless UX.
* **Resolution**:
 * Organized frontend and backend as separate projects for clarity.
 * Implemented robust API calls with error handling and timeouts.
 * Secured environment variables and API keys properly.


## Lessons Learned
* Gained hands-on experience in solo full-stack development under time pressure.
* Learned backend fundamentals:
* Flask setup and routing.
* API endpoint creation and testing with Postman.
* Managing environment variables and handling CORS issues.
* Mastered new frontend tools like DaisyUI for faster UI development.
* Understood the complexities and power of integrating cutting-edge AI APIs.


## Future Plans
* Expand personas with richer personalities and specialized knowledge.
* Add emotional nuance to TTS for more expressive voice output.
* Incorporate memory for context-aware conversations.
* Explore applications for mental health support and virtual companionship.
