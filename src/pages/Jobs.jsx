import React, { useEffect, useState } from 'react'
import Service from '../components/Service'
import { useParams } from 'react-router-dom'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '../firebase'
import SearchBar from '../components/SearchBar'
import { useLang } from '../contexts/LangProvider'

// animation
import {motion} from "framer-motion"
import {fadeIn, popup} from "../animation"

export default function Jobs() {
    const [jobs, setJobs] = useState()
    const [filtredJobsCategories, setFiltredJobsCategories] = useState();

    const jobId = useParams()
    const { services: servicesTxt, currentLang } = useLang()

    useEffect(() => {
        getJobs();
    }, [])
    useEffect(() => {
        setFiltredJobsCategories(jobs)
    }, [jobs])
    function getJobs() {
        const colRef = collection(firestore, 'jobs')
        const q = query(colRef, where('categoryId', '==', jobId.id));
        let tmpJobs = []
        getDocs(q)
            .then(results => {
                results.forEach(doc => {
                    tmpJobs = [...tmpJobs, doc.data()]
                })

                // Sort the jobs array in alphabetics order
                tmpJobs.sort((a, b) => (a.jobName[currentLang].split(' ')[0] > b.jobName[currentLang].split(' ')[0]) ? 1 : -1);

                setJobs(tmpJobs)
            })
            .catch(error => {
                console.log('error occured: ', error);
            });
    }
    function getFiltredJob(jobs) {
        setFiltredJobsCategories(jobs)
    }
    return (
        <motion.div

          variants={fadeIn}
          initial="hidden"
          animate="show"

         className='container mx-auto'>
            <div className={`w-full flex justify-between items-center mb-2 ${(currentLang === "ar") && " flex-row-reverse"}`}>
                <h3 className='text-xl font-medium '>{servicesTxt && servicesTxt.title} </h3>
                <SearchBar jobs={jobs} getFiltredJob={getFiltredJob} nameKey="jobName" placeHolder={servicesTxt && servicesTxt.search} />
            </div>
            <hr />
            <div className="grid-template-250 mt-4 grid gap-2">
                {!filtredJobsCategories ?
                    <img

                        className='absolute left-1/2 -translate-x-1/2 max-w-[30%]' 
                        src={`${window.location.origin}/resources/13525-empty.gif`} alt='empty' />
                    :
                    filtredJobsCategories.map((job, index) => {
                        return (
                            <Service
                                key={index}
                                id={job.jobId}
                                icon={job.jobIconUrl}
                                name={job.jobName[currentLang]}
                                toLink='users'
                            />
                        );
                    })}
            </div>
        </motion.div>
    )
}
