import React, { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar';
import Service from '../components/Service';
import { collection , getDocs } from 'firebase/firestore';
import { firestore } from '../firebase'
import { useLang } from '../contexts/LangProvider';


export default function JobsCategories() {
    const [ jobsCategoriesList, setJobsCategoriesList ]= useState();
    const [ filtredJobsCategories, setFiltredJobsCategories ] = useState();
    const { categories:categoriesTxt,currentLang } = useLang()
    
    useEffect(()=>{
        getServicesCategories();
    },[])

    useEffect(()=>{
        setFiltredJobsCategories(jobsCategoriesList)
    },[jobsCategoriesList])

    function getServicesCategories(){
        const jobsCategoriesRef = collection( firestore, 'jobsCategories');
        let jobs = [];
        getDocs(jobsCategoriesRef)
        .then(querySnapshot=>{
            querySnapshot.forEach((doc) => {
                jobs = [...jobs,doc.data()]
            });
            setJobsCategoriesList(jobs)
        })
        .catch(error=>{
            console.log("error occured: ",error)
        })
    }

    function getFiltredJob(jobs){
        setFiltredJobsCategories(jobs)
    }
  return (
    <div className='container mx-auto'>
        <div className={`w-full flex justify-between items-center mb-2 ${(currentLang==="ar")&&" flex-row-reverse"}`}>
            <h3 className='text-xl font-medium '>{categoriesTxt && categoriesTxt.title} </h3>
            <SearchBar jobs={jobsCategoriesList} getFiltredJob={getFiltredJob} nameKey="categoryName" placeHolder={categoriesTxt && categoriesTxt.search} />
        </div>
        <hr />
        <div className="grid-template-250 mt-4 grid gap-2">
            { !filtredJobsCategories? 
                <img className='absolute left-1/2 -translate-x-1/2' src={`${window.location.origin}/resources/13525-empty.gif`} alt='empty' />
            : filtredJobsCategories.map((jobCat,index)=>{
                return(
                    <Service 
                        id={ jobCat.categoryId}
                        icon={ jobCat.categoryIconUrl }
                        name={ jobCat.categoryName[currentLang] }
                        key={index}
                        toLink='service'
                    />
                )
            })}
        </div>
    </div>
  )
}



