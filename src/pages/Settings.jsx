import styled from 'styled-components'
import { FaPlusCircle } from "react-icons/fa"
// import image
import { useEffect, useState } from 'react'
import { firestore, storage } from '../firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthProvider'
import { Link, Navigate } from 'react-router-dom'
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { useLang } from '../contexts/LangProvider'


const Settings = ({ userId }) => {
  // form data ::
  const { currentUser, currentUserInfo, updateUserInfo, updatePassword } = useAuth();
  const [pass1, setPass1] = useState('')
  const [pass2, setPass2] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    imageUrl: '',
    email: '',
    phone: '',
    facebookAccount: '',
    instagramAccount: '',
    youtube: '',
    website: '',
  });
  const { setting, currentLang } = useLang()
  console.log({ setting, currentLang })

  useEffect(() => {
    setFormData(currentUserInfo)
  }, [])

  // handle submit
  const handleSubmit = (e) => {
    window.btn.disabled = true;
    e.preventDefault()
    updatePasswd()
    const docRef = doc(firestore, `users/${currentUserInfo.userId}`)
    updateDoc(docRef, formData)
      .then(result => {
        window.btn.disabled = false;
        updateUserInfo();
      })
  }
  // function to handle html forms
  // handle change
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
    console.log({ pass1, pass2 });
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
        console.log("deleete: ", err);
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
    !currentUser ? <Navigate to="/" /> :
      <StyledSettings className='container shadow'>
        <StyledForm  onSubmit={handleSubmit}>
          <h2 className='text-2xl block mx-auto font-semibold mb-4'>{setting?.personal}</h2>
          <div className="inputs edit-image">
            <div className="image">
              <label htmlFor="image">
                <img src={currentUserInfo.imageUrl ?? `${window.location.origin}/resources/profile.png`} alt="image" />
              </label>
              <input onChange={changeImage} type="file" id="image" name="image" hidden />
            </div>
          </div>
          <div className={`inputs ${currentLang == "ar" ? "flex-row-reverse": ""}`}>
            <label className={`${currentLang == "ar" ? "flex-row-reverse": ""}`} htmlFor="fullName">{setting?.fullName}</label>
            <input onChange={change} type="text" id="fullName" name="firstName" placeholder={formData.firstName} />
          </div>
          <div className={`inputs ${currentLang == "ar" ? "flex-row-reverse": ""} `}>
            <label className={`${currentLang == "ar" ? "flex-row-reverse": ""}`} htmlFor="email">{setting?.email}</label>
            <input onChange={change} type="email" placeholder={formData.email} id="email" name="email" />
          </div>
          <div className={`inputs ${currentLang == "ar" ? "flex-row-reverse": ""} `}>
            <label className={`${currentLang == "ar" ? "flex-row-reverse": ""}`} htmlFor="password">{setting?.password}</label>
            <input onChange={changePasswd} value={pass1} type="password" id="password" name="password" placeholder='password' />
          </div>
          <div className={`inputs ${currentLang == "ar" ? "flex-row-reverse": ""} `}>
            <label className={`${currentLang == "ar" ? "flex-row-reverse": ""}`} htmlFor="cpassword">{setting?.repeatPass}</label>
            <input onChange={changePasswd} value={pass2} type="password" id="cpassword" name="cpassword" placeholder='Confirm Password' />
          </div>
          {currentUserInfo.jobId && <div className={`inputs ${currentLang == "ar" ? "flex-row-reverse": ""}`}>
            <label className={`${currentLang == "ar" ? "flex-row-reverse": ""}`} htmlFor="phone">{setting?.phone}</label>
            <input onChange={change} type="tel" id="phone" placeholder={formData?.phone} name="phone" />
          </div>}

          

          {currentUserInfo.jobId && <div>
            <h2 className='my-8 font-medium'>{setting?.contact} </h2>
            <div className={`inputs ${currentLang == "ar" ? "flex-row-reverse": ""} `}>
              <label className={`${currentLang == "ar" ? "flex-row-reverse": ""}`} htmlFor="facebook">{setting?.facebook}</label>
              <input onChange={change} type="text" id="facebookAccount" placeholder={formData?.facebookAccount} name="facebookAccount" />
            </div>
            <div className={`inputs ${currentLang == "ar" ? "flex-row-reverse": ""} `}>
              <label className={`${currentLang == "ar" ? "flex-row-reverse": ""}`} htmlFor="Youtube">{setting?.youtube}</label>
              <input onChange={change} type="text" id="youtube" placeholder={formData?.youtube} name="youtube" />
            </div>
            <div className={`inputs ${currentLang == "ar" ? "flex-row-reverse": ""} `}>
              <label className={`${currentLang == "ar" ? "flex-row-reverse": ""}`} htmlFor="instagram">{setting?.instagram}</label>
              <input onChange={change} type="text" id="instagramAccount" placeholder={formData?.instagramAccount} name="instagramAccount" />
            </div>
            <div className={`inputs ${currentLang == "ar" ? "flex-row-reverse": ""} `}>
              <label className={`${currentLang == "ar" ? "flex-row-reverse": ""}`} htmlFor="website">{setting?.website}</label>
              <input onChange={change} type="text" id="website" placeholder={formData?.website} name="website"  />
            </div>
          </div>}
            <div className='text-center'>
              {
                !currentUserInfo.jobId && 
                <Link to="/addJob" className={`save-btn inline-block mr-2 border-2 rounded border-sky-500 bg-sky-500 text-white hover:bg-white hover:text-sky-500  px-5 `}
                >
                        {setting?.addJob}
                </Link>
              }
              <button id='btn' className={`save-btn border-2 rounded border-sky-500 bg-sky-500 text-white hover:bg-white hover:text-sky-500  px-5`}>{setting?.save}</button>
            </div>
        </StyledForm>
      </StyledSettings>
  )
}

const StyledSettings = styled.div`
  position: relative;
  z-index:1;
  width: 95%;
  margin: 0.5rem auto;
  padding: .5rem 1rem;
  display: flex;
  flex-direction: column;
  transition: all .3s ease-in;
  border-radius:5px;

  .save-btn {
    box-sizing: border-box;
    border-radius: 3px;
    transition: all .3s ease;
    margin-top: 1rem;
  }
  `
const StyledForm = styled.form`
@media screen and (max-width: 640px) {
  .inputs {
    &:not(&.edit-image){
    flex-direction: column;
    label {
      margin: .5rem 0;
    }
  }
  }
}
z-index:1;
padding: 1rem;
  display: flex;
  flex-direction: column;
  .inputs {
    margin-top: .5rem;
    padding: 0 .5rem;
    display: flex;
    justify-content: space-between;
    label {
      flex: 1;
      display: flex;
      justify-content: flex-start;
    }
    input {
      flex:2;
      outline: none;
      border: solid 1px rgba(0,0,0,0.3);
      padding: .2rem 1rem;
      border-radius: 3px;
    }
    &.edit-image {
      padding:0;
    margin-bottom: 15px;

      position: relative;
      display: flex;
      justify-content: center;
      align-self: center;
      width: 10rem;
      height: 10rem;
      border-radius:50%;
      overflow: hidden;
      label {
        cursor: pointer;
        width: 100%;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      box-shadow  : 0px 0px 10px rgba(0,0,0,0.5);

      svg {
        position: absolute;
        bottom: .5rem;
        right: 1rem;
        border-radius: 50%;
        background: white;
      }
    }


  }
`

export default Settings
