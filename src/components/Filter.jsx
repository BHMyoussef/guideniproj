import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FcClearFilters } from "react-icons/fc";
import { firestore } from "../firebase";
import { useLang } from '../contexts/LangProvider';

export default function Filter({users, getFiltredUsers, cities}){
    const [city, setCity] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [neighborhoods, setNeighborhoods] = useState();
    // current Language
    const {users:usersTxt, currentLang } = useLang();

    function getNeighborhoods(){

        const docRef = collection(firestore, `cities/${city}/neighborhoods/`);
        let neighboorsdb = []
    
        getDocs(docRef)
        .then(results=>{
            results.forEach(city=>{
                const obj = {
                    id: city.data().neighborhoodId,
                    name : city.data().neighborhoodName
                }
                neighboorsdb = [...neighboorsdb,obj]
            });
    
            neighboorsdb.sort((a,b)=>{
                if ( a.name < b.name ){
                    return -1;
                }
                if ( a.name > b.name ){
                    return 1;
                }
                return 0;
            })
    
            setNeighborhoods(neighboorsdb)
        })
        .catch(error=>{
            console.log( "error eccured: " ,error );
        })
      }
 

    function changeCity(e){
        setCity(e.target.value);
    }
    
    function changeN(e){
        setNeighborhood(e.target.value);
    }

    function clearFilter(){
        setCity('');
        setNeighborhood('');
    }

    useEffect(()=> {
        city&&getNeighborhoods();
        
    },[city])
    
    useEffect(() =>{
        let filtredUser = users;
        if(city!==''){
            filtredUser = users.filter(elmt=>elmt.userCity===city)
        }
        if(neighborhood!==''){
            console.log({neighborhood})
            filtredUser = users.filter(elmt=>elmt.userNeighborhood===neighborhood)
        }
        getFiltredUsers(filtredUser)
    },[city, neighborhood])


    return(
        <div className={currentLang==='ar'?'flex flex-row-reverse':''}>
            <label className='inline-block text-lg  font-medium mr-2' htmlFor='cityId'>
                {usersTxt?.filter} 
            </label>
            <select key="cityId" name='cityId'  className="text-center mx-[1rem] form-select appearance-none px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" value={city} onChange={changeCity}>
                <option value="">-- {usersTxt?.filterCity} --</option>
                { cities && cities.map((choice,i)=>{
                    return(
                        
                            <option key={choice.cityId} value={choice.cityId}>
                                { choice.cityName}
                            </option>
                        
                    )
                })}
            </select>
            <select key="neighborId" name='neighborId'  className="text-center form-select appearance-none mx-4 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" value={neighborhood} onChange={changeN}>
                <option value="">-- {usersTxt?.filterNeighborhood} --</option>
                { neighborhoods && neighborhoods.map((choice,i)=>{
                    return(
                        <>
                            <option key={choice.id} value={choice.id}>
                                { choice.name}
                            </option>
                        </>
                    )
                })}
            </select>
            <FcClearFilters 
                className="inline-block cursor-pointer"
                size={30}
                onClick={clearFilter}    
            />

        </div>
    );
}