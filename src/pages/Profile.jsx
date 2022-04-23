import { collection, doc, getDoc, getDocs, query, addDoc, where, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import FeedBack from "../components/Feedback";
import Stars from "../components/Stars";
import { useAuth } from "../contexts/AuthProvider";
import { useLang } from "../contexts/LangProvider";
import { firestore, storage } from "../firebase";
import {FaPlusCircle, FaArrowLeft} from "react-icons/fa"
import { AiFillCloseCircle } from "react-icons/ai"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Input from "../components/Input";
import Joi from "joi";

function Profile() {
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
        const filtredImages=result.data().medias.filter(image=>image.mediaId!=imageId)
        
        updateDoc(docRef,{medias:filtredImages})
      })
      .then(()=>{
        getPortfolio()
      })
    }
    return ( 
        !currentUser ? <Navigate to="/" /> :
        <div className="profile container mx-auto">
            <div className={`flex flex-col md:flex-row items-center ${(currentLang==="ar")&&" md:flex-row-reverse"}`}>
              <div className='image-container w-48 h-48 mb-4'>
                  <img 
                      className='h-full w-full rounded-full'
                      src={currentUserInfo.imageUrl ||`${window.location.origin}/resources/profile.png`} 
                      alt="profile photo" 
                  />
              </div>
              <div className='ml-14'>
                  <h3 className='font-semibold text-2xl mt-2'>
                    {currentUserInfo.firstName}
                  </h3>
                    {userJob&&<Stars rate={currentUserInfo.rating}/>}
                  <span className='block text-lg font-light mb-4'>{userJob&&userJob.jobName[currentLang]}</span>
                  {
                      <>
                        <span className='block text-lg'>{currentUserInfo.phone}</span>
                        <span className='block text-lg'>{userCity}</span>
                      </>
                  }
              </div>
              <div className={`mt-8 flex md:flex-col gap-x-16 gap-4${(currentLang==="ar")?" md:mr-auto":" md:ml-auto"}`}>
                  {
                      currentUserInfo.jobId ?
                      <>
                          <div className='text-center text-lg'>
                              <p>{usersInfoTxt&&usersInfoTxt.totalNote}</p>
                              <span className='font-bold text-lg'>{currentUserInfo?.rating}</span>
                          </div>
                          <div className='text-center text-lg'>
                              <p>{usersInfoTxt&&usersInfoTxt.rate}</p>
                          <   span className='block font-bold'>{currentUserInfo?.rating}/5</span>
                          </div>
                      </>
                      :
                        <Link to="/addJob" className="py-2 px-4 mt-2 border-2 text-lg rounded-lg border-secondary hover:scale-110 hover:bg-secondary hover:text-white font-bold"
                        >
                              <FaPlusCircle className="mx-auto" size={28} />
                              {profile?.addJob}
                            
                        </Link>
                  }                
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
        </div>
     );
}

export default Profile;