import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../firebase";

export default function Filter({users, getFiltredUsers, cities}){
    

    function handleSelect(event){
        const city = event.target.value;
        const filtredUser = users.filter(elmt=>elmt.userCity===city)
        getFiltredUsers(filtredUser)
    }
    return(
        <div>
            <label className='inline-block text-lg font-medium mr-2' htmlFor='cityId'>
                Filter: 
            </label>
            <select name='cityId'  className="form-select appearance-none px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" onChange={handleSelect}>
                { cities && cities.map((choice,i)=>{
                    return(
                        <option key={i} value={choice.cityId}>{ choice.cityName} </option>
                    )
                })}
            </select>
        </div>
    );
}