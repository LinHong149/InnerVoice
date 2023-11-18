'use client';
import Image from 'next/image'
import { useState } from 'react'
import { PERSONALITIES } from './constant'; // Make sure the file name is correct

const ChatMessage = ({ name, message }) => {
  return (
    <div className={`flex w-full h-fit px-4 py-4 rounded-xl border-2 flex-col justify-between items-start gap-1`}>
      <div className="text-xs">{PERSONALITIES[name]?.title}</div>
      <div className="text-md">{message}</div>
    </div>
  )
}

// const Avatar = ({ name }) => {
//   const animal = PERSONALITIES[name];

//   return (
//     <button style={{ borderColor: animal ? animal.color : 'defaultColor' }} className="btn btn-outline overflow-hidden h-[20vh] grow">
//       <Image src={animal?.image || 'defaultImage.jpg'} width={200} height={200} alt={animal?.title || 'Default Title'} />
//     </button>
//   );
// };


// Helper function to convert hex to rgba
const hexToRGBA = (hex, opacity) => {
  let r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const Select = ({ name }) => {
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const animal = PERSONALITIES[name];
  const animalColor = animal ? animal.color : '#ffffff'; // default color as white

  const boxShadow = `0 0 10px 0 ${hexToRGBA(animalColor, 0.3)}`;
  const hoverBoxShadow = `0 0 10px 0 ${hexToRGBA(animalColor, 0.3)}, 0 0 30px 0 ${hexToRGBA(animalColor, 0.4)}`;

  const activeStyles = isActive || isHovered
    ? { borderColor: animalColor, backgroundColor: animalColor, boxShadow: hoverBoxShadow } 
    : { borderColor: animalColor, boxShadow };


  return (
    <button 
      style={activeStyles} 
      className="btn btn-outline min-h-[22vh] min-w-[20%] flex flex-grow border-2 flex-col flex-nowrap pt-6 aspect-square"
      onClick={() => setIsActive(!isActive)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p className={`${isActive? 'text-[#282A35]': ""}`}>{PERSONALITIES[name]?.title}</p>
      <Image src={animal?.image || 'defaultImage.jpg'} width={200} height={200} alt={animal?.title || 'Default Title'} />
    </button>
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
      className="btn btn-outline min-h-[22vh] min-w-[30%] flex flex-grow border-2 flex-col flex-nowrap pt-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p>{PERSONALITIES[name]?.title}</p>
      <Image src={animal?.image || 'defaultImage.jpg'} width={200} height={200} alt={animal?.title || 'Default Title'} />
    </button>
  );
};

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [koala, setKoala] = useState(false);
  const [bee, setBee] = useState(false);
  const [owl, setOwl] = useState(false);
  const [parrot, setParrot] = useState(false);
  const [penguin, setPenguin] = useState(false);
  const [axolotl, setAxolotl] = useState(false);
  const [cat, setCat] = useState(false);
  const [raccoon, setRaccoon] = useState(false);



  return (
    <main className="flex max-h-screen flex-col items-start justify-between py-4 px-4 bg-base-100">

      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" checked/>

        <div className='drawer-content flex flex-row'>
          <div className="flex flex-col items-center justify-between py-10 px-12 w-full h-full gap-10">
            <div className='flex flex-col gap-10 w-full h-full'>
              <div className="flex items-center justify-between w-full">
                <div className='flex items-center justify-center gap-3 '>
                  <button className="btn btn-primary">Clear table</button>
                  
                  {/* The button to open modal */}
                  <label htmlFor="my_modal_6" className="btn btn-secondary">Discussion participant</label> {/* Change name */}
                  

                  <input type="checkbox" id="my_modal_6" className="modal-toggle" />
                  <div className="modal">
                    <div className="modal-box  min-w-[80vw] flex flex-col gap-6" >
                      <h3 className="font-bold text-2xl">Discussion participants</h3>
                      <div className='flex flex-row flex-wrap gap-4'>
                        {Object.keys(PERSONALITIES).map((animal) => (
                          <Select key={animal} name={animal} />
                        ))}
                      </div>
                      <div className="modal-action">
                        <label htmlFor="my_modal_6" className="btn btn-error btn-outline">Discard</label>
                        <label htmlFor="my_modal_6" className="btn btn-success">Save</label>
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
                <Avatar name="koala"/>
                <Avatar name="bee"/>
                <Avatar name="cat"/>
                <Avatar name="cat"/>
                <Avatar name="cat"/>
                <Avatar name="parrot"/>
                <Avatar name="bee"/>
              </div>
            </div>
            
            <h3 className='w-fit opacity-50 text-xl pb-4' style={{ background: 'linear-gradient(to right, #D36497, #59C0D7)', WebkitBackgroundClip: 'text', color: 'transparent', textShadow: `0px 0px 20px #9D8EB4` }}>
              Hold space to speak
            </h3>

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
            <div className='flex flex-col gap-8'>
              <ChatMessage name="raccoon" message="Lorem" />
              <ChatMessage name="raccoon" message="Lorem" />
            </div>
            <div className='flex flex-row gap-2'>
              <input type="text" placeholder="Type here" className="input input-bordered w-full" />
              <button className="btn btn-outline btn-success">Ask</button>
            </div>
          </ul>
        </div>
      </div>
    </main>
  )
}
