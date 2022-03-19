import { Link } from "react-router-dom"
import { useLang } from "../contexts/LangProvider"

export default function Home() {
  const { home:homeTxt } = useLang()
  return (
      <div className="container mx-auto md:text-left md:flex mt-12">
        <div className="desc flex-1 mt-16">
            <h1 className="text-4xl text-additional font-semibold">{homeTxt && homeTxt.title}</h1>
            <p className="font-medium mt-8 mb-2">
                {homeTxt && homeTxt.desc}
            </p>
            <Link className="font-medium text-lg inline-block pt-2 pb-2 px-4 rounded-lg bg-bgcolor text-additional" to="/services">{homeTxt && homeTxt.button}</Link>
        </div>
        <img className="flex-1 hidden md:block md:h-96" src="./resources/home.png" alt="guideNi Home" />
      </div>
  )
}
