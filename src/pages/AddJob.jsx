import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import Joi from "joi";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import SelectForm from "../components/SelectForm";
import { useAuth } from "../contexts/AuthProvider";
import { useLang } from "../contexts/LangProvider";
import { firestore } from "../firebase";

function AddJob() {
    const [ cities,setCities ] = useState()
    const [ categories, setCategories ] = useState();
    const [ subCategories, setSubCategories ] = useState();
    const [ error, setError ] = useState()

    const [ city,setCity ] = useState();
    const [ category,setCategory ] = useState();
    const [ subCategory,setSubCategory ] = useState();
    const [ phone, setPhone ] = useState("+212 ");

    const { currentUser, currentUserInfo, updateUserInfo } = useAuth();
    const { currentLang, signUp, profile } = useLang();
    const navigate = useNavigate();

    const schema = {
        city: Joi.string().required(),
        category: Joi.string().required(),
        subCategory: Joi.string().required(),
        phone:Joi.string()
        .length(14)
        .pattern(/^\+212 [0-9]+$/)
        .required()
    }

    useEffect(()=>{
        getCities()
        getCategories()
    },[])

    useEffect(()=>{
        category&&getSubCategories();
    },[category])

    useEffect(()=>{
        const result = Joi.object(schema).validate({city,category,subCategory,phone})
        if(result.error)
            setError(result.error.details[0].message)
        else
            setError()
    },[city,category,subCategory,phone])

    function getCities(){
        const citiesRef = collection(firestore,"cities");
        let citiesdb = []

        getDocs(citiesRef)
        .then(results=>{
            results.forEach(city=>{
                const obj = {
                    id: city.data().cityId,
                    name : city.data().cityName
                }
                citiesdb = [...citiesdb,obj]
            });
            setCities(citiesdb)
        })
        .catch(error=>{
            console.log( "error eccured: " ,error );
        })
    }

    function getCategories(){
        const CategoryRef = collection(firestore,"jobsCategories");
        let categoriesdb = [];
    
        getDocs(CategoryRef)
        .then(results=>{
          results.forEach(category=>{
            const obj = {
              id: category.data().categoryId,
              name : category.data().categoryName
            }
            categoriesdb = [...categoriesdb,obj]
          });
         setCategories(categoriesdb)
        })
        .catch(error=>{
          console.log( "error eccured: " ,error );
        })
      }
    
    function getSubCategories(){
        const subCategoryRef = collection(firestore,"jobs");
        const q = query( subCategoryRef, where('categoryId','==',category));

        let subCategoriesdb = [];

        getDocs(q)
        .then(results=>{
            results.forEach(category=>{
            const obj = {
                id: category.data().jobId,
                name : category.data().jobName
            }
            subCategoriesdb = [...subCategoriesdb,obj]
            });
            setSubCategories(subCategoriesdb)
        })
        .catch(error=>{
            console.log( "error eccured: " ,error );
        })
    }

    function handleSubmit(){
        const docRef = doc(firestore,`users/${currentUserInfo.userId}`)
        updateDoc(docRef,{
            jobId: subCategory,
            phone,
            userCity:city,
        })
        .then(result=>{
            updateUserInfo()
            navigate("/")
        })
    }

    return ( 
        !currentUser || currentUserInfo.jobId ? <Navigate to="/" /> :
        <div className="container mx-auto">
            { error && <div className='bg-red-400 mt-2 py-2 px-4 text-white font-medium'>{error}</div>}
            <SelectForm title={signUp &&signUp.city} choices={ cities } setProperty={(city)=>setCity(city)}/>
            <SelectForm title={profile?.enterYourCategory} choices={ categories } setProperty={(cat)=>setCategory(cat)}/>
            <SelectForm title={profile?.enteryourSubCategory} choices={ subCategories } setProperty={(subCat)=>setSubCategory(subCat)}/>
            <Input name="text" type="text" value={phone} label={profile?.phoneNumber} onChange={(e)=>setPhone(e.target.value)}  />
            
            <button disabled={error} onClick={handleSubmit} className="hover:bg-secondary hover:text-white disabled:opacity-80 bg-bgcolor  text-xl rounded-md block px-4 py-2 mx-auto">
                {profile?.add}
            </button>
        </div>
     );
}

export default AddJob;