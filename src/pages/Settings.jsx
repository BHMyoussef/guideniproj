import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { firestore, storage } from '../firebase'
import { doc, updateDoc, getDocs, collection } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthProvider'
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { useLang } from '../contexts/LangProvider'



// animations
import {motion} from "framer-motion";
import {fadeIn} from "../animation";

const Settings = ({userId}) => {
  const { currentUser, currentUserInfo, updateUserInfo, updatePassword } = useAuth();
  const { setting, currentLang } = useLang();
  const [choix, setChoix] = useState("personal");

  return (
    !currentUser ?
      <img className='absolute left-1/2 -translate-x-1/2' src={`${window.location.origin}/resources/13525-empty.gif`} alt='empty' />
    :
    <div variants={fadeIn}
      initial="hidden"
      animate="show"
      exit="exit"

      className='container shadow'>
     <Header>
       <button
          onClick={_ => setChoix("personal")}
          autoFocus
          className={`outline-none font-bold py-2 px-4 rounded border-2 focus:bg-gray-200`}>
           Personal Information
        </button>
       <button
          onClick={_ => setChoix("contact")}
          className={`outline-none font-bold py-2 px-4 rounded border-2 focus:bg-gray-200`}
          >
          Contact Information
          </button>
     </Header>
     <Middle>
       <div className="div1">
         {choix==="personal" ?
           <div className="divs personal">
             <div className="image">
               <img src="http://localhost:3000/resources/profile.png" alt="profile" />
             </div>
             <div className="inputs">
               <label htmlFor="name">Name:</label>
               <input name="name" id="name" type="text" placeholder="name" />
             </div>

             <div className="inputs">
               <label htmlFor="email">Email:</label>
               <input name="email" id="email" type="email" placeholder="email" />
             </div>

             <div className="inputs">
               <label htmlFor="passwd1">Password:</label>
               <input name="passwd1" id="passwd1" type="password" placeholder="passwd" />
             </div>

             <div className="inputs">
               <label htmlFor="passwd2">Repeat Password:</label>
               <input name="passwd2" id="passwd2" type="password" placeholder="passwd" />
             </div>

             <div className="inputs">
               <label htmlFor="job">Job:</label>
               <input name="job" id="job" type="text" placeholder="job" />
             </div>

           </div>
         :
           <div className="divs contact">

             <div className="inputs">
               <label htmlFor="phone">Phone:</label>
               <input name="phone" id="phone" type="tel" />
             </div>

             <div className="inputs">
               <label htmlFor="fb">Facebook:</label>
               <input name="fb" id="fb" type="text" />
             </div>

             <div className="inputs">
               <label htmlFor="yt">Youtube:</label>
               <input name="yt" id="yt" type="text" />
             </div>

             <div className="inputs">
               <label htmlFor="insta">Instagram:</label>
               <input name="insta" id="insta" type="text" />
             </div>

             <div className="inputs">
               <label htmlFor="website">Website:</label>
               <input name="website" id="website" type="text" />
             </div>

           </div>
       }
       </div>
       <div
         className="w-full py-[.5rem] pr-[1rem] flex justify-end">
         <button
           className="bg-blue-500 w-[150px] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
           Save
         </button>
     </div>
     </Middle>

   </div>
  )
}


const Header = styled.div`
  margin: 1rem auto;
  width: 50%;
  display: flex;
  justify-content: space-between;

`
const Middle = styled.div`
  width:50%;
  margin: 0 auto;
  overflow: hidden;
  box-shadow: 0px 0px 5px #33333328;
  border-radius: .5rem;
  .div1{
    margin: 1rem auto;
    width: 80%;
    display: flex;
    justify-content: center;
  }
  .divs {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .image {
    width: 120px;
    height: 120px;
    border-raduis: 50%;
    align-self: center;
    overflow:hidden;
    img {
      width: 100%;
      height:100%;
      object-fit:cover;
    }
  }
  .inputs {
    flex-direction: row;
    border-radius:.5rem;
    padding:.5rem 1rem;
    justify-content:space-between;
  }

  input {
    display: block;
    width: 100%;
    padding: 8px 16px;
    line-height: 25px;
    font-weight: 700;
    font-family: inherit;
    border-radius: 6px;
    -webkit-appearance: none;
    border: 1px solid gray;
    transition: border .3s ease;
    outline: none;
}
`

export default Settings;
