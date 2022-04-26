import { Link } from "react-router-dom"
import { useLang } from "../contexts/LangProvider"

export default function Home() {
  const { home:homeTxt, currentLang } = useLang()
  return (
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
  )
}
