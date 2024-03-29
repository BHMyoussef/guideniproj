import React, { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar';
import Service from '../components/Service';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase'
import { useLang } from '../contexts/LangProvider';
// Animation
import {motion} from "framer-motion";
import {fadeIn} from "../animation";


export default function JobsCategories() {
    const [jobsCategoriesList, setJobsCategoriesList] = useState();
    const [filtredJobsCategories, setFiltredJobsCategories] = useState();
    const [ jobsProvider, setJobsProvider ] = useState([])
    const [ cities,setCities ] = useState();
    const { categories: categoriesTxt, currentLang } = useLang();

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

    useEffect(() => {
        getServicesCategories();
        getCities();
        getFiltredJob()

    }, [])

    useEffect(() => {
        setFiltredJobsCategories(jobsCategoriesList)
    }, [jobsCategoriesList])

    // sort jobsCategory array each time the language changed 👌 
    useEffect(() => {
        if (!jobsCategoriesList) return;
        (() => {
            console.log(jobsCategoriesList[0].categoryName)
            jobsCategoriesList.sort(
                (a, b) =>
                    (a.categoryName[currentLang].toLowerCase().trim().split(' ')[0]
                        > b.categoryName[currentLang].toLowerCase().trim().split(' ')[0]) ?
                        1 : -1
            );
        })()
    }, [currentLang])

    function getServicesCategories() {
        const jobsCategoriesRef = collection(firestore, 'jobsCategories');
        let jobs = [];
        getDocs(jobsCategoriesRef)
            .then(querySnapshot => {
                querySnapshot.forEach((doc) => {
                    jobs = [...jobs, doc.data()]
                })
                try {
                    
                    jobs.sort((a, b) =>
                        (a.categoryName[currentLang].toLowerCase().trim().split(' ')[0]
                            > b.categoryName[currentLang].toLowerCase().trim().split(' ')[0]) ?
                            1 : -1
                    );
                } catch (error) {
                    console.log(error.message)
                }

                setJobsCategoriesList(jobs)
            })
            .catch(error => {
                console.log("error occured: ", error)
            })
    }

    function getFiltredJob(jobs) {
        setFiltredJobsCategories(jobs)
    }

    function getFiltredJobProvider(jobProvider){
        setJobsProvider(jobProvider)
    }
    return (
        <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"

            className='container mx-auto'>
            <div className={`w-full flex justify-between items-center mb-2 ${(currentLang === "ar") && " flex-row-reverse"}`}>
                <h3 className='text-xl font-medium '>{categoriesTxt && categoriesTxt.title} </h3>
                <button
                    className='border-2 px-4 py-2 rounded-md hover:bg-primary hover:text-white'>
                    <a href='/quicksearch' className='inline-block w-full '>
                        {categoriesTxt && categoriesTxt.quickSearch}
                    </a>
                </button>

                <SearchBar jobs={jobsCategoriesList} getFiltredJob={getFiltredJob} nameKey="categoryName" placeHolder={categoriesTxt && categoriesTxt.search} />
            </div>
            <hr />
            <div className="grid-template-250 mt-4 p-4 grid gap-4 bg-[#E5E6E4]">
                {!filtredJobsCategories ?
                    <img className='absolute left-1/2 -translate-x-1/2' src={`${window.location.origin}/resources/13525-empty.gif`} alt='empty' />
                    : filtredJobsCategories.map((jobCat, index) => {
                        return (
                            <Service
                                id={jobCat.categoryId}
                                icon={jobCat.categoryIconUrl}
                                name={jobCat.categoryName[currentLang]}
                                key={index}
                                toLink='service'
                            />
                        )
                    })}
            </div>
                    
        </motion.div>
    )
}



