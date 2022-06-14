
import {useState} from "react";
import Card from '../components/Card';
import { useLang } from '../contexts/LangProvider';

// Animation 

import {motion} from "framer-motion";
import {fadeIn} from "../animation"

const Favorite = () => {
  const { users:usersTxt, currentLang } = useLang();

	const [favUsers, setFavUsers] = useState([
      {
        userId: "",
        firstName: "",
        imageUrl: "",
        cities: [],
        rating: "bronze",
        totalRating: 0,

      }
    ])

  return (
      <h1> Helo favs </h1>
    )
  /*
	
  return (

    <motion.div
     variants={fadeIn}
     initial="hidden"
     animate="show"

     className='container mx-auto'>
        
        <div className='usersContainer grid-template-370 gap-2 grid mt-4'>
            {
              !favUsers || favUsers.length===0?
                <img className='absolute left-1/2 -translate-x-1/2' src={`${window.location.origin}/resources/13525-empty.gif`} alt='empty' />
              : favUsers.map((user,index)=>{
                return(
                  <Card
                    key={index}
                    id={ user.userId }
                    name = {user.firstName }
                    image = { user.imageUrl}
                    city = {cities && cities.filter(elm=>elm.cityId===user.userCity)}
                    jobName = { jobName&&jobName[currentLang] }
                    rate = { user.rating }
                    totalRating = { user.totalRating }
                    texts = { usersTxt && usersTxt.cardText}
                    rank = { user.rank }
                  />
                );
              })
            }
        </div>
    </motion.div>
		)

  */
}

export default Favorite;