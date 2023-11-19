'use client';
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { OpenAI as LangChainOpenAI } from "langchain/llms/openai";
import { PERSONALITIES } from './constant'; // Make sure the file name is correct
import axios from 'axios';
// import fs from 'fs';
// import path from 'path';
// import OpenAI from 'openai';

import * as dotenv from "dotenv";
dotenv.config();


// const openai = new OpenAI(
//   process.env.OPENAI_API_KEY
// );
// const speechFile = path.resolve("./speech.mp3")




export default function Home() {
  
  const [drawerOpen, setDrawerOpen] = useState(true)

  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [animals, setAnimals] = useState({
    'koala': true,
    'bee': true,
    'owl': true,
    'parrot': true,
    'penguin': true,
    'axolotl': true,
    'cat': true,
    'raccoon': true,
  });
  const [tempUserMessage, setTempUserMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [lastMessage, setLastMessage] = useState('');

  const [audioData, setAudioData] = useState(null);
  const [ttsAudio, setTtsAudio] = useState(null);
  const mediaRecorderRef = useRef(null);
  const [messageHistory, setMessageHistory] = useState([]);
  const [timer, setTimer] = useState(null);
  const [messageTTS, setMessageTTS] = useState('');
  const [audioSrc, setAudioSrc] = useState(null);
  const audioRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [animalVoice, setAnimalVoice] = useState({
    "The Timid Goody-Two-Shoes": "nova",
    "The Creative Dreamer": "shimmer",
    "The Supportive Best Friend": "alloy",
    "The Charismatic Leader": "fable",
    "The Analytical Thinker": "nova",
    "The Witty Humorist": "onyx",
    "The Practical Realist": "alloy",
    "The Daring Devil's Advocate": "echo"
  });


  // TTS
  const handleTTS = async (messageTTS, voice) => {
    try {
      const response = await axios.post('http://localhost:8080/generate-speech', 
      { text: messageTTS, voice: voice }, 
      { responseType: 'blob' });
      const audioBlobUrl = URL.createObjectURL(response.data);
      setAudioSrc(audioBlobUrl);
  } catch (error) {
      console.error('Error:', error);
      setTtsAudio(null);
  }
  };
  useEffect(() => {
    // Play audio only when audioSrc changes and it's not null
    if (audioSrc && audioRef.current) {
        audioRef.current.src = audioSrc;
        audioRef.current.play();
    }
}, [audioSrc]); 

  const storeLastMessage = (message) => {
    setLastMessage(message);
  }

  // Handles text input from user
  const handleInputChange = (input) => {
    setTempUserMessage(input.target.value);
  };
  const handleSubmit = () => {
    if (tempUserMessage === '') return;
    setUserMessage(tempUserMessage);
    setLastMessage(tempUserMessage);
    updateMessageHistory('You', tempUserMessage);
    setTempUserMessage('')
    console.log("Message stored:", tempUserMessage); // Example action
  };
  const handleKeyPress = (button) => {
    if (button.key === 'Enter') {
      button.preventDefault(); 
      handleSubmit();
    }
  };

  const handleSelectAnimal = (animal) => {
    console.log('clickedSelections', animal);
    if (animals[animal]) {
      setAnimals({...animals, [animal]: false});
    } else {
      setAnimals({...animals, [animal]: true});
    }
    console.log(animals);
  }

  const updateMessageHistory = (title, message) => {
    const messageEntry = new Map();
    messageEntry.set('title', title);
    messageEntry.set('message', message);

    // Update the state with the new entry
    setMessageHistory(prevHistory => [...prevHistory, messageEntry]);

    console.log(messageHistory)
    // console.log(title, String(messageHistory.get(title)));
  }

  const runAI = async (title, personality) => {
    const model = new LangChainOpenAI({ temperature: 0.7, maxTokens: 200, openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });
    //Calls out to the model's (OpenAI's) endpoint passing the prompt. This call returns a string
    const res = await model.call(
      "You are a " + personality + " friend who offers advice, opinions, and suggestion based on whay you think. Your friend's concern is: " +
      userMessage + "/n" +
      "Based on the previous response: " + lastMessage + "answer with a " + personality + " bias. Use emojis rarely."
    );
    console.log({ res });
    storeLastMessage(res);
    updateMessageHistory(title, res);
    handleTTS(res, animalVoice[title]);
  };


  // STT
  async function sendAudioToServer(audio) {
    const formData = new FormData();
    formData.append('file', audio);
    console.log('Sending audio to server', audio)

    try {
      const response = await fetch('http://localhost:8080/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      console.log('Sending audio to server pt2')
    
      if (response.ok) {
        const data = await response.json();
        console.log("Success", data.transcription);
        setUserMessage(data.transcription)
        setLastMessage(data.transcription)
        updateMessageHistory('You', data.transcription);
        return data.transcribedText; // The transcribed text returned from the server
      } else {
        // Handle errors
        console.error('Server responded with an error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error sending audio to server", error)
    }
  }

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        if (!mediaRecorderRef.current) {
          const recorder = new MediaRecorder(stream);
          recorder.ondataavailable = async (event) => {
            setAudioData(event.data);
            if (event.data.size > 0) {
              await sendAudioToServer(event.data);
            }
          };
          mediaRecorderRef.current = recorder;
        }
      });

    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  });

  const handleKeyDown = (event) => {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
      return; // Skip the rest of the logic if typing in a text box
    }

    if (event.code === 'Space' && mediaRecorderRef.current?.state === 'inactive') {
      setIsSpeaking(true);
      console.log(isSpeaking)
      mediaRecorderRef.current.start();
      event.preventDefault(); // Prevents any default behavior associated with the spacebar
    }
  };
  
  const handleKeyUp = (event) => {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
      return; // Skip the rest of the logic if typing in a text box
    }
    if (event.code === 'Space' && mediaRecorderRef.current?.state === 'recording') {
      setIsSpeaking(false);
      mediaRecorderRef.current.stop();
      event.preventDefault(); // Prevents any default behavior associated with the spacebar
    }
  };


  

  // Components
  const ChatMessage = ({ title, message }) => {
    let color;
    if (title === "The Timid Goody-Two-Shoes") {
        color = "#B795F3";
    } else if (title === "The Creative Dreamer") {
        color = "#BF87D9";
    } else if (title === "The Supportive Best Friend") {
        color = "#C779BE";
    } else if (title === "The Charismatic Leader") {
        color = "#D36497";
    } else if (title === "The Analytical Thinker") {
        color = "#C46F9E";
    } else if (title === "The Witty Humorist") {
        color = "#A18AB1";
    } else if (title === "The Practical Realist") {
        color = "#7DA5C4";
    } else if (title === "The Daring Devil's Advocate") {
        color = "#59C0D7";
    } else {
        color = "#ffffff";
    }



    return (
      <div 
        style={{borderColor: color}}
        className={`flex w-full h-fit px-4 py-4 rounded-xl border-2 flex-col justify-between items-start gap-1`}
        onClick={() => handleTTS(message, animalVoice[title])}
      >
        <div 
        style={{color : color}} 
        className="text-xs">{title}</div>
        <div className="text-base">{message}</div>
      </div>
    )
  }
  
  // Helper function to convert hex to rgba
  const hexToRGBA = (hex, opacity) => {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const Select = ({ name }) => {
    // const [isActive, setIsActive] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const animal = PERSONALITIES[name];
    const animalColor = animal ? animal.color : '#ffffff'; // default color as white

    const boxShadow = `0 0 10px 0 ${hexToRGBA(animalColor, 0.3)}`;
    const hoverBoxShadow = `0 0 10px 0 ${hexToRGBA(animalColor, 0.3)}, 0 0 30px 0 ${hexToRGBA(animalColor, 0.4)}`;

    const activeStyles = animals[name] || isHovered
      ? { borderColor: animalColor, backgroundColor: animalColor, boxShadow: hoverBoxShadow } 
      : { borderColor: "transparent" };


    return (
      // <div className='min-h-[22vh] min-w-[20%] flex flex-grow flex-col'>
      //   <button 
      //     style={activeStyles} 
      //     className="btn btn-outline min-h-[22vh] flex flex-grow border-2 flex-col flex-nowrap pt-8 aspect-square"
      //     onClick={() => {
      //       handleSelectAnimal(name)
      //       // setIsActive(!isActive)
      //     }}
      //     onMouseEnter={() => setIsHovered(true)}
      //     onMouseLeave={() => setIsHovered(false)}
      //   >
      //     <p className={`${animals[name] ? 'text-[#282A35]': ""}`}>{PERSONALITIES[name]?.title}</p>
      //     <Image src={animal?.image || 'defaultImage.jpg'} width={180} height={180} alt={animal?.title || 'Default Title'} />
      //   </button>
        
      //   <p className='max-w-[18vw]'>{PERSONALITIES[name]?.summary}</p>
      // </div>

      <div className="card min-h-[22vh] min-w-[20%] max-w-[23.86%] flex flex-grow flex-shrink flex-col bg-base-100 shadow-xl">
        <button 
          style={activeStyles} 
          className="btn btn-outline min-h-[22vh] flex flex-grow border-2 flex-col flex-nowrap pt-8 aspect-square"
          onClick={() => {
            handleSelectAnimal(name)
            // setIsActive(!isActive)
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <p className={`${animals[name] ? 'text-[#282A35]': ""}`}>{PERSONALITIES[name]?.title}</p>
          <Image src={animal?.image || 'defaultImage.jpg'} width={180} height={180} alt={animal?.title || 'Default Title'} />
        </button>      
        <div className="card-body py-6 px-6">
          <p>{PERSONALITIES[name]?.summary}</p>
        </div>
      </div>
    );
  };

  const Avatar = ({ name }) => {
    const [isHovered, setIsHovered] = useState(false);
    const animal = PERSONALITIES[name];
    const animalColor = animal ? animal.color : '#ffffff'; // default color as white

    const boxShadow = `0 0 10px 0 ${hexToRGBA(animalColor, 0.3)}`;
    const hoverBoxShadow = `0 0 10px 0 ${hexToRGBA(animalColor, 0.3)}, 0 0 30px 0 ${hexToRGBA(animalColor, 0.4)}`;

    const hoverStyles = isHovered 
      ? { borderColor: animalColor, backgroundColor: animalColor, boxShadow: hoverBoxShadow } 
      : { borderColor: animalColor, boxShadow };

    return (
      <button 
        style={hoverStyles} 
        className={`btn btn-outline min-h-[22vh] min-w-[31%] flex grow flex-grow border-2 flex-col flex-nowrap pt-2 justify-start overflow-hidden hover:overflow-visible hover:z-10 relative ${animals[name] ? "" : "hidden"}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => runAI(animal.title, animal.personality)}
      >
        <p>{PERSONALITIES[name]?.title}</p>
        <Image src={animal?.image || 'defaultImage.jpg'} className="absolute top-8" width={230} height={230} alt={animal?.title || 'Default Title'} />
      </button>
    );
  };




  return (
    <main className="flex max-h-screen flex-col items-start justify-between py-4 px-4 bg-base-100">
      {/* <p>{recording ? 'Recording...' : 'Press and hold Space to record'}</p> */}
      <div className='hidden'>
        {/* <button onClick={() => runAI("","")}>runAI</button> */}
        {/* <button onClick={() => runTTS("hello, I am so tired")}>tts</button> */}
        <audio ref={audioRef} controls/>
        <p className='absolute'>{userMessage}</p>
      </div>
      

      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" checked/>
        <div className='drawer-content flex flex-row'>
          <div className="flex flex-col items-center justify-between py-8 px-12 w-full h-full gap-10">

            <div className='flex flex-col gap-6 w-full p-0 h-min '>
              <div className="flex items-center justify-between w-full">
                <div className='flex items-center justify-center gap-3 '>                  
                  {/* The button to open modal */}
                  <label htmlFor="my_modal_6" className="btn btn-secondary">Add voices</label> {/* Change name */}
                  

                  <input type="checkbox" id="my_modal_6" className="modal-toggle" />
                  <div className="modal">
                    <div className="modal-box  min-w-[80vw] flex flex-col gap-6" >
                      <h3 className="font-bold text-3xl">What voice do you need right now?</h3>
                      <div className='flex flex-row flex-wrap gap-4'>
                        {Object.keys(PERSONALITIES).map((animal) => (
                          <Select 
                            key={animal} 
                            name={animal} 
                          />
                        ))}
                      </div>
                      <div className="modal-action">
                        <label htmlFor="my_modal_6" className="btn btn-success">Choose voices!</label>
                      </div>
                    </div>
                    <label className="modal-backdrop" htmlFor="my_modal_6"></label>
                  </div>
                </div>



                <label className="swap swap-rotate">
                  {/* this hidden checkbox controls the state */}
                  <input type="checkbox" className="theme-controller" value="light" />
                  <svg className="swap-on fill-current w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
                  <svg className="swap-off fill-current w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
                </label>
              </div>

              {/* Avatars */}
              <div className='flex flex-row gap-6 flex-wrap w-full '>
                <Avatar name="axolotl" />
                <Avatar name="penguin" />
                <Avatar name="koala" />
                <Avatar name="owl" />
                <Avatar name="bee" />
                <Avatar name="raccoon" />
                <Avatar name="cat" />
                <Avatar name="parrot" />
              </div>
            </div>
            
            
            <div className='flex flex-col gap-4 items-center relative '>
              {/* <div className='absolute top-10'>
                {audioData && <audio src={URL.createObjectURL(audioData)} controls />}
              </div> */}
              {!isSpeaking ? 
                <h3 className='w-fit opacity-50 text-xl pb-6 font-bold' style={{ background: 'linear-gradient(to right, #D36497, #59C0D7)', WebkitBackgroundClip: 'text', color: 'transparent', textShadow: `0px 0px 20px #9D8EB4` }}>Hold space to speak</h3> :
                <span className="loading loading-dots loading-lg opacity-50"></span>
              }
            </div>

          </div>

          <div className='h-full flex items-center '>
            <label 
              htmlFor="my-drawer-4" 
              className="drawer-button btn btn-primary bg-transparent border-0 hover:bg-transparent"
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              {!drawerOpen ? 
                <svg width="10" height="50" viewBox="0 0 10 50" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 10 L2.5 25 L7.5 40" stroke="#9D8EB4" stroke-width="5" fill="none" stroke-linecap="round" />
                </svg> : 
                <svg width="10" height="50" viewBox="0 0 10 50" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 10 L7.5 25 L2.5 40" stroke="#9D8EB4" stroke-width="5" fill="none" stroke-linecap="round" />
                </svg>
              }
            </label>
          </div>
        </div> 
        

        <div className={`drawer-side relative rounded-3xl h-full transition-all duration-300 ${drawerOpen ? "w-fit" : " w-0"}`}>
          <ul className="menu p-12 w-[30vw] min-h-full bg-base-200 text-base-content flex flex-col justify-between gap-10">
            <div className='flex flex-col gap-8 overflow-y-scroll max-h-[76vh] no-scrollbar'>
              {messageHistory.map((entry, index) => (
                <ChatMessage key={index} title={entry.get('title')} message={entry.get('message')} />
              ))}
            </div>
            <div className='flex flex-row gap-2'>
              <input type="text"
                value={tempUserMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type something or hold space to talk" className="input input-bordered w-full" />
              <button className="btn btn-outline btn-success" onClick={handleSubmit} >Ask</button>
            </div>
          </ul>
        </div>
      </div>
    </main>
  )
}


