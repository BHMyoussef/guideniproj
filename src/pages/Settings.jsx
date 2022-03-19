import styled from 'styled-components'
// import image
import { useEffect, useState } from 'react'
import { firestore, storage } from '../firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthProvider'
import { Navigate } from 'react-router-dom'
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { useLang } from '../contexts/LangProvider'
const Settings = ({userId}) => {
  // form data ::
  const { currentUser, currentUserInfo, updateUserInfo, updatePassword} = useAuth();
  const [pass1, setPass1] = useState('')
  const [pass2, setPass2] = useState('')
  const [formData, setFormData] = useState({
    firstName:'',
    imageUrl:'',
    email:'',
    phone:'',
    facebookAccount:'',
    instagramAccount:'',
    youtube:'',
    website:'',
  });
  const {setting} = useLang()

  useEffect(()=>{
    setFormData(currentUserInfo)
  },[])
  
  // handle submit
  const handleSubmit = (e) => {
    window.btn.disabled = true;
    e.preventDefault()
    updatePasswd()
    const docRef = doc(firestore,`users/${currentUserInfo.userId}`)
    updateDoc(docRef,formData)
    .then(result=>{
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
    setFormData({ ...formData, imageUrl:e.target.files[0] })
    uploadImag(e.target.files[0])
  }
  const changePasswd = (e) => {
    setPass1(window.password.value)
    setPass2(window.cpassword.value)
    console.log({pass1, pass2});
  }
  const updatePasswd = () => {
    if(pass1 === pass2 && pass1.trim() !== "" && pass2.trim() !== ''){
      updatePassword(currentUser, pass1)
      .then(_ => {
        console.log('pass updated.....')
        setPass1('')
        setPass2('')
      })
    }

  } 
  async function uploadImag(image){
      if(image !== currentUserInfo.imageUrl && image) {
        try {
          // Delete the image:
          const storageRef = ref(storage, currentUserInfo.imageUrl);
          await deleteObject(storageRef);
        } catch (err) {
          console.log("deleete: ",err);
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
          const docRef = doc(firestore,`users/${currentUserInfo.userId}`);
          setFormData({...formData, imageUrl: url})
          updateDoc(docRef, {
            imageUrl:url
          }).then(()=>{
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
    <StyledSettings className='container bg-bgcolor'>
      <StyledForm onSubmit={handleSubmit}>
        <h2 className='text-2xl block mx-auto font-semibold mb-4'>Personal Information</h2>
        <div className="inputs edit-image">
          <div className="image">
            <label htmlFor="image">
              <img src={currentUserInfo.imageUrl ?? `${window.location.origin}/resources/profile.png`} alt="image" />
            </label>
            <input onChange={changeImage} type="file" id="image" name="image" hidden/>
          </div>
          {/* <FaEdit size={35} /> */}
        </div>
        <div className="inputs">
          <label htmlFor="fullName">{setting?.fullName}</label>
          <input onChange={change} type="text" id="fullName" value={formData.firstName} name="firstName" placeholder='Full Name' />
        </div>
        <div className="inputs">
          <label htmlFor="email">{setting?.email}</label>
          <input onChange={change} type="email" value={formData.email} id="email" name="email" placeholder='email'/>
        </div>
        <div className="inputs">
          <label htmlFor="password">{setting?.password}</label>
          <input onChange={changePasswd} value={pass1} type="password" id="password" name="password" placeholder='password'/>
        </div>
        <div className="inputs">
          <label htmlFor="cpassword">{setting?.repeatPass}</label>
          <input onChange={changePasswd} value={pass2}  type="password" id="cpassword" name="cpassword" placeholder='Confirm Password'/>
        </div>
        {currentUserInfo.jobId && <div className="inputs">
          <label htmlFor="phone">{setting?.phone}</label>
          <input onChange={change} type="tel" id="phone" value={formData?.phone} name="phone" placeholder='Phone Number'/>
        </div>}
        {currentUserInfo.jobId && <div>
          <h2 className='my-8 font-medium'>{setting?.contact} </h2>
          <div className="inputs">
          <label htmlFor="facebook">{setting?.facebook}</label>
          <input onChange={change} type="text" id="facebookAccount" value={formData?.facebookAccount} name="facebookAccount" placeholder='Facebook Account'/>
          </div>
          <div className="inputs">
          <label htmlFor="Youtube">{setting?.youtube}</label>
          <input onChange={change} type="text" id="youtube"  value={formData?.youtube} name="youtube" placeholder='Youtube Account'/>
          </div>
          <div className="inputs">
          <label htmlFor="instagram">{setting?.instagram}</label>
          <input onChange={change} type="text" id="instagramAccount" value={formData?.instagramAccount} name="instagramAccount" placeholder='Instagram Account'/>
          </div>
          <div className="inputs">
          <label htmlFor="website">{setting?.website}</label>
          <input onChange={change} type="text" id="website" value={formData?.website} name="website" placeholder='Website'/>
          </div>
        </div>}
    
      <button id='btn' className='save-btn'>Save</button>
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
    padding: .5rem 1.2rem;
    /* width: 150px;
    height: 50px; */
    background: gray;
    color: white;
    border-radius: 3px;
    transition: all .3s ease;
    margin-top: 1rem;
    margin-right: .5rem;
    align-self: flex-end;
    &:hover {
      background: white;
      color: gray;
      border: 1px solid gray;
    }
  }
  `
const StyledForm = styled.form`
z-index:1;
padding: 1rem;
  display: flex;
  flex-direction: column;
  .inputs {
    display: flex;
    label {
      flex: 1;
    }
    input {
      flex:4;
      outline: none;
      border: solid 1px gray;
      padding: .2rem .5rem;
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
