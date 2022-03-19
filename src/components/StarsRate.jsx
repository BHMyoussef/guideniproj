import { useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";
import Icon from "./Icon";

export default function StarsRate({ className, getRating }){
    const [ numberToFill, setNumberToFill ] = useState(-1);
    const [ rating, setRating ] = useState();
    
    function changeFill(id){
        if(!rating)
            setNumberToFill(id)
    }
    function setFill(){
        if(!rating)
            setNumberToFill(-1)
    }

    function setRate(id){
        if(!rating){
            setRating(id)   
            getRating(id);
        }
    }
    return(
        <div className={className + ' flex gap-1'}>
            {
                [...Array(5)].map((e,i)=>{
                    if(i<=numberToFill){
                        return(
                            <Icon key={i} icon={ <BsStarFill onClick={()=>{ setRate(i+1) }} onMouseLeave={setFill} onMouseEnter={()=>{changeFill(i)}} className="text-yellow-400 " />}/>
                        )
                    }
                    else{
                        return(
                            <Icon key={i} icon={ <BsStar onClick={()=>{ setRate(i) }} onMouseLeave={setFill} onMouseEnter={()=>{changeFill(i)}} className="text-yellow-400" />}/>
                        )
                    }
                })
            }
        </div>
    );
}