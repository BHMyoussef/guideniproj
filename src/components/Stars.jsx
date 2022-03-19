import { BsStar, BsStarFill } from "react-icons/bs";
import Icon from "./Icon";

export default function Stars({rate}){
    const nmbrOfStars = Math.floor(rate)
    
    return(
        <div className='flex gap-1'>
            {
                [...Array(5)].map((e,i)=>{
                    if(i<nmbrOfStars){
                        return(
                            <Icon key={i} icon={ <BsStarFill className="text-yellow-400" />}/>
                        )
                    }
                        else{
                            return(
                                <Icon key={i} icon={ <BsStar className="text-yellow-400" />}/>
                            )
                        }
                })
            }
        </div>
    );
}