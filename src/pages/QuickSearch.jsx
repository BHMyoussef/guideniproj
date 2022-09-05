import SearchBarV2 from "../components/SearchBarV2";
import Card from "../components/Card"
import { useState } from "react";
import { useLang } from "../contexts/LangProvider";
import { firestore } from "../firebase"; 
import { collection,  getDocs} from "firebase/firestore";

const QuickSearch = () => {
    const [ jobsProvider, setJobsProvider ] = useState([])
    const [ searchLoader, setSearchLoader] = useState(false);
    const [ firstSearch, setFirstSearch ] = useState(false)
    const [ cities,setCities ] = useState();

    const { categories: categoriesTxt, currentLang, users:usersTxt} = useLang();

    function getCities(){
        const citiesRef = collection(firestore,"cities");
        let citiesdb = []

        getDocs(citiesRef)
        .then(results=>{
            results.forEach(city=>{
                citiesdb = [...citiesdb,city.data()]
            });
            citiesdb.sort((a,b)=>{
              if ( a.cityName < b.cityName ){
                return -1;
              }
              if ( a.cityName > b.cityName ){
                return 1;
              }
              return 0;
            })
            setCities(citiesdb)
        })
        .catch(error=>{
            console.log( "error eccured: " ,error );
        })
    }

    function getFiltredJobProvider(jobProvider){
        setJobsProvider(jobProvider)
    }

    return (
        <div 
            className='container mx-auto'>
        <SearchBarV2 

            addclassName="justify-center" 
            getFiltredJobProvider={getFiltredJobProvider} 
            placeHolder={categoriesTxt && categoriesTxt.search} 
            setFirstSearch={()=>setFirstSearch(true)} 
            setSearchLoader = {setSearchLoader} 
            />
            <hr/>
            <div className="grid-template-370 mt-4 grid gap-2  p-4">
                    
                    {
                        searchLoader ? 
                        <img 
                            className='absolute left-1/2 -translate-x-1/2 mt-28 '
                            src={`${window.location.origin}/resources/widget-loader.gif`} 
                        /> 
                        :
                        !jobsProvider || jobsProvider.length===0 ?
                            firstSearch ?
                                // <div className="self-center relative mx-auto w-[500px] min-h-[30vh]  justify-center items-center bg-red-400">
                                    <img 
                                        className='block absolute left-1/2 -translate-x-1/2 min-w-[300px] object-cover' 
                                        src={`${window.location.origin}/resources/13525-empty.gif`} alt='empty' />
                                //  </div>
                            : <></>
                        : jobsProvider.map((user,index)=>{
                            return(
                            <Card
                                key={index}
                                id={ user.userId }
                                name = {user.firstName }
                                image = { user.imageUrl}
                                city = {cities && cities.filter(elm=>elm.cityId===user.userCity)}
                                jobName = { user.jobsDetail.jobName[currentLang] }
                                rate = { user.rating }
                                totalRating = { user.totalRating }
                                texts = { usersTxt && usersTxt.cardText}
                                rank = { user.rank }
                            />
                            );
                        })
                        }
                    </div>
            
        </div>
    )

}

export default QuickSearch;