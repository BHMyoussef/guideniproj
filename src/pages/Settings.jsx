import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { firestore, storage } from '../firebase'
import { doc, updateDoc, getDocs, collection } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthProvider'
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { useLang } from '../contexts/LangProvider'
import { Link, Navigate } from 'react-router-dom'



// animations
import {motion} from "framer-motion";
import {fadeIn} from "../animation";

const Settings = ({userId}) => {
  const { currentUser, currentUserInfo, updateUserInfo, updatePassword, updateEmail } = useAuth();
  const { setting, currentLang } = useLang();
  //
  const [choix, setChoix] = useState("personal");
  const [pass1, setPass1] = useState('')
  const [pass2, setPass2] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    imageUrl: '',
    email: '',
    phone: '',
    facebookAccountUrl: '',
    instagramAccountUrl: '',
    youtubeAccountUrl: '',
    websiteUrl: '',
    
  });

  useEffect(() => {
     setFormData(currentUserInfo);
  }, [])

  const handleSubmit = () => {
    console.log({formData})
    updateMail()
    updatePasswd()
    const docRef = doc(firestore, `users/${currentUserInfo.userId}`)
    updateDoc(docRef, formData)
      .then(result => {
        updateUserInfo();
      })
      .then(() => window.refresh)
  }

  const change = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const changeImage = async (e) => {
    setFormData({ ...formData, imageUrl: e.target.files[0] })
    uploadImag(e.target.files[0])
  }
  const changePasswd = (e) => {
    setPass1(window.password.value)
    setPass2(window.cpassword.value)
  }
  const updateMail = () =>  {
    if(formData.email!==currentUserInfo && formData.email.match(/^\S+@\S+\.\S/)){
      updateEmail(currentUser, formData.email)
        .then(() => console.log('Email changed'))
    }
  }
  const updatePasswd = () => {
    if (pass1 === pass2 && pass1.trim() !== "" && pass2.trim() !== '') {
     updatePassword(currentUser, pass1)
        .then(_ => {
          console.log('pass updated.....')
          setPass1('')
          setPass2('')
        })
    }
  }

  async function uploadImag(image) {
    if (image !== currentUserInfo.imageUrl && image) {
      try {
        // Delete the image:
        const storageRef = ref(storage, currentUserInfo.imageUrl);
        await deleteObject(storageRef);
      } catch (err) {
        console.log("delete: ", err);
      }

      const storageRef = ref(storage, `/UsersFiles/${currentUserInfo.userId}/profileImage/${image.name}`)
      //     /* To upload file to firebase/storage*/
      const uploadImage = uploadBytesResumable(storageRef, image)

      uploadImage.on(
        'state_changed',
        // work with uploaded file
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          )
        }, // to handle Errors
        (err) => {
          console.error('Error:', err)
        },
        // When the upload is complete
        () => {
          // GET image URL:
          getDownloadURL(uploadImage.snapshot.ref).then((url) => {
            // save all data to firestore
            const docRef = doc(firestore, `users/${currentUserInfo.userId}`);
            setFormData({ ...formData, imageUrl: url })
            updateDoc(docRef, {
              imageUrl: url
            }).then(() => {
              updateUserInfo();
            })
              .catch((err) => {
                console.log("Update image: ", err)
              })
          })
        },
      )
    } // end if
  }


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
              <input onChange={changeImage} type="file" id="image" name="image" accept="image/*" />
              <img onClick={()=>window.image.click()} src={currentUserInfo?.imageUrl ?? window.location.origin+"/resources/profile.png"} alt="profile" />
             </div>
             <div className={`inputs ${currentLang === "ar" ? "flex-row-reverse": ""} `}>
               <label className={`${currentLang === "ar" ? "flex-row-reverse": ""}`} htmlFor="firstName">{setting?.fullName}</label>
               <input onChange={change} name="firstName" id="firstName" type="text" placeholder="firstName" />
             </div>

             <div className={`inputs ${currentLang === "ar" ? "flex-row-reverse": ""} `}>
               <label className={`${currentLang === "ar" ? "flex-row-reverse": ""}`} htmlFor="email">{setting?.email}</label>
               <input onChange={change} name="email" id="email" type="email" placeholder="email" />
             </div>

             <div className={`inputs ${currentLang === "ar" ? "flex-row-reverse": ""} `}>
               <label className={`${currentLang === "ar" ? "flex-row-reverse": ""}`} htmlFor="password">{setting?.password}</label>
               <input onChange={changePasswd} name="password" id="password" type="password" placeholder="password" />
             </div>

             <div className={`inputs ${currentLang === "ar" ? "flex-row-reverse": ""} `}>
               <label className={`${currentLang === "ar" ? "flex-row-reverse": ""}`} htmlFor="cpassword">{setting?.repeatPass}</label>
               <input onChange={changePasswd} name="cpassword" id="cpassword" type="password" placeholder="repeat password" />
             </div>

             

           </div>
         :
           <div className="divs contact">
            {currentUserInfo?.jobId &&
               <div className={`inputs ${currentLang === "ar" ? "flex-row-reverse": ""}`}>
                <label className={`${currentLang === "ar" ? "flex-row-reverse": ""}`} htmlFor="phone">{setting?.phone}</label>
                <input onChange={change} type="tel" id="phone" placeholder={currentUserInfo?.phone} name="phone" />
              </div>
            }
            {
              
            currentUserInfo?.jobId &&
            <>
                         <div className={`inputs ${currentLang === "ar" ? "flex-row-reverse": ""} `}>
                         <label className={`${currentLang === "ar" ? "flex-row-reverse": ""}`} htmlFor="facebookAccountUrl">{setting?.facebook}</label>
                           
                           <input onChange={change} name="facebookAccountUrl" id="facebookAccountUrl" type="text" />
                         </div>
            
                         <div className={`inputs ${currentLang === "ar" ? "flex-row-reverse": ""} `}>
                           <label className={`${currentLang === "ar" ? "flex-row-reverse": ""}`} htmlFor="youtubeAccountUrl">{setting?.youtube}</label>
                           <input onChange={change} name="youtubeAccountUrl" id="youtubeAccountUrl" type="text" />
                         </div>
            
                         <div className={`inputs ${currentLang === "ar" ? "flex-row-reverse": ""} `}>
                         <label className={`${currentLang === "ar" ? "flex-row-reverse": ""}`} htmlFor="instagram">{setting?.instagram}</label>
                           <input onChange={change} name="instagramAccountUrl" id="instagramAccountUrl" type="text" />
                         </div>
            
                         <div className={`inputs ${currentLang === "ar" ? "flex-row-reverse": ""} `}>
                           <label className={`${currentLang === "ar" ? "flex-row-reverse": ""}`} htmlFor="websiteUrl">{setting?.website}</label>
                           <input onChange={change} name="websiteUrl" id="websiteUrl" type="text" />
                         </div>
            </>
            }
           </div>
       }
       </div>
       <div
         className="w-full py-[.5rem] pr-[1rem] flex justify-end">
         {
                !currentUserInfo?.jobId &&
                <Link 
                    to="/addJob"
                    className="border-blue-500 text-blue-500 w-[100px] mr-1 hover:bg-blue-700 hover:text-white font-bold py-2 px-4 rounded">
                        {setting?.addJob}
                </Link>
          }
         <button
           onClick={handleSubmit}
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
    input{
      display:none;
    }
    img {
      width: 100%;
      height:100%;
      object-fit:cover;
      cursor:pointer;
    }
  }
  .inputs {
    flex-direction: row;
    border-radius:.5rem;
    padding:.5rem 1rem;
    justify-content:space-between;
  }

  input, select {
    display: block;
    width: 100%;
    padding: 8px 16px;
    margin: .5rem auto;
    line-height: 25px;
    font-weight: 700;
    font-family: inherit;
    border-radius: 6px;
    -webkit-appearance: none;
    border: 1px solid gray;
    transition: border .3s ease;
    outline: none;
}
  select {
    cursor:pointer;
    text-align:center;
  }
`

export default Settings;
