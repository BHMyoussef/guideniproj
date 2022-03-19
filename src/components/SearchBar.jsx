import Icon from '../components/Icon';
import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';

export default function SearchBar({placeHolder, jobs, getFiltredJob,nameKey}){
    
    function handleChange(e){
        let input = e.target.value.toLowerCase()
        filterJobs(input)
        
    }
    function filterJobs(i){
        let filtred = jobs.filter(elm=>{
            const langArr = Object.values(elm[nameKey])
            let e = false
            langArr.map(ln=>{
                if(ln.toLowerCase().includes(i))
                    e = true;
            })
            return e
        })
        getFiltredJob(filtred)
    }
    
    return(
        <div className='flex items-center'>
            <input className='inline-block mr-2 p-1 outline-none border-2 rounded-lg' type="text" placeholder={placeHolder} onChange={handleChange} />
            <Icon  icon={<FaSearch />}/>
        </div>
    )
}