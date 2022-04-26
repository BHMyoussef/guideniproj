import { addDoc, collection, doc, getDoc, getDocs, query  , where } from 'firebase/firestore';
import { FaFacebookF, FaYoutube, FaInstagram} from 'react-icons/fa'
import { SiWebflow } from 'react-icons/si'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import FeedBack from '../components/Feedback';
import Icon from '../components/Icon';
import Stars from '../components/Stars';
import StarsRate from '../components/StarsRate';
import { useAuth } from '../contexts/AuthProvider';
import { useLang } from '../contexts/LangProvider';
import { firestore } from '../firebase';
import {FaWindowClose} from "react-icons/fa";


export default function UserInfo() {
    const [ userInformation, setUserInformation ] = useState();
    const [ userCity, setUserCity ] = useState()
    const [ galerieSelected , setgalerieSelected ] = useState(true);
    const [ feedback, setFeedback ] = useState();
    const [ rateme, setRatMe ] = useState(false);
    const [ canRate,setCanRate] = useState(false);
    const [ userJob, setUserJob ] = useState();
    const [ portFolio, setPortfolio ] = useState();
    // show/hide the popup modal
    const [showModal, setShowModal] = useState(false);
    // get the image url to popup
    const [imgUrl, setImgUrl] = useState(null);

    const { currentUser, currentUserInfo } = useAuth()
    const { userInfo:usersInfoTxt, currentLang } = useLang();

    const params = useParams('id')



    useEffect(()=>{
      getUserInfo();
      getPortfolio();
      getFeedback();
      getCanRate()
    },[])

    useEffect(()=>{
      getCanRate()
    },[currentUserInfo,userInformation])

    useEffect(()=>{
      getUserCity();
      getUserJob();
    },[userInformation])

    function getUserJob(){
      if(userInformation){
        const docRef = doc(firestore, `jobs/${userInformation.jobId}`)
        getDoc(docRef)
        .then(result=>{
          setUserJob(result.data())
        })
      }
    }

    function getPortfolio(){
      const colRef = collection(firestore,`users/${params.id}/portfolio`);
      let portfolioTmp = [];
      getDocs(colRef)
      .then(results=>{
        results.forEach(doc=>{
          portfolioTmp = [...portfolioTmp, doc.data().medias]
        })
        setPortfolio(portfolioTmp)
      })
    }

    function getUserInfo(){
      const docRef = doc(firestore, `users/${params.id}`)
      getDoc(docRef)
      .then(result=>{
        setUserInformation(result.data())
      })
    }

    function getUserCity(){
      if(userInformation){
        const docRef = doc(firestore,`cities/${userInformation.userCity}`)
        getDoc(docRef)
        .then(result=>{
          setUserCity(result.data().cityName)
        })
      }
    }

    function getCanRate(){
      if(!currentUser)
        return;
      let exist = false;
      if(currentUserInfo && userInformation){
        const colRef = collection(firestore,'ratings');
        const q = query(colRef,where('ratedUserId','==',userInformation.userId),where('raterId','==',currentUserInfo.userId))
        getDocs(q)
        .then(results=>{
          results.forEach(document=>{
            exist=true
          })
          if(exist)
            setCanRate(false)
          else
            setCanRate(true)
        })
      }
    }

    function getFeedback(){
      const colRef = collection(firestore,'ratings');
      const q = query(colRef,where('ratedUserId','==',params.id))
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

  function switchButton(e){
    if(e.target.id === "galerie")
     setgalerieSelected(true)
    if(e.target.id === "feedback")
     setgalerieSelected(false)
  }

  function rateUser(rating,feedback){

    if(canRate){
      const doc = {
        ratedUserId: userInformation.userId,
        raterId: currentUserInfo.userId,
        rating: rating,
        ratingDetails: feedback,
        ratingId:null
      }
      const colRef = collection(firestore,'ratings');
      addDoc(colRef,doc).then(docRef=>{
        setRatMe(false)
        setCanRate(false)
        getFeedback();
      })
    }
  }

  function hiddeRate(e){
    if(e.target.id==="cont")
      setRatMe(false);

  }
  // popup image function:
  function popupImg(url){
    setImgUrl(url);
    setShowModal(true);
  }

  return (
    <>
    {
<<<<<<< HEAD
    userInformation &&
      <div className='container mx-auto bg-bgcolor pt-4 pb-4 px-8 rounded-md'>
          <div className={`flex flex-col md:flex-row items-center ${(currentLang==="ar")&&" md:flex-row-reverse"}`}>
=======
    userInformation && 
      <div className='container lg:grid grid-flow-row-dense grid-cols-10 gap-4 auto-rows-auto mx-auto bg-bgcolor pt-4 pb-4 px-8 rounded-md'>
          <div className="hidden col-span-2 row-span-2 text-white lg:block">
            <span className='bg-gray-600 w-40 h-[600px] flex items-center justify-center'>Ads Here</span>
          </div>
          <div className={`col-start-3 col-span-6 flex flex-col md:flex-row items-center ${(currentLang==="ar")&&" md:flex-row-reverse"}`}>
>>>>>>> usef
            <div className='image-container w-48 h-48 mb-4'>
                  <img
                      className='h-full w-full rounded-full'
                      src={userInformation.imageUrl ||`${window.location.origin}/resources/profile.png`}
                      alt="profile photo"
                  />
            </div>
            <div className='ml-14'>
              <h3 className='font-semibold text-2xl mt-2'>
                  {userInformation.firstName}
                </h3>
                  <Stars rate={userInformation.rating}/>
                <span className='block text-lg font-light mb-2'>{userJob&&userJob.jobName[currentLang]}</span>
                {
                    !currentUser?
                      <div className='border-2 border-secondary px-4 py-2 hover:bg-secondary hover:text-white'>
                        <Link className='text-lg font-semibold ' to="/signin">{usersInfoTxt&&usersInfoTxt.signAlert}</Link>
                      </div>
                    :
                    <>
                      <span className='block text-md'>{userCity}</span>
                      <span className='block text-md'>Email: {userInformation.email}</span>
                      <span className='block text-md'>Phone: {userInformation.phone}</span>
                      <div className='flex gap-x-4 mt-2'>
                          <Icon icon={ <a href={userInformation.facebookAccountUrl} target="blank"><FaFacebookF className='group-hover:text-blue-500'/></a> } />
                          <Icon icon={ <a href={userInformation.instagramAccountUrl} target="blank"><FaInstagram className='group-hover:text-pink-400'/></a> } />
                          <Icon icon={ <a href={userInformation.youtubeAccountUrl} target="blank"><FaYoutube className='group-hover:text-red-500'/></a> } />
                          <Icon icon={ <a href={userInformation.websiteUrl} target="blank"><SiWebflow className='group-hover:text-blue-800'/></a> } />
                      </div>
                    </>
                }
            </div>
            <div className={`mt-8 flex md:flex-col gap-x-16 gap-4 ${(currentLang==="ar")?" md:mr-auto":" md:ml-auto"}`}>
              <div className='text-center text-lg'>
                  <p>{usersInfoTxt&&usersInfoTxt.totalNote}</p>
                  <span className='font-bold text-lg'>{userInformation.rating}</span>
              </div>
              <div className='text-center text-lg'>
                  <p>{usersInfoTxt&&usersInfoTxt.rate}</p>
                  <span className='block font-bold'>{userInformation.rating}/5</span>
              </div>
              <button
                  className="py-1 px-2 mt-2 border-2 border-secondary hover:bg-secondary hover:text-white font-semibold"
                  onClick={()=>{setRatMe(true)}}
              >
                {usersInfoTxt&&usersInfoTxt.feedBackOrder}
              </button>
            </div>
          </div>
          <div className='col-span-6 col-start-3'>
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
                ?
                    portFolio && portFolio.map(elm=>
                      elm.map((media,i)=>
                        <div key={i} target="blank" href={media.mediaUrl} onClick={() => popupImg(media.mediaUrl)}
                          data-bs-toggle="modal" data-bs-target="#exampleModalFullscreen"
                          className="overflow-hidden max-h-96">
                          <img src={media.mediaUrl} alt={media.mediaType} className="w-full h-full object-cover hover:scale-105 transition-all ease-in-out"/>
                        </div>
                      )
                  )
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
          { rateme && <RateMe txts={usersInfoTxt&&usersInfoTxt.feedbackWindow} hiddeRate={hiddeRate} canRate={canRate}  getRatingInformation={rateUser} /> }
      </div>
    }
    {showModal && <PopupModal url={imgUrl} setShowModal={setShowModal}/>}
    </>
  )
}

function RateMe({getRatingInformation, canRate, hiddeRate,txts}){
  const [rating, setRating] = useState();
  const [feedbackMessage, setFeedbackMessage] = useState();
  const [error, setError] = useState();
  const [ btn, setbtn] = useState(false);

  function submit(){
    setbtn(true)
    if(feedbackMessage === "" || feedbackMessage===undefined){
      setError(txts&&txts.error1);
    }
    else if(rating===undefined){
      setError(txts&&txts.error2);
    }
    else if(canRate===false){
      setError(txts&&txts.error3);
    }
    else{
      setError("")
      getRatingInformation(rating,feedbackMessage);
    }
  }

  function getRating(id){
    setRating(id)
  }

  return (
    <div onClick={hiddeRate} id="cont" className='fixed top-0 left-0 w-screen h-screen bg-transparent'>
      <div
        className='w-2/3 bg-additional text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-2 px-4 rounded-lg'
        >
          <h2 className='text-3xl font-semibold text-white text-center'>{txts&&txts.feedbackCall}</h2>
          <StarsRate getRating={getRating} className="justify-center my-2"/>
          {error && <div className='bg-red-400 w-4/5 mx-auto text-white font-semibold py-2 px-4'>{error}</div>}
          <textarea
            onChange={(event)=>{setFeedbackMessage(event.target.value)}}
            className='block w-4/5 h-48 resize-none mx-auto text-left py-2 px-4 text-xl bg-bgcolor' />
          <button
          className='py-2 px-4 rounded-md mt-4 hover:bg-secondary hover:text-white bg-bgcolor text- text-lg'
            onClick={submit}
            disabled={btn}
          >
            submit
          </button>
      </div>
    </div>

  );
}

function PopupModal({url,setShowModal}) {
  function handleExit(e) {
    if(e.target.classList.contains('popup')){
      console.log({d: e.target.classList.contains('popup')})
      setShowModal(false);
    }
  }
  console.log({url, setShowModal});
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
