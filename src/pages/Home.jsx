import { Link } from "react-router-dom";
import { useLang } from "../contexts/LangProvider";
import { FaGooglePlay } from "react-icons/fa";
// animation things
import { motion } from "framer-motion";
import { fadeIn } from "../animation";

const style = {
  wrapper: `container relative mx-auto md:text-left md:flex mt-12`,
  contentWrapper: `flex h-screen relative justify-evenly flex-wrap items-center py-4`,
  copyContainer: `w-1/2 flex-1 mt-16`,
  title: `relative text-black text-[46px] font-bold`,
  description: `text-md font-medium mt-8 mb-2`,
  ctacontainer: `flex  my-[1rem]`,
  accentedButton: `w-full px-5 py-3 border border-transparent text-base font-medium rounded-md text-white md:py-2 md:text-lg md:px-5  bg-[#2191e2] hover:bg-[#42a0ff] cursor-pointer`,
  button: `flex items-center justify-between px-5 py-3 border border-transparent text-base font-medium rounded-md text-white md:py-2 md:text-lg md:px-5 bg-[#363840] hover:bg-[#4c505c] cursor-pointer mx-5`,
  cardContainer: `rounded-[3rem] max-w-[400px] md:my-[1.5rem] mx-5`,
};

export default function Home() {
  const { home: homeTxt, currentLang } = useLang();
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="show"
      className={style.wrapper}
    >
      {/* <div className="hidden col-span-2 row-span-2 text-white lg:block">
        <span className="bg-gray-600 w-40 h-[600px] flex items-center justify-center ml-auto">
          Ads Here
        </span>
      </div> */}
      <div
        className={`${style.contentWrapper} ${
          currentLang === "ar" && " flex-row-reverse"
        }`}
      >
        <div className={style.copyContainer}>
          <div className={style.title}>{homeTxt?.title}</div>
          <div
            className={`${style.description} ${
              currentLang === "ar" && " text-right"
            }`}
          >
            {homeTxt?.desc}
          </div>
          <div
            className={`${style.ctacontainer} ${
              currentLang === "ar" && " flex-row-reverse"
            }`}
          >
            <Link to="/services">
              <div className={style.accentedButton}>{homeTxt?.button}</div>
            </Link>
            <Link to="/download">
              <button
                className={`${style.button} ${
                  currentLang !== "ar" && " flex-row-reverse"
                }`}
              >
                <svg
                  className="fill-current w-4 h-4 mx-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                </svg>
                <span>{homeTxt?.download}</span>
              </button>
            </Link>
          </div>
        </div>
        <div className={style.cardContainer}>
          <img src="/resources/home.png" alt="Guideni home" />
        </div>
      </div>
      {/* <div className="hidden col-span-2 row-span-2 text-white lg:block">
        <span className="bg-gray-600 w-40 h-[600px] flex items-center justify-center ml-auto">
          Ads Here
        </span>
      </div> */}
    </motion.div>
  );
}
