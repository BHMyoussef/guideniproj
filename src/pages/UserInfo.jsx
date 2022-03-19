import { addDoc, collection, doc, getDoc, getDocs, query  , where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import FeedBack from '../components/Feedback';
import Stars from '../components/Stars';
import StarsRate from '../components/StarsRate';
import { useAuth } from '../contexts/AuthProvider';
import { useLang } from '../contexts/LangProvider';
import { firestore } from '../firebase';

export default function UserInfo() {
    const [ userInformation, setUserInformation ] = useState();
    const [ userCity, setUserCity ] = useState()
    const [ galerieSelected , setgalerieSelected ] = useState(true);
    const [ feedback, setFeedback ] = useState();
    const [ rateme, setRatMe ] = useState(false);
    const [ canRate,setCanRate] = useState(false);
    const [ userJob, setUserJob ] = useState();
    const [ portFolio, setPortfolio ] = useState();

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
        ratingDetails: feedback
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
  return (
    <>
    {
    userInformation && 
      <div className='container mx-auto bg-bgcolor pt-4 pb-4 px-8 rounded-md'>
          <div className='flex flex-col md:flex-row items-center'>
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
                <span className='block text-lg font-light mb-4'>{userJob&&userJob.jobName[currentLang]}</span>
                {
                    !currentUser?
                      <div className='border-2 border-secondary px-4 py-2 hover:bg-secondary hover:text-white'>
                        <Link className='text-lg font-semibold ' to="/signin">{usersInfoTxt&&usersInfoTxt.signAlert}</Link>
                      </div>
                    :
                    <>
                      <span className='block text-lg'>{userInformation.phone}</span>
                      <span className='block text-lg'>{userCity}</span>
                    </>
                }
            </div>
            <div className='mt-8 flex md:flex-col gap-x-16 md:ml-auto gap-4'>
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
          <div>
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
                        <a key={i} target="blank" href={media.mediaUrl} className="overflow-hidden max-h-96">
                          <img src={media.mediaUrl} alt={media.mediaType} className="w-full h-full object-cover hover:scale-105 transition-all ease-in-out"/>
                        </a>
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
          { rateme && <RateMe txts={usersInfoTxt&&usersInfoTxt.feedbackWindow} hiddeRate={hiddeRate} canRate={canRate}  getRatingInformation={rateUser} /> }
      </div>
    }
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

