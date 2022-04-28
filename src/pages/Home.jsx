import { Link } from "react-router-dom"
import { useLang } from "../contexts/LangProvider"
import {FaGooglePlay} from "react-icons/fa"
const style = {
    wrapper: `container relative mx-auto md:text-left md:flex mt-12`,
    contentWrapper: `flex h-screen relative justify-center flex-wrap items-center`,
    copyContainer: `w-1/2 flex-1 mt-16`,
    title: `relative text-black text-[46px] font-bold`,
    description: `text-2xl font-medium mt-8 mb-2`,
    ctacontainer: `flex my-[1rem]`,
    accentedButton: `px-4 py-3 bg-[#2191e2] rounded-lg mr-3 text-white hover:bg-[#42a0ff] cursor-pointer`,
    button: `flex justify-center items-center px-4 py-3 bg-[#363840] rounded-lg mr-3 text-[#e4e8ea] hover:bg-[#4c505c] cursor-pointer`,
    cardContainer: `rounded-[3rem] max-w-[400px] md:my-[1.5rem] mx-5`,
}

export default function Home() {
  const { home:homeTxt, currentLang } = useLang()
  return (
    <div className={style.wrapper}>
      <div className="hidden lg:flex bg-gray-600 text-white items-center justify-center w-40 mr-8">ads Here</div>
             <div className={`${style.contentWrapper} ${(currentLang==="ar")&&" flex-row-reverse"}`}>
                 <div className={style.copyContainer}>
                     <div className={style.title}>
                         {homeTxt?.title}
                     </div>
                     <div className={`${style.description} ${(currentLang==="ar")&&" text-right"}`}>
                         {homeTxt?.desc}
                     </div>
                     <div className={`${style.ctacontainer} ${(currentLang==="ar")&&" flex-row-reverse"}`}>

                       <Link to="/services">
                         <div className={style.accentedButton}>
                             {homeTxt?.button}
                           </div>
                         </Link>
                           <Link to="/download">
                             <div className={style.button}>
                               {homeTxt?.download}
                               <FaGooglePlay className="ml-[10px]"/>
                             </div>
                         </Link>
                     </div>
                 </div>
                 <div className={style.cardContainer}>
                     <img src="http://localhost:3000/resources/home.png" alt="Guideni home" />
                 </div>
             </div>
         <div className="hidden lg:flex bg-gray-600 text-white items-center justify-center w-40 ml-8">ads Here</div>

     </div>
  )
}


/*
<div className={`container mx-auto md:text-left md:flex mt-12 ${(currentLang==="ar")&&" flex-row-reverse"}`}>
  <div className="hidden lg:flex bg-gray-600 text-white items-center justify-center w-40 mr-8">ads Here</div>
  <div className={`desc flex-1 mt-16 ${(currentLang==="ar")&&" text-right"}`}>
      <h1 className="text-4xl text-additional font-semibold">{homeTxt && homeTxt.title}</h1>
      <p className="font-medium mt-8 mb-2">
          {homeTxt && homeTxt.desc}
      </p>
      <Link className="font-medium text-lg inline-block pt-2 pb-2 px-4 rounded-lg bg-bgcolor text-additional" to="/services">{homeTxt && homeTxt.button}</Link>
  </div>
  <img className="flex-1 hidden md:block md:h-96" src="./resources/home.png" alt="guideNi Home" />
  <div className="hidden lg:flex bg-gray-600 text-white items-center justify-center w-40 ml-8">ads Here</div>
</div>

*/
