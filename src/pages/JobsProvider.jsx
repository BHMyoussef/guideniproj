import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Card from '../components/Card';
import { firestore } from '../firebase';
import Filter from '../components/Filter';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useLang } from '../contexts/LangProvider';

export default function JobsProvider() {
    const [ usersList, setUsersList ] = useState([]);
    const [ filtredUser, setFiltredUser] = useState([]);
    const [ jobName, setJobName ] = useState();
    const [ cities,setCities ] = useState()
    const params = useParams()
    const { users:usersTxt, currentLang } = useLang()

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

    useEffect(()=>{
      getUsesList();
      getJobName();
      getCities();
    },[])

    useEffect(()=>{
      setFiltredUser(usersList)
    },[usersList])

    function getUsesList(){
      const colRef = collection(firestore, 'users')
        const q = query( colRef, where('jobId','==',params.id));
        let tmpJobProvider = []
        getDocs(q)
        .then(results =>{
            results.forEach(doc=>{
              tmpJobProvider = [ ...tmpJobProvider,doc.data()]
            })
            // Filter out the users by their rank
            // User will be shown in this order: Gold --> Bronze --> Silver
            const bronze = [];
            const gold = [];
            const silver = [];
            tmpJobProvider.map(item => {
              if(item?.rank.toLowerCase() === "gold"){
                gold.push(item);
              }else if (item?.rank.toLowerCase() === "bronze"){
                bronze.push(item)
              }else{
                silver.push(item)
              }
            })
            tmpJobProvider = [...gold, ...bronze, ...silver];
           setUsersList(tmpJobProvider)
          })
        .catch(error=>{
            console.log('error occured: ',error);
        });
    }
    function getJobName(){
      const docRef = doc(firestore,`jobs/${params.id}`);
      getDoc(docRef)
      .then(result=>{
        setJobName(result.data().jobName)
      })
    }

    function getFiltredUsers(jobs){
      setFiltredUser(jobs)
    }



    return (
    <div className='container mx-auto'>
        <div className={`w-full flex justify-between items-center mb-2 ${(currentLang==="ar")&&" flex-row-reverse"}`}>
            <h3 className='text-xl font-medium '>{usersTxt && usersTxt.title} </h3>
            <Filter users={usersList} cities={cities} getFiltredUsers={getFiltredUsers} />
        </div>
        <hr />
        <div className='usersContainer grid-template-370 gap-2 grid mt-4'>
            {
              !filtredUser || filtredUser.length===0?
                <img className='absolute left-1/2 -translate-x-1/2' src={`${window.location.origin}/resources/13525-empty.gif`} alt='empty' />
              : filtredUser.map((user,index)=>{
                return(
                  <Card
                    key={index}
                    id={ user.userId }
                    name = {user.firstName }
                    image = { user.imageUrl}
                    city = {cities && cities.filter(elm=>elm.cityId===user.userCity)}
                    jobName = { jobName&&jobName[currentLang] }
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
