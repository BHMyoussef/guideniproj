import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { firestore } from "../firebase";
import Icon from "./Icon";


export default function SearchBarV2({addclassName, placeHolder, getFiltredJobProvider, setFirstSearch, setSearchLoader}){
    const [ value, setValue ] = useState("");
    const [ diseabled, setDiseabled ] = useState(false);

    function handleKeyUp(e){
        if(e.key === "Enter")
            handleSearch()
    }

    function handleSearch(){
        setFirstSearch(true);
        setSearchLoader(true);
        setDiseabled(true);
        let jobProviders = []
        getFiltredJobProvider(jobProviders)
        const jobProviderRef = collection(firestore, 'users');
        const q = query(jobProviderRef,where("firstName", ">=", value), where('firstName', '<=', value+ '\uf8ff'), limit(10));
        getDocs(q)
        .then(querySnapshot=>{
            querySnapshot.forEach((document)=>{ 
                if(document.data().jobId){
                    const jobProviderdoc = doc(firestore, 'jobs',document.data().jobId);
                    getDoc(jobProviderdoc)
                    .then(jobProvider=>{
                        const obj = {...document.data(), jobsDetail: jobProvider.data() }
                        jobProviders=[...jobProviders, obj]
                        getFiltredJobProvider(jobProviders)
                    })
                }
            })
            setDiseabled(false);
            setSearchLoader(false)
        })
        .catch(e => console.log(e))
    }

    return (
        <div className={'flex items-center '+addclassName} >
            <input onKeyUp={handleKeyUp}  className='disabled:opacity-5 inline-block mr-2 p-1 outline-none border-2 rounded-lg' type="text" placeholder={placeHolder} onChange={(e)=>setValue(e.target.value)} />
            <button disabled={diseabled} onClick={handleSearch}><Icon  icon={<FaSearch />}/></button>
        </div>
    );
}