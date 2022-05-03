import { collection, doc, getDoc, getDocs, query, addDoc, where, updateDoc, deleteField } from "firebase/firestore";
import { FaFacebookF, FaYoutube, FaInstagram, FaCalendar} from 'react-icons/fa'
import { SiWebflow } from 'react-icons/si'
import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import FeedBack from "../components/Feedback";
import Stars from "../components/Stars";
import { useAuth } from "../contexts/AuthProvider";
import { useLang } from "../contexts/LangProvider";
import { firestore, storage, functions } from "../firebase";
import {FaPlusCircle, FaArrowLeft,FaAward} from "react-icons/fa"
import { AiFillCloseCircle } from "react-icons/ai"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Input from "../components/Input";
import Joi from "joi";
import Icon from "../components/Icon";
import {httpsCallable } from "firebase/functions";

// import DatePicker from "react-datepicker";
import DateTimePicker from 'react-datetime-picker';


function Profile() {
  /**
  console.log({httpsCallable, functions});
  for later use:
  const func_name = httpsCallable(functions, 'func_name');
  func_name({ params })
  .then((result) => {
    // Read result of the Cloud Function.
    const data = result.data;
    ...
  });
  ['normal']
  */
    const [ userJob, setUserJob ] = useState();
    const [ userCity, setUserCity ] = useState("");
    const [ galerieSelected , setgalerieSelected ] = useState(true);
    const [ addGallerie ,setAddGallerie ] = useState(false)
    const [ portFolio, setPortfolio ] = useState();
    const [ disabledbtn, setDisabledbtn ] = useState(true);
    const [ feedback, setFeedback ] = useState();
    const [ error, setError ] = useState();

    const [ title, setTitle] = useState()
    const [ description, setDescription] = useState()
    const [ images, setImages ]= useState([]);

    const { currentUser, currentUserInfo, updateUserInfo } = useAuth();
    const { userInfo:usersInfoTxt, currentLang, profile } = useLang();

    // show/hide the popup modal
    const [showModal, setShowModal] = useState(false);
    //  datePicker modal
    const [datePicker, setDatePicker] = useState(false);
    // are u sure modal
    const [showSure, setShowSure] = useState(false);
    // get the image url to popup
    const [imgUrl, setImgUrl] = useState(null);

    const schema = {
      title: Joi.string().required(),
      description: Joi.string().required(),
      images:Joi.required()

  }

    useEffect(()=>{
        getUserJob();
        getUserCity();
        getPortfolio();
        getFeedback();
    },[])

    useEffect(()=>{
      const result = Joi.object(schema).validate({title,description,images})
      if(result.error)
          setError(result.error.details[0].message)
      else
          setError()

    },[title,description,images])

    function getPortfolio(){
      if(!currentUserInfo) return
      const colRef = collection(firestore,`users/${currentUserInfo?.userId}/portfolio`);
      let portfolioTmp = [];
      getDocs(colRef)
      .then(results=>{
        results.forEach(doc=>{
          portfolioTmp = [...portfolioTmp, {docId: doc.id, ...doc.data()}]
        })
        setPortfolio(portfolioTmp)
      })
    }

    function getFeedback(){
      if(!currentUserInfo) return
      const colRef = collection(firestore,'ratings');
      const q = query(colRef,where('ratedUserId','==',currentUserInfo?.userId))
      let tmpFeedback = []
      getDocs(q)
      .then(results=>{
        results.forEach(document=>{
          let docRef = doc(firestore, `users/${document.data().raterId}`)
          getDoc(docRef)
          .then(result=>{
            let info = result.data();
            let feed = {image: info?.imageUrl, name:info?.firstName, rateDetails: document.data().ratingDetails, rate: document.data().rating}
            tmpFeedback = [...tmpFeedback,feed];
            setFeedback(tmpFeedback)
          })
        })
      })
    }

    function getUserJob(){
        if(currentUser){
          const docRef = doc(firestore, `jobs/${currentUserInfo.jobId}`)
          getDoc(docRef)
          .then(result=>{
            setUserJob(result.data())
          })
        }
    }
    function getUserCity(){
        if(currentUser){
          const docRef = doc(firestore,`cities/${currentUserInfo.userCity}`)
          getDoc(docRef)
          .then(result=>{
            setUserCity(result.data()?.cityName)
          })
        }
    }

    function switchButton(e){
      if(e.target.id === "galerie")
       setgalerieSelected(true)
      if(e.target.id === "feedback")
       setgalerieSelected(false)
    }

    function handleImageChange(e){
      Array.from(e.target.files).map((image)=>{
        const obj = {
          image: image,
          imageUrl: URL.createObjectURL(image),
          progress:0
        }
        setImages(prev=>[...prev,obj])
      })
    }

    function uploadImages(){
      let imagesInfos = [];
      return new Promise((resolve,reject)=>{
        images.map((image,i)=>{
          //upload images
          const storageRef = ref(storage, `UsersFiles/${currentUserInfo.userId}/${Date.now()}${image.image.name}`)
          /* To upload file to firebase/storage*/
          const uploadImage = uploadBytesResumable(storageRef, image.image)
          uploadImage.on('state_changed',
            // work with uploaded file
            (snapshot) => {
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
              )
              // -> update progress bar
              setImages(prev=>{
                const test = [...prev]
                test[i].progress = progress
                return  test
              })
            }, // to handle Errors
            (err) => {
              console.error('Error: ', err)
            },
            // When the upload is complete
            () => {
              // GET image URL:
              getDownloadURL(uploadImage.snapshot.ref).then((url) => {
                imagesInfos = [...imagesInfos,{
                  mediaId:image.imageUrl.split("/")[3],
                  mediaType:"image",
                  mediaUrl:url
                }]
                if(images.length-1 === i)
                  resolve(imagesInfos)
              })
            }
          )
        })
      })
    }

    function handleSubmit(){
      uploadImages().then(result=>{
        console.log(currentUserInfo.userId)
        const colRef = collection(firestore,`users/${currentUserInfo.userId}/portfolio`)
        addDoc(colRef,{
          title:title,
          description: description,
          medias: result
        })
        getPortfolio()
        setImages([])
        setTitle('');
        setDescription('');
        setAddGallerie(false)
      })
    }

    function deleteImage(docId, imageId){
      console.log({docId, imageId})
      const docRef = doc(firestore, `users/${currentUserInfo.userId}/portfolio/${docId}`)
      getDoc(docRef)
      .then(result=>{
        const filtredImages=result.data().medias.filter(image=>image.mediaId!==imageId)

        updateDoc(docRef,{medias:filtredImages})
      })
      .then(()=>{
        getPortfolio()
      })
    }

    // Handle PopUp
    // popup image function:
    function popupImg(url){
      setImgUrl(url);
      setShowModal(true);
    }

    return (
        !currentUser ?
        <img className='absolute left-1/2 -translate-x-1/2' src={`${window.location.origin}/resources/13525-empty.gif`} alt='empty' />
        :
        <>
          <div className="profile container lg:grid grid-flow-row-dense grid-cols-10 gap-4 auto-rows-auto mx-auto">
              <div className="hidden col-span-2 row-span-2 text-white lg:block">
                <span className='bg-gray-600 w-40 h-[600px] flex items-center justify-center'>Ads Here</span>
              </div>
              <div className={`col-start-3 col-span-6 flex flex-col md:flex-row items-center ${(currentLang==="ar")&&" md:flex-row-reverse"}`}>
                <div className='image-container w-48 h-48 mb-4 cursor-pointer' onClick={() => popupImg(currentUserInfo?.imageUrl)}
                  data-bs-toggle="modal" data-bs-target="#exampleModalFullscreen">
                    <img
                        className='h-full w-full rounded-full'
                        src={currentUserInfo?.imageUrl ||`${window.location.origin}/resources/profile.png`}
                        alt="profile photo"
                    />
                </div>
                <div className='ml-14'>
                      {/* For the name i just changed justify-evenly --> justify-start  */}
                    <h3 className='font-semibold text-2xl mt-2  flex justify-start items-center'>
                      {currentUserInfo?.firstName}
                    </h3>
                      {userJob&&<Stars rate={currentUserInfo?.rating}/>}
                    <span className='block text-lg font-light mb-2'>{userJob&&userJob.jobName[currentLang]}</span>
                    {
                        <>
                          <span className='block text-md'>{userCity}</span>
                          <span className='block text-md'>Email: {currentUserInfo?.email}</span>
                          <span className='block text-md'>{currentUserInfo?.phone}</span>
                          <div className='flex gap-x-4 mt-2'>
                            {/* Just removed the 'Url' word at the end of the property*/}
                              <Icon icon={ <a href={currentUserInfo?.facebookAccount} target="blank"><FaFacebookF className='group-hover:text-blue-500'/></a> } />
                              <Icon icon={ <a href={currentUserInfo?.instagramAccount} target="blank"><FaInstagram className='group-hover:text-pink-400'/></a> } />
                              <Icon icon={ <a href={currentUserInfo?.youtubeAccount} target="blank"><FaYoutube className='group-hover:text-red-500'/></a> } />
                            <Icon icon={ <a href={currentUserInfo?.website} target="blank"><SiWebflow className='group-hover:text-blue-800'/></a> } />
                          </div>

                          {currentUserInfo?.jobId.toLowerCase() === "normalpharmacy"?
                          <button
                            onClick={() => setDatePicker(true)}
                           className="
                              my-[1rem] bg-transparent
                              hover:bg-green-500 text-green-500
                              font-semibold hover:text-white
                              py-2 px-4 border border-green-500
                              hover:border-transparent rounded
                            ">
                          {profile?.pharmacy}
                          </button> : ''}

                          {currentUserInfo?.jobId.toLowerCase() === "guardpharmacy"?
                          <button
                            onClick={() => setShowSure(true)}
                           className="
                            my-[1rem] bg-transparent
                            hover:bg-rose-500 text-rose-500
                            font-semibold hover:text-white
                            py-2 px-4 border border-rose-500
                            hover:border-transparent rounded
                            ">
                          {profile?.retToNormal}
                          </button> : ''}

                        </>
                    }
                </div>
                <div className={`mt-8 flex md:flex-col gap-x-16 gap-4 ${(currentLang==="ar")?" md:mr-auto":" md:ml-auto"}`}>
                    {
                        currentUserInfo?.jobId &&
                        <>
                        <div className={`text-center text-lg px-4 py-2 flex items-center justify-evenly ${currentLang==="ar" ? "flex-row-reverse" :""}`}>
                            <p className="pr-4">{Profile?.rank}</p>
                          <div className={`flex items-center justify-evenly ${currentLang==="ar" ? "flex-row-reverse" :""}`}>
                          <img src={`${window.origin}/resources/rank/${currentUserInfo?.rank.toLowerCase()}.svg`} alt={currentUserInfo?.rank} />
                        <span className={`font-bold text-${currentUserInfo?.rank}`}>{currentUserInfo?.rank}</span>
                          </div>
                        </div>
                        <div className='text-center text-lg'>
                            <p>{usersInfoTxt&&usersInfoTxt.totalNote}</p>
                            <span className='font-bold text-lg'>{currentUserInfo?.rating}</span>
                        </div>
                            <div className='text-center text-lg'>
                                <p>{usersInfoTxt&&usersInfoTxt.rate}</p>
                            <   span className='block font-bold'>{currentUserInfo?.rating}/5</span>
                            </div>
                        </>
                    }
                </div>
            </div>
            <div className="col-span-6 col-start-3">
              <div className='buttons mt-8'>
                <button className={`w-1/2 pt-4 pb-4 px-8 ${galerieSelected? 'bg-secondary':'bg-bgcolor'} border-4 border-secondary font-medium text-lg hover:bg-opacity-90`}
                        onClick={switchButton}
                        id="galerie"
                >
                  {usersInfoTxt&&usersInfoTxt.galerie}
                </button>
                <button className={`w-1/2 pt-4 pb-4 px-8 ${galerieSelected?'bg-bgcolor': 'bg-secondary'} border-4 border-secondary font-medium text-lg hover:bg-opacity-90`}
                        onClick={switchButton}
                        id="feedback"
                >
                  {usersInfoTxt&&usersInfoTxt.feedback}
                </button>
              </div>
              <div className={`px-8 py-4 pb-8 border-b-4 border-l-4 border-r-4 border-secondary ${galerieSelected?'grid md:grid-cols-2 lg:grid-cols-3 gap-2':'block'} `}>
                {
                  galerieSelected
                  ? <>
                    {
                      portFolio && portFolio.map(elm=>
                        elm.medias.map((media,i)=>
                          <div className="hover:scale-105 transition-all relative ease-in-out">
                            <a key={i} target="blank" href={media.mediaUrl} className="overflow-hidden max-h-96">
                              <img src={media.mediaUrl} alt={media.mediaType} className="w-full h-full object-cover"/>
                            </a>
                            <button onClick={()=>{deleteImage(elm.docId, media.mediaId)}} className="text-red-500 absolute top-0 right-0 z-10 hover:scale-105"><AiFillCloseCircle size={32}/></button>
                          </div>
                        )
                      )
                    }
                        <div className="flex justify-center items-center">
                          <button onClick={()=>setAddGallerie(true)} className="h-20 w-20 flex justify-center items-center rounded-full bg-secondary object-cover hover:scale-105 transition-all ease-in-out">
                            <FaPlusCircle size={38} color="#ffffff" />
                          </button>
                        </div>
                        {
                          addGallerie &&
                          <div className="fixed w-9/12 rounded-md z-20 shadow-lg top-1/2 left-1/2 -translate-x-1/2 items-center justify-between -translate-y-1/2 flex flex-col px-4 py-8 bg-bgcolor">
                            <div onClick={()=>{setAddGallerie(false)}} className="w-full"><FaArrowLeft size={23} className="mb-4 cursor-pointer hover:scale-110"/></div>
                            { error && <div className='bg-red-400 mt-2 py-2 px-4 text-white font-medium'>{error}</div>}
                            <Input name="text" type="text" value={title} label={profile?.title} onChange={(e)=>setTitle(e.target.value)}  />
                            <div className="mb-4 w-full">
                              <label
                                      className="inline-block text-lg font-medium "
                                      htmlFor = "description">{profile?.description}
                              </label>
                              <textarea id="description" className="resize-none border-2 rounded-md outline-none py-1 px-2 w-full h-28" value={description} onChange={(e)=>setDescription(e.target.value)}  />
                            </div>
                            <input type="file" multiple name="image" id="image" className="mb-2" onChange={handleImageChange}/>
                            <div className="images flex gap-2 flex-wrap">
                              { images&&images.map((image,i)=>
                                <div key={i} className="">
                                  <img className="w-32 mb-4 h-24" src={image.imageUrl} alt="image" />
                                  <div className="progress input bg-secondary h-3">
                                    <div
                                      className="progress-bar progress-bar-stripped flex justify-center items-center text-[10px] bg-additional h-3"
                                      style={{ width: `${image.progress}%` }}
                                    >
                                      {`${image.progress}%`}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <button onClick={handleSubmit} disabled={disabledbtn && error} className="px-4 py-2 bg-additional text-white font-medium text-lg rounded-md hover:bg-secondary hover:text-white mt-4 disabled:opacity-80">{profile?.add}</button>
                          </div>
                        }
                    </>
                  :
                    feedback && feedback.map((feed,i)=>{
                      return(
                        <FeedBack
                          key={i}
                          name = {feed.name}
                          image = { feed.image }
                          rateDetails = { feed.rateDetails }
                          rate = { feed.rate }
                        />
                      )
                    })
                }
              </div>
            </div>
            <div className="hidden col-span-2 row-span-2 text-white lg:block">
              <span className='bg-gray-600 w-40 h-[600px] flex items-center justify-center ml-auto'>Ads Here</span>
            </div>
          </div>
          {showModal && <PopupModal url={imgUrl} setShowModal={setShowModal}/>}
          {datePicker &&
            <DatePickers
              setDatePicker={setDatePicker}
              profile={profile}
              currentLang={currentLang}
              currentUserInfo={currentUserInfo}
              updateUserInfo={updateUserInfo}
              />
          }
          {showSure &&
            <AreUSure
              setShowSure={setShowSure}
              profile={profile}
              currentLang={currentLang}
              currentUserInfo={currentUserInfo}
              updateUserInfo={updateUserInfo}
              />
          }
        </>
     );
}

function PopupModal({url,setShowModal}) {
  function handleExit(e) {
    if(e.target.classList.contains('popup')){
      setShowModal(false);
    }
  }
  return (
    <>
          <div
            onClick={handleExit}
            className="popup justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-neutral-100 outline-none focus:outline-none">
                {/*body*/}
                <div className="relative p-6 pb-0 flex-auto rounded-lg overflow-hidden">
                  <img className="object-fill max-h-[600px] max-w-full rounded-lg" src={url} alt="Popup image"/>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-center rounded-b p-4">
                  <button
                    className="bg-red-500 text-white border-solid border-2 border-rose-500 rounded-lg  font-bold uppercase px-10 py-4 text-sm outline-none focus:outline-none  ease-linear transition-all duration-150 hover:text-red-500 hover:bg-white hover:border-red-500"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-80 fixed inset-0 z-40 bg-black"></div>
        </>
  )
}

function DatePickers({setDatePicker, profile, currentLang, currentUserInfo, updateUserInfo}){
  const [from, setFrom] = useState(new Date());
  const [to, setTo] = useState(new Date());

  function handleExit(e){
    if(e.target.classList.contains('popup')){
      setDatePicker(false);
    }
  }
/**

JobId:
normalPharmacy
guardPharmacy
jobDetails
(map)
endDate 1651363200000
jobWhenEndDate "normalPharmacy"
startDate 1651363200000
*/

  function handleSubmit(){
    const docRef = doc(firestore, `users/${currentUserInfo.userId}`);
    const data = {
      "jobId": "guardPharmacy",
      "jobDetails": {
        "endDate": to.getTime(),
        "jobWhenEndDate": "normalPharmacy",
        "startDate": to.getTime(),
      }
    }
    updateDoc(docRef, data)
      .then(result => {
        console.log({result});
        updateUserInfo();
        setDatePicker(false)
      })
    console.log({from, to})
    console.log({docRef})
  }

  return (
    <>
          <div
            onClick={handleExit}
            className="popup justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-neutral-100 outline-none focus:outline-none">
                {/*body*/}
                <div className="relative w-full p-6 pb-0 flex-auto rounded-lg ">
                <div className="flex flex-col">
                  <h2 className={currentLang === "ar"&&"text-right"}>{profile.from} </h2>
                  <div className="
                  bg-white
                  w-full
                  flex items-center rounded  p-1 my-[1rem] cursor-pointer">
                    <DateTimePicker
                      calendarIcon={
                        <FaCalendar
                           size="25"
                           className="cursor-pointer w-full h-full"
                           />
                      }
                      clearIcon={
                        <AiFillCloseCircle
                          size={25}
                          />}
                      value={from}
                      onChange={date => setFrom(date)}
                      required={true}
                      minDate={new Date()}
                      maxDetail="second"
                      showLeadingZeros
                      className="
                      border-0
                      w-full
                      flex items-center justify-between rounded  cursor-pointer"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <h2 className={currentLang === "ar"&&"text-right"}>{profile.to} </h2>
                  <div className="
                  bg-white
                  w-full
                  flex items-center rounded  p-1 my-[1rem] cursor-pointer
                  ">

                  <DateTimePicker
                    calendarIcon={
                      <FaCalendar
                         size="25"
                         className="cursor-pointer w-full h-full"
                         />
                    }
                    clearIcon={
                      <AiFillCloseCircle
                        size={25}
                        />}
                    value={to}
                    onChange={date => setTo(date)}
                    required={true}
                    minDate={new Date()}
                    maxDetail="second"
                    showLeadingZeros
                    className="
                      border-0
                      w-full
                      flex items-center justify-between rounded cursor-pointer"
                  />
                  </div>
                </div>
                </div>
                {/* Err msg*/}

                <div className="flex items-center justify-center rounded-b p-4">
                <button
                  className="mr-[1rem] bg-blue-500 text-white border-solid border-2 border-blue-500 rounded-lg  font-bold uppercase px-10 py-4 text-sm outline-none focus:outline-none  ease-linear transition-all duration-150 hover:text-blue-500 hover:bg-white hover:border-blue-500"
                  type="button"
                  onClick={handleSubmit}
                >
                  {profile?.save}
                </button>

                <button
                  className="bg-red-500 text-white border-solid border-2 border-rose-500 rounded-lg  font-bold uppercase px-10 py-4 text-sm outline-none focus:outline-none  ease-linear transition-all duration-150 hover:text-red-500 hover:bg-white hover:border-red-500"
                  type="button"
                  onClick={() => setDatePicker(false)}
                >
                {profile?.cancel}

                </button>

                </div>
              </div>
            </div>
          </div>
          <div className="opacity-80 fixed inset-0 z-40 bg-black"></div>
        </>
  )
}

function AreUSure({setShowSure, profile, currentLang, currentUserInfo, updateUserInfo}){

  function handleExit(e){
    if(e.target.classList.contains('popup')){
      setShowSure(false);
    }
  }

  function handleSubmit(){
    console.log('Back to normal');
    const docRef = doc(firestore, `users/${currentUserInfo.userId}`);
    const data = {
      "jobId": "normalPharmacy",
      jobDetails: deleteField()

    }
    updateDoc(docRef, data)
      .then(result => {
        console.log({result});
        updateUserInfo();
        setShowSure(false)
      })

  }

  return (
    <>
    <div
    onClick={handleExit}

      className="
        popup
        overflow-y-auto overflow-x-hidden
        fixed top-0 right-0 left-0 z-50
        md:inset-0 h-modal md:h-full
        flex items-center justify-center
      ">
      <div className="relative p-4 w-full max-w-md h-full md:h-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              onClick={() => setShowSure(false)}
              type="button"
              className="
                absolute top-3 right-2.5 text-gray-400
                bg-transparent rounded-lg text-sm p-1.5
                ml-auto inline-flex items-center
                dark:hover:bg-gray-800 dark:hover:text-white
                ">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
            </button>
            <div className="p-6 text-center">
                <svg className="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <h3
                className="
                  mb-5 text-lg font-normal
                  text-gray-500 dark:text-gray-400
                  ">
                  {profile?.sureText}
              </h3>
                <button
                  onClick={handleSubmit}
                  type="button"
                  className="
                    text-white bg-red-600 hover:bg-red-500
                    focus:ring-4 font-medium rounded-lg text-sm
                     inline-flex items-center px-5 py-2.5 text-center mr-2
                   ">
                    {profile?.yes}
                </button>
                <button
                  onClick={() => setShowSure(false)}
                  type="button"
                  className="
                    text-gray-500 bg-white
                    hover:bg-gray-100 focus:ring-4
                    focus:outline-none focus:ring-gray-200
                    rounded-lg border border-gray-200
                    text-sm font-medium px-5 py-2.5
                    hover:text-gray-500 focus:z-10
                    dark:bg-gray-700 dark:text-gray-300
                    dark:border-gray-500 dark:hover:text-white
                    dark:hover:bg-gray-600 dark:focus:ring-gray-600
                ">
                {profile?.cancel}
                </button>
            </div>
        </div>
      </div>
      </div>

          <div className="opacity-80 fixed inset-0 z-40 bg-black"></div>
        </>
    )
}

export default Profile;
