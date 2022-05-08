import { useLang } from "../contexts/LangProvider";
import {FaGooglePlay, FaAppStoreIos} from "react-icons/fa";

import {motion} from "framer-motion";
import {fadeIn} from "../animation"

const style = {
    wrapper: `container relative mx-auto md:text-left md:flex mt-12`,
    contentWrapper: `flex w-full h-screen relative flex-col p-0`,
    copyContainer: `w-full flex flex-col justify-around items-center mt-0 mx-auto`,
    title: `relative text-black text-[46px] font-bold my-[1rem]`,
    descriptionTxt: `indent-1.5 text-xl font-medium mt-5 mb-5`,
    description: ` w-full shadow h-[400px] rounded-lg overflow-hidden border-3 border-gray-500`,
    ctacontainer: `flex  my-[1rem]`,
}

export default function Download() {

  const { home:homeTxt, currentLang } = useLang()

  return(
    <motion.div
       variants={fadeIn}
       initial="hidden"
       animate="show"
       className={style.wrapper}>
      <div className="hidden lg:flex bg-gray-600 text-white items-center justify-center w-40 mr-8">ads Here</div>

        <div className={`${style.contentWrapper} ${(currentLang==="ar")&&" flex-row-reverse"}`}>
                 <div className={style.copyContainer}>
                     <div className={style.title}>
                         {homeTxt?.title}
                     </div>
                     <div className={`${style.descriptionTxt} ${(currentLang==="ar")&&" text-right"}`}>
                         {homeTxt?.desc}
                     </div>
                     <div className={`${style.description} ${(currentLang==="ar")&&" text-right"}`}>
                         <div id="responsiveVideoWrapper" className="relative w-full h-full pb-[56.25%]">
                            <iframe
                              className="absolute top-0 left-0 w-full h-full"
                              src="https://www.youtube.com/embed/kTey8NtyK_g"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>

                     </div>
                     <div className={style.ctacontainer}>
                      <a className="block" target='_blank' href="https://play.google.com/store/apps/details?id=com.qoroch.services_app">
                        <div class="flex mt-3 w-48 h-14 bg-black text-white rounded-lg items-center justify-center">
                          <div class="mr-3">
                              <svg viewBox="30 336.7 120.9 129.2" width="30">
                                  <path fill="#FFD400" d="M119.2,421.2c15.3-8.4,27-14.8,28-15.3c3.2-1.7,6.5-6.2,0-9.7  c-2.1-1.1-13.4-7.3-28-15.3l-20.1,20.2L119.2,421.2z"/>
                                  <path fill="#FF3333" d="M99.1,401.1l-64.2,64.7c1.5,0.2,3.2-0.2,5.2-1.3  c4.2-2.3,48.8-26.7,79.1-43.3L99.1,401.1L99.1,401.1z"/>
                                  <path fill="#48FF48" d="M99.1,401.1l20.1-20.2c0,0-74.6-40.7-79.1-43.1  c-1.7-1-3.6-1.3-5.3-1L99.1,401.1z"/>
                                  <path fill="#3BCCFF" d="M99.1,401.1l-64.3-64.3c-2.6,0.6-4.8,2.9-4.8,7.6  c0,7.5,0,107.5,0,113.8c0,4.3,1.7,7.4,4.9,7.7L99.1,401.1z"/>
                              </svg>
                          </div>
                          <div>
                              <div class="text-xs">GET IT ON</div>
                              <div class="text-xl font-semibold font-sans -mt-1">Google Play</div>
                          </div>
                      </div>
                      </a>
                      <a className="ml-[1.5rem] block" href="#">
                        <div class="flex mt-3 w-48 h-14 bg-transparent text-black border border-black rounded-xl items-center justify-center">
                          <div class="mr-3">
                              <svg viewBox="0 0 384 512" width="30" >
                                  <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                              </svg>
                          </div>
                          <div>
                              <div class="text-xs">Download on the</div>
                              <div class="text-2xl font-semibold font-sans -mt-1">App Store</div>
                          </div>
                      </div>
                      </a>
                       
                     </div>
                 </div>  
             </div>

      <div className="hidden lg:flex bg-gray-600 text-white items-center justify-center w-40 ml-8">ads Here</div>

     </motion.div>
  )
}


/**
Guide Ni is a service application that enables you to display your service or profession in a new digital way to facilitate communication with Customers (visit card online)


<iframe width="853" height="480" src="https://www.youtube.com/embed/kTey8NtyK_g" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<iframe width="853" height="480" src="https://www.youtube.com/embed/kTey8NtyK_g" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


*/