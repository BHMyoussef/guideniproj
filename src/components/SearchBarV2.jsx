import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useState } from "react";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { firestore } from "../firebase";
import Icon from "./Icon";
import styled from "styled-components";

export default function SearchBarV2({placeHolder, getFiltredJobProvider, setFirstSearch, setSearchLoader}){
    const [ value, setValue ] = useState("");
    const [ diseabled, setDiseabled ] = useState(false);

    function handleKeyUp(e){
        if(e.key === "Enter")
            handleSearch()
    }

    function handleSearch(){
        if(value.trim() !== ''){
            
            let jobProviders = []
            setFirstSearch(true);
            setSearchLoader(true);
            setDiseabled(true);
            getFiltredJobProvider(jobProviders)
            const jobProviderRef = collection(firestore, 'users');
            const q = query(jobProviderRef,where("firstName", ">=", value), where('firstName', '<=', value+'\uf8ff'), limit(10));
            getDocs(q)
            .then(querySnapshot=>{
                querySnapshot.forEach((document)=>{ 
                    console.log(document.data())
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
        }else{
            getFiltredJobProvider([])
        }
    }

    return (
        <div className="flex items-center justify-between">
            <a href="/services" className=" inline-block">
                <FaArrowLeft className="cursor-pointer"  size={40} />
                </a>
            <Container >
                <input 
                    onKeyUp={handleKeyUp} 
                    type="text" 
                    placeholder={placeHolder} 
                    onChange={(e)=>setValue(e.target.value)} />
                <button 
                    disabled={diseabled} 
                    onClick={handleSearch}>
                    
                    <Icon  icon={<FaSearch size={35} />}/>
                </button>
            </Container>
        </div>
    );
}
const Container = styled.div`
    flex:2;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 10vh;

    input {
        outline: none;
        border: solid 2px gray;
        padding: .5rem 1rem;
        border-radius:5px;
        width: 18rem;
        margin-right: 1rem;
    }
`