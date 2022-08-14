import styled from 'styled-components'
import { useEffect, useState} from 'react'
import { firestore, storage } from '../firebase'
import { doc, updateDoc, getDocs, collection, query, where, getDoc } from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { useAuth } from '../contexts/AuthProvider'
import { useLang } from '../contexts/LangProvider'
import { Link, Navigate } from 'react-router-dom'
import Joi from "joi"
import SelectForm from "../components/SelectForm";

// animations
import {motion} from "framer-motion";
import {fadeIn} from "../animation";

const Settings = ({userId}) => {
  const { currentUser, currentUserInfo, updateUserInfo, updatePassword, updateEmail } = useAuth();
  const { setting, currentLang } = useLang();
  //
  const [ cities,setCities ] = useState([])
  const [ neighborhoods,setNeighborhoods ] = useState([])
  const [ categories, setCategories ] = useState([]);
  const [ subCategories, setSubCategories ] = useState([]);
  const [ error, setError ] = useState()

  // for user changes
  const [ category,setCategory ] = useState();
  const [ subCategory,setSubCategory ] = useState();
  const [ city,setCity ] = useState();
  const [ userNeighborhood,setUserNeighborhood ] = useState();
  // to use them as value for the SelectForm
  const [ userCityValue,setUserCityValue ] = useState();
  const [ userNeighborhoodValue,setUserNeighborhoodValue ] = useState();
  const [ categoryName,setCategoryName ] = useState();
  const [ subCategoryName,setSubCategoryName ] = useState();
  //
  const [choix, setChoix] = useState("personal");
  const [pass1, setPass1] = useState('')
  const [pass2, setPass2] = useState('')
  const [formData, setFormData] = useState({
    firstName:'',
    phone:'',
    jobId:'',
    facebookAccountUrl:'',
    instagramAccountUrl:'',
    youtubeAccountUrl:'',
    websiteUrl:'',
  });

  // added currentUser,currentUserInfo as dependencies cuz we need those info to present for our logic
  useEffect(() => {
    if(currentUserInfo?.jobId){
      // Get user address: city,neighborhood
      getDoc(doc(firestore, `/cities/${currentUserInfo?.userCity}`))
        .then(res => {
          setCity(res.data().cityId);
          setUserCityValue(res.data().cityName);
        });

      getDoc(doc(firestore, `/cities/${currentUserInfo?.userCity}/neighborhoods/${currentUserInfo?.userNeighborhood}`))
        .then(res => {
         setUserNeighborhoodValue(res.data().neighborhoodName)
	 setUserNeighborhood(res.data().neighborhoodId)
        
        });
      getDoc(doc(firestore, `/jobs/${currentUserInfo?.jobId}`))
        .then(res => {
          setSubCategoryName(res.data().jobName[currentLang]);
          setSubCategory(res.data().jobId)
          getDoc(doc(firestore, `/jobsCategories/${res.data().categoryId}`))
            .then(r => setCategoryName(r.data().categoryName[currentLang]));
        })


      // run other functions
      getCities();
      getCategories();
  }

},[currentUser, currentUserInfo, currentLang])

  useEffect(()=>{
      category&&getSubCategories();
  },[category])
  useEffect(()=>{
      city&&getNeighborhoods();
  },[city])

  function getNeighborhoods(){

    const docRef = collection(firestore, `cities/${city}/neighborhoods/`);
    let neighboorsdb = []

    getDocs(docRef)
    .then(results=>{
        results.forEach(city=>{
            const obj = {
                id: city.data().neighborhoodId,
                name : city.data().neighborhoodName
            }
            neighboorsdb = [...neighboorsdb,obj]
        });

        neighboorsdb.sort((a,b)=>{
            if ( a.name < b.name ){
                return -1;
            }
            if ( a.name > b.name ){
                return 1;
            }
            return 0;
        })

        setNeighborhoods(neighboorsdb)
    })
    .catch(error=>{
        console.log( "error eccured: " ,error );
    })
  }


  function getCities(){
      const citiesRef = collection(firestore,"cities");
      let citiesdb = []

      getDocs(citiesRef)
      .then(results=>{
          results.forEach(city=>{
              const obj = {
                  id: city.data().cityId,
                  name : city.data().cityName
              }
              citiesdb = [...citiesdb,obj]
          });

          citiesdb.sort((a,b)=>{
              if ( a.name < b.name ){
                  return -1;
              }
              if ( a.name > b.name ){
                  return 1;
              }
              return 0;
          })

          setCities(citiesdb)
      })
      .catch(error=>{
          console.log( "error eccured: " ,error );
      })
  }

  function getCategories(){
      const CategoryRef = collection(firestore,"jobsCategories");
      let categoriesdb = [];

      getDocs(CategoryRef)
      .then(results=>{
        results.forEach(category=>{
          const obj = {
            id: category.data().categoryId,
            name : category.data().categoryName
          }

          categoriesdb = [...categoriesdb,obj]
        });

        categoriesdb.sort((a, b) => (a.name[currentLang].split(' ')[0] > b.name[currentLang].split(' ')[0]) ? 1 : -1);


       setCategories(categoriesdb)
      })
      .catch(error=>{
        console.log( "error eccured: " ,error );
      })
    }

  function getSubCategories(){
      const subCategoryRef = collection(firestore,"jobs");
      const q = query( subCategoryRef, where('categoryId','==',category));

      let subCategoriesdb = [];

      getDocs(q)
      .then(results=>{
          results.forEach(category=>{
          const obj = {
              id: category.data().jobId,
              name : category.data().jobName
          }
          subCategoriesdb = [...subCategoriesdb,obj]
          });
          subCategoriesdb.sort((a, b) => (a.name[currentLang].split(' ')[0] > b.name[currentLang].split(' ')[0]) ? 1 : -1);

          setSubCategories(subCategoriesdb)
      })
      .catch(error=>{
          console.log( "error eccured: " ,error );
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // check and validate inputs
    const data = {};
    console.log(formData)
      if(formData?.firstName.trim()!=='' && formData?.firstName.trim()!== currentUserInfo?.firstName){
        data["firstName"]=formData?.firstName;
      }
      if(formData?.email && formData?.email !== currentUserInfo?.email){
        const res =
          Joi.object(
              {email: Joi.string().email({ minDomainSegments: 2, tlds: {} })}
            ).validate({email:formData?.email})
            if(!res.error){
              // NB: changing the email will cuz problems for now
              // until i figure out a secure way of doing it, i'll just change it in the user information
              updateEmail(currentUser, formData.email)
                 .then(() => console.log('Email changed'))
              data["email"]=formData?.email
            }else{
            console.error(res.error)
            }
      }
      // A big check, to avoid the case of a simple user
      if(currentUserInfo?.jobId){

        if(city!==currentUserInfo?.userCity){
          data["userCity"]=city;
        }
        if(userNeighborhood!==currentUserInfo?.userNeighborhood){
          data["userNeighborhood"]=userNeighborhood;
        }
        if(subCategory !== currentUserInfo?.jobId){
          data["jobId"]=subCategory;
        }
        if(formData?.facebookAccountUrl.trim() && formData?.facebookAccountUrl.trim()!== currentUserInfo?.facebookAccountUrl){
          data["facebookAccountUrl"]=formData?.facebookAccountUrl;
        }
        if(formData?.instagramAccountUrl.trim() && formData?.instagramAccountUrl.trim()!== currentUserInfo?.instagramAccountUrl){
          data["instagramAccountUrl"]=formData?.instagramAccountUrl;
        }
        if(formData?.youtubeAccountUrl.trim() && formData?.youtubeAccountUrl.trim()!== currentUserInfo?.youtubeAccountUrl){
          data["youtubeAccountUrl"]=formData?.youtubeAccountUrl;
        }
        if(formData?.websiteUrl.trim() && formData?.websiteUrl.trim()!== currentUserInfo?.websiteUrl){
          data["websiteUrl"]=formData?.websiteUrl;
        }

      }
    updatePasswd();
    console.log({data})
    const docRef = doc(firestore, `users/${currentUserInfo.userId}`)
    updateDoc(docRef, data)
      .then(result => {
        updateUserInfo();
        console.log({currentUserInfo});
        alert("Your Profile has been updated");
      })
    // TODO: validate user input form data and update user doc

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
  const updatePasswd = () => {
    if (pass1 === pass2 && pass1.trim() !== "" && pass2.trim() !== '' && pass1.match(/[\S]{8,}/)) {
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
        (s) => {
          console.log("Uploading!!!")
          // const progress = Math.round(
          //   (s.bytesTransferred / s.totalBytes) * 100,
          // )
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
      <div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        exit="exit"

      className='container mx-auto shadow flex justify-center'>
        <div className="w-full mt-[1.5rem]">
     <Header>
       {error && <div className='bg-red-400 mt-2 py-2 px-4 text-white font-medium'>{error}</div>}
       <button
          onClick={_ => setChoix("personal")}
          autoFocus
          className={`outline-none font-bold py-2 px-4 rounded border-2 focus:bg-gray-200`}>
           {setting?.personal}
        </button>
       <button
          onClick={_ => setChoix("contact")}
          className={`outline-none font-bold py-2 px-4 rounded border-2 focus:bg-gray-200`}
          >
          {setting?.contact}
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
               <input onChange={change} name="firstName" id="firstName" type="text" placeholder={currentUserInfo?.firstName} />
             </div>

             <div className={`inputs ${currentLang === "ar" ? "flex-row-reverse": ""} `}>
               <label className={`${currentLang === "ar" ? "flex-row-reverse": ""}`} htmlFor="email">{setting?.email}</label>
               <input onChange={change} name="email" id="email" type="email" placeholder={currentUserInfo?.email} />
             </div>

             <div className={`inputs ${currentLang === "ar" ? "flex-row-reverse": ""} `}>
               <label className={`${currentLang === "ar" ? "flex-row-reverse": ""}`} htmlFor="password">{setting?.password}</label>
               <input onChange={changePasswd} name="password" id="password" type="password" placeholder={setting?.password} />
             </div>

             <div className={`inputs ${currentLang === "ar" ? "flex-row-reverse": ""} `}>
               <label className={`${currentLang === "ar" ? "flex-row-reverse": ""}`} htmlFor="cpassword">{setting?.repeatPass}</label>
               <input onChange={changePasswd} name="cpassword" id="cpassword" type="password" placeholder={setting?.repeatPass} />
             </div>
           {currentUserInfo?.jobId &&
             <>
               <div className={`inputs ${currentLang === "ar" ? "flex-row-reverse": ""} `}>
                 <label className={`${currentLang === "ar" ? "flex-row-reverse": ""}`} htmlFor="address">Address</label>
                 <SelectForm v={false} title={userCityValue}  choices={ cities } setProperty={(city)=>setCity(city)}/>
                 <SelectForm v={false} title={userNeighborhoodValue}  choices={ neighborhoods } setProperty={(city)=>setUserNeighborhood(city)}/>
              </div>
              <div className={`inputs ${currentLang === "ar" ? "flex-row-reverse": ""} `}>
                <label className={`${currentLang === "ar" ? "flex-row-reverse": ""}`} htmlFor="job">Category</label>
                <SelectForm v={false} title={categoryName} choices={ categories } setProperty={(cat)=>setCategory(cat)}/>
                <SelectForm v={false} title={subCategoryName} choices={ subCategories } setProperty={(subCat)=>setSubCategory(subCat)}/>
              </div>
              </>
            }

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

                           <input onChange={change} name="facebookAccountUrl" id="facebookAccountUrl" type="text" placeholder={currentUserInfo?.facebookAccountUrl} />
                         </div>

                         <div className={`inputs ${currentLang === "ar" ? "flex-row-reverse": ""} `}>
                           <label className={`${currentLang === "ar" ? "flex-row-reverse": ""}`} htmlFor="youtubeAccountUrl">{setting?.youtube}</label>
                           <input onChange={change} name="youtubeAccountUrl" id="youtubeAccountUrl" type="text" placeholder={currentUserInfo?.youtubeAccountUrl} />
                         </div>

                         <div className={`inputs ${currentLang === "ar" ? "flex-row-reverse": ""} `}>
                         <label className={`${currentLang === "ar" ? "flex-row-reverse": ""}`} htmlFor="instagram">{setting?.instagram}</label>
                           <input onChange={change} name="instagramAccountUrl" id="instagramAccountUrl" type="text" placeholder={currentUserInfo?.instagramAccountUrl} />
                         </div>

                         <div className={`inputs ${currentLang === "ar" ? "flex-row-reverse": ""} `}>
                           <label className={`${currentLang === "ar" ? "flex-row-reverse": ""}`} htmlFor="websiteUrl">{setting?.website}</label>
                           <input onChange={change} name="websiteUrl" id="websiteUrl" type="text" placeholder={currentUserInfo?.websiteUrl}/>
                         </div>
            </>
            }
           </div>
       }
       </div>
       <div
         className="w-full py-[.5rem] pr-[1rem] flex justify-around">
         {
                !currentUserInfo?.jobId &&
                <Link
                    to="/addJob"
                    className="border-2 border-gray-500 text-gray-700 w-auto mr-1 hover:bg-gray-700 hover:text-white font-bold py-2 px-4 rounded">
                        {setting?.addJob}
                </Link>
          }
         <button
           onClick={handleSubmit}
           className="bg-blue-500 w-[150px] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
           {setting?.save}
         </button>
     </div>
     </Middle>
     </div>
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
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin: 1rem auto;
    overflow:hidden;
    background: red;
    input{
      display:none;
    }
    img {
      object-fit:cover;
      width:100%;
      height:100%;
      cursor:pointer;
    }
  }
  .inputs {
    flex-direction: row;
    border-radius:.5rem;
    padding:.5rem 1rem;
    justify-content:space-between;
    label {
      display: block;
      width:100%;
      display: flex;
    }
  }

  input, select {
    display: block;
    width: 100%;
    padding: 8px 16px;
    margin: .3rem auto;
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
