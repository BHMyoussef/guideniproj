import Icon from './Icon'
import { FaAward }from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Stars from './Stars'

/*Animation*/
import {motion} from "framer-motion";
import {fadeIn, popup} from "../animation"

export default function Card({id, name, image, jobName, rate, totalRating, texts, city, rank}) {
    if (rank === 0)
        rank = "bronze"
    else 
        rank = rank.toString()
  return (
    <motion.div

     variants={popup}
     initial="hidden"
     animate="show"

     className='card inline-block bg-bgcolor pt-4 pb-4 px-8 rounded-xl hover:scale-105 transition-all ease-linear relative'>
        <div className={`flex items-center justify-evenly absolute right-0`}>
          <img src={`${window.origin}/resources/rank/${rank.toLowerCase()}.svg`} alt={rank} />

        </div>
        <div className='flex items-center gap-x-10 mb-4'>
            <div className='image-container w-32 h-32'>
                <motion.img
                    layoutId={image}
                    className='h-full w-full rounded-full'
                    src={image||`${window.location.origin}/resources/profile.png`}
                    alt="profile photo"
                />
            </div>
            <div>
                <h3 className='text-lg font-semibold'>{name}</h3>
                <p className='font-medium'>{jobName}</p>
                <Stars rate={rate}/>
                <p className='font-medium'>{city&&city[0]?.cityName}</p>
            </div>
        </div>
        <div className='flex justify-between items-center'>
            <div className='text-center'>
                <p>{texts && texts.totalNote}</p>
                <span className='font-bold'>{totalRating}</span>
            </div>
            <div className='text-center'>
                <p>{texts && texts.rate}</p>
                <span className='font-bold'>{rate}/5</span>
            </div>
            <Link className='border-2 pt-2 pb-2 px-4 hover:font-semibold hover:text-white hover:bg-primary' to={`/user/${id}`}>{texts && texts.btnText}</Link>
        </div>
    </motion.div>
  )
}
