import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import { SiWebflow } from "react-icons/si";
import Share from "../components/Share";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FeedBack from "../components/Feedback";
import Icon from "../components/Icon";
import Stars from "../components/Stars";
import StarsRate from "../components/StarsRate";
import Signaler from "../components/Signaler";
import DotsMenu from "../components/DotsMenu";

import { useAuth } from "../contexts/AuthProvider";
import { useLang } from "../contexts/LangProvider";
import { firestore } from "../firebase";

import { HiDotsVertical } from "react-icons/hi";

// animation things
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, popup, dropIn } from "../animation";

export default function UserInfo() {
  const [userInformation, setUserInformation] = useState();
  const [userCity, setUserCity] = useState();
  const [userNeighborhood, setUserNeighborhood] = useState();
  const [galerieSelected, setgalerieSelected] = useState(true);
  const [feedback, setFeedback] = useState();
  const [signaler, setSignaler] = useState(false);
  const [rateme, setRatMe] = useState(false);
  const [canRate, setCanRate] = useState(false);
  const [userJob, setUserJob] = useState();
  const [portFolio, setPortfolio] = useState();
  // show/hide the popup modal
  const [showModal, setShowModal] = useState(false);
  // get the image url to popup
  const [imgUrl, setImgUrl] = useState(null);

  // formate date
  const [formatedDate1, setFormatedDate1] = useState("");
  const [formatedDate2, setFormatedDate2] = useState("");

  const { currentUser, currentUserInfo } = useAuth();
  const { userInfo: usersInfoTxt, currentLang } = useLang();
  const params = useParams("id");

  useEffect(() => {
    getUserInfo();
    getPortfolio();
    getFeedback();
    getCanRate();
    formatDate(
      userInformation?.jobDetails.startDate,
      userInformation?.jobDetails.endDate
    );
  }, []);

  useEffect(() => {
    getCanRate();
  }, [currentUserInfo, userInformation]);

  useEffect(() => {
    getUserCity();
    getUserJob();
  }, [userInformation]);

  function getUserJob() {
    if (userInformation) {
      const docRef = doc(firestore, `jobs/${userInformation.jobId}`);
      getDoc(docRef).then((result) => {
        setUserJob(result.data());
      });
    }
  }

  function getPortfolio() {
    const colRef = collection(firestore, `users/${params.id}/portfolio`);
    let portfolioTmp = [];
    getDocs(colRef).then((results) => {
      results.forEach((doc) => {
        portfolioTmp = [...portfolioTmp, doc.data().medias];
      });
      setPortfolio(portfolioTmp);
    });
  }

  function getUserInfo() {
    const docRef = doc(firestore, `users/${params.id}`);
    getDoc(docRef).then((result) => {
      setUserInformation(result.data());
    });
  }

  function getUserCity() {
    if (userInformation) {
      let docRef = doc(firestore, `cities/${userInformation.userCity}`);
      getDoc(docRef).then((result) => {
        setUserCity(result.data().cityName);
      });
      docRef = doc(
        firestore,
        `cities/${userInformation.userCity}/neighborhoods/${userInformation?.userNeighborhood}`
      );

      getDoc(docRef).then((result) => {
        setUserNeighborhood(result.data().neighborhoodName);
      });
    }
  }

  function getCanRate() {
    if (!currentUser) return;
    let exist = false;
    if (currentUserInfo && userInformation) {
      const colRef = collection(firestore, "ratings");
      const q = query(
        colRef,
        where("ratedUserId", "==", userInformation.userId),
        where("raterId", "==", currentUserInfo.userId)
      );
      getDocs(q).then((results) => {
        results.forEach((document) => {
          exist = true;
        });
        if (exist) setCanRate(false);
        else setCanRate(true);
      });
    }
  }

  function getFeedback() {
    const colRef = collection(firestore, "ratings");
    const q = query(colRef, where("ratedUserId", "==", params.id));
    let tmpFeedback = [];
    getDocs(q).then((results) => {
      results.forEach((document) => {
        let docRef = doc(firestore, `users/${document.data().raterId}`);
        getDoc(docRef).then((result) => {
          let info = result.data();
          console.log({ info });
          let feed = {
            image: info?.imageUrl,
            name: info?.firstName,
            rateDetails: document.data().ratingDetails,
            rate: document.data().rating,
            rank: info?.rank.toString(),
          };
          tmpFeedback = [...tmpFeedback, feed];
          setFeedback(tmpFeedback);
        });
      });
    });
  }

  function switchButton(e) {
    if (e.target.id === "galerie") setgalerieSelected(true);
    if (e.target.id === "feedback") setgalerieSelected(false);
  }

  function rateUser(rating, feedback) {
    if (canRate) {
      const doc = {
        ratedUserId: userInformation.userId,
        raterId: currentUserInfo.userId,
        rating: rating,
        ratingDetails: feedback,
        ratingId: null,
      };
      const colRef = collection(firestore, "ratings");
      addDoc(colRef, doc).then((docRef) => {
        setRatMe(false);
        setCanRate(false);
        getFeedback();
      });
    }
  }

  function hiddeRate(e) {
    if (e.target.id === "cont") setRatMe(false);
  }
  // popup image function:
  function popupImg(url) {
    setImgUrl(url);
    setShowModal(true);
  }

  function formatDate(
    from = userInformation?.jobDetails.startDate,
    to = userInformation?.jobDetails.endDate
  ) {
    if (userInformation?.jobId.toLowerCase() === "guardpharmacy") {
      const start = new Date(from);
      const end = new Date(to);

      const options = {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      const formateLang =
        (currentLang === "eng"
          ? "en-us"
          : currentLang === "fr"
          ? "fr"
          : "ar-ma") || "en-us"; // by default

      console.log({ formateLang });
      setFormatedDate1(start.toLocaleDateString(formateLang, options));
      setFormatedDate2(end.toLocaleDateString(formateLang, options));
      console.log({ start, end });
    }
  }

  const [openMenu, setOpenMenu] = useState(false);

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="show">
      {userInformation && (
        <div className="container lg:grid grid-flow-row-dense grid-cols-10 gap-4 auto-rows-auto mx-auto bg-bgcolor pt-4 pb-4 px-8 rounded-md">
          {/* <div className="hidden col-span-2 row-span-2 text-white lg:block">
            <span  className='bg-gray-600 w-40 h-[600px] flex items-center justify-center'>Ads Here</span>
          </div> */}
          <div
            className={` col-start-3 col-span-6 flex flex-col md:flex-row items-center ${
              currentLang === "ar" && " md:flex-row-reverse"
            }`}
          >
            <div
              className="image-container w-48 h-48 mb-4 cursor-pointer"
              onClick={() => popupImg(userInformation?.imageUrl)}
              data-bs-toggle="modal"
              data-bs-target="#exampleModalFullscreen"
            >
              <motion.img
                layoutId={userInformation.imageUrl}
                className="h-full w-full rounded-full"
                src={
                  userInformation.imageUrl ||
                  `${window.location.origin}/resources/profile.png`
                }
                alt="profile photo"
              />
            </div>
            <div className="ml-14">
              <h3 className="font-semibold text-2xl mt-2">
                {userInformation.firstName}
              </h3>
              <Stars rate={userInformation.rating} />
              <span className="block text-lg font-light mb-2">
                {userJob && userJob.jobName[currentLang]}
                {
                  // show the guard time availabilality
                  userInformation?.jobId.toLowerCase() === "guardpharmacy" && (
                    <div className="w-full px-[0.2rem] flex flex-col border-gray-100 border-2">
                      <h2 className={`${currentLang === "ar" && "self-end"}`}>
                        {usersInfoTxt?.from}
                      </h2>
                      <h2 className="pl-2">{formatedDate1}</h2>

                      <h2 className={`${currentLang === "ar" && "self-end"}`}>
                        {usersInfoTxt?.to}
                      </h2>

                      <h2 className="pl-2">{formatedDate2}</h2>
                    </div>
                  )
                }
              </span>
              {!currentUser ? (
                <div className="border-2 border-secondary px-4 py-2 hover:bg-secondary hover:text-white">
                  <Link className="text-lg font-semibold " to="/signin">
                    {usersInfoTxt && usersInfoTxt.signAlert}
                  </Link>
                </div>
              ) : (
                <>
                  {/*  user address here */}
                  <span className="block text-md">
                    {userNeighborhood + ", " + userCity}
                  </span>
                  <span className="block text-md">
                    Phone: {userInformation.phone}
                  </span>
                  <div className="flex gap-x-4 mt-2">
                    <Icon
                      icon={
                        <a
                          href={userInformation.facebookAccountUrl}
                          target="blank"
                        >
                          <FaFacebookF
                            size={25}
                            className="group-hover:text-blue-500"
                          />
                        </a>
                      }
                    />
                    <Icon
                      icon={
                        <a
                          href={userInformation.instagramAccountUrl}
                          target="blank"
                        >
                          <FaInstagram
                            size={25}
                            className="group-hover:text-pink-400"
                          />
                        </a>
                      }
                    />
                    <Icon
                      icon={
                        <a
                          href={userInformation.youtubeAccountUrl}
                          target="blank"
                        >
                          <FaYoutube
                            size={25}
                            className="group-hover:text-red-500"
                          />
                        </a>
                      }
                    />
                    <Icon
                      icon={
                        <a href={userInformation.websiteUrl} target="blank">
                          <SiWebflow
                            size={25}
                            className="group-hover:text-blue-800"
                          />
                        </a>
                      }
                    />
                  </div>
                </>
              )}
            </div>
            <div
              className={`mt-8 flex md:flex-col gap-x-16 gap-4 ${
                currentLang === "ar" ? " md:mr-auto" : " md:ml-auto"
              }`}
            >
              <div className="flex justify-end relative top-[-2rem] right-[-1.5rem]">
                <button
                  id="dropdownDefault"
                  className="font-mediumtext-sm text-center inline-flex items-center"
                  type="button"
                  onClick={setOpenMenu}
                >
                  <HiDotsVertical size={40} className="py-[.5rem]" />
                </button>
              </div>

              <div
                className={`flex items-center justify-evenly ${
                  currentLang === "ar" ? "flex-row-reverse" : ""
                }`}
              >
                {/*<FaAward color={userInformation?.rank} size={30}/>*/}
                <img
                  src={`${
                    window.origin
                  }/resources/rank/${userInformation?.rank.toLowerCase()}.svg`}
                  alt={userInformation?.rank}
                />
                {/*<span className={`font-bold text-${userInformation?.rank}`}>{userInformation?.rank}</span>*/}
              </div>
              <div className="text-center text-lg">
                <p>{usersInfoTxt && usersInfoTxt.totalNote}</p>
                <span className="font-bold text-lg">
                  {userInformation.rating}
                </span>
              </div>
              <div className="text-center text-lg">
                <p>{usersInfoTxt && usersInfoTxt.rate}</p>
                <span className="block font-bold">
                  {userInformation.rating}/5
                </span>
              </div>

              <Share />
            </div>
          </div>
          <div className="col-span-6 col-start-3">
            <div className="buttons mt-8">
              <button
                className={`w-1/2 pt-4 pb-4 px-8 ${
                  galerieSelected ? "bg-secondary" : "bg-bgcolor"
                } border-4 border-secondary font-medium text-lg hover:bg-opacity-90`}
                onClick={switchButton}
                id="galerie"
              >
                {usersInfoTxt && usersInfoTxt.galerie}
              </button>
              <button
                className={`w-1/2 pt-4 pb-4 px-8 ${
                  galerieSelected ? "bg-bgcolor" : "bg-secondary"
                } border-4 border-secondary font-medium text-lg hover:bg-opacity-90`}
                onClick={switchButton}
                id="feedback"
              >
                {usersInfoTxt && usersInfoTxt.feedback}
              </button>
            </div>
            <div
              className={`px-8 py-4 pb-8 border-b-4 border-l-4 border-r-4 border-secondary ${
                galerieSelected
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-2"
                  : "block"
              } `}
            >
              {galerieSelected ? (
                <AnimatePresence exitBeforeEnter={true}>
                  {portFolio &&
                    portFolio.map((elm) =>
                      elm.map((media, i) => (
                        <motion.div
                          key={i}
                          onClick={() => popupImg(media.mediaUrl)}
                          variants={popup}
                          initial="hidden"
                          animate="show"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModalFullscreen"
                          className="overflow-hidden max-h-96 cursor-pointer"
                        >
                          <motion.img
                            layoutId={media.mediaUrl}
                            src={media.mediaUrl}
                            alt={media.mediaType}
                            className="w-full h-full object-cover hover:scale-105 transition-all ease-in-out"
                          />
                        </motion.div>
                      ))
                    )}
                </AnimatePresence>
              ) : (
                feedback &&
                feedback.map((feed, i) => {
                  return (
                    <FeedBack
                      key={i}
                      name={feed.name}
                      image={feed.image}
                      rateDetails={feed.rateDetails}
                      rate={feed.rate}
                      rank={feed.rank}
                    />
                  );
                })
              )}
            </div>
          </div>
          {/* <div className="hidden col-span-2 row-span-2 text-white lg:block">
            <span className='bg-gray-600 w-40 h-[600px] flex items-center justify-center ml-auto'>Ads Here</span>
          </div> */}
          <AnimatePresence>
            {rateme && (
              <RateMe
                txts={usersInfoTxt && usersInfoTxt.feedbackWindow}
                hiddeRate={hiddeRate}
                canRate={canRate}
                getRatingInformation={rateUser}
                setRatMe={setRatMe}
              />
            )}
          </AnimatePresence>
          <AnimatePresence exitBeforeEnter={true}>
            {signaler && <Signaler setSignaler={setSignaler} />}
          </AnimatePresence>
          <AnimatePresence exitBeforeEnter={true}>
            {openMenu && (
              <DotsMenu
                titles={usersInfoTxt}
                setRatMe={setRatMe}
                setSignaler={setSignaler}
                setOpenMenu={setOpenMenu}
              />
            )}
          </AnimatePresence>
        </div>
      )}
      <AnimatePresence exitBeforeEnter={true}>
        {showModal && (
          <PopupModal
            usersInfoTxt={usersInfoTxt}
            url={imgUrl}
            setShowModal={setShowModal}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function RateMe({ getRatingInformation, canRate, hiddeRate, txts, setRatMe }) {
  const [rating, setRating] = useState();
  const [feedbackMessage, setFeedbackMessage] = useState();
  const [error, setError] = useState();
  const [btn, setbtn] = useState(false);

  function submit() {
    setbtn(true);
    if (feedbackMessage.trim() === " " || feedbackMessage === undefined) {
      setError(txts && txts.error1);
    } else if (rating === undefined) {
      setError(txts && txts.error2);
    } else if (canRate === false) {
      setError(txts && txts.error3);
    } else {
      setError("");
      getRatingInformation(rating, feedbackMessage);
    }
  }

  function getRating(id) {
    setRating(id);
  }

  return (
    <>
      <motion.div
        variants={dropIn}
        initial="hidden"
        animate="show"
        exit="exit"
        onClick={hiddeRate}
        id="cont"
        className="fixed top-0 z-50 left-0 w-screen h-screen bg-transparent"
      >
        <div className="w-2/3 bg-additional text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-2 px-4 rounded-lg">
          <h2 className="text-3xl font-semibold text-white text-center">
            {txts && txts.feedbackCall}
          </h2>
          <StarsRate getRating={getRating} className="justify-center my-2" />
          {error && (
            <div className="bg-red-400 w-4/5 mx-auto text-white font-semibold py-2 px-4">
              {error}
            </div>
          )}
          <textarea
            onChange={(event) => {
              setFeedbackMessage(event.target.value);
            }}
            className="block w-4/5 h-48 resize-none mx-auto text-left py-2 px-4 text-xl bg-bgcolor"
          />
          <button
            className="py-2 px-4 rounded-md mt-4 hover:bg-secondary hover:text-white bg-bgcolor text- text-lg"
            onClick={submit}
            disabled={btn}
          >
            submit
          </button>
        </div>
      </motion.div>
      <div
        onClick={() => setRatMe(false)}
        className="opacity-80 fixed inset-0 z-40 bg-black"
      ></div>
    </>
  );
}

function PopupModal({ url, setShowModal, usersInfoTxt }) {
  function handleExit(e) {
    if (e.target.classList.contains("popup")) {
      setShowModal(false);
    }
  }
  return (
    <>
      <motion.div
        variants={popup}
        initial="hidden"
        animate="show"
        onClick={handleExit}
        className="popup justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
        <div className="relative w-auto mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-neutral-100 outline-none focus:outline-none">
            {/*body*/}
            <div className="relative p-6 pb-0 flex-auto rounded-lg overflow-hidden">
              <motion.img
                layoutId={url}
                className="object-fill max-h-[600px] max-w-full rounded-lg"
                src={url}
                alt="Popup image"
              />
            </div>
            {/*footer*/}
            <div className="flex items-center justify-center rounded-b p-4">
              <button
                className="bg-red-500 text-white border-solid border-2 border-rose-500 rounded-lg  font-bold uppercase px-10 py-4 text-sm outline-none focus:outline-none  ease-linear transition-all duration-150 hover:text-red-500 hover:bg-white hover:border-red-500"
                type="button"
                onClick={() => setShowModal(false)}
              >
                {usersInfoTxt?.close}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="opacity-80 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
