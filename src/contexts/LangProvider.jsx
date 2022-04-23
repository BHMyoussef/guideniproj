import React, { useContext, useEffect, useState } from 'react'

const jsonEn = require('../lang/en.json')
const jsonFr = require('../lang/fr.json')
const jsonAr = require('../lang/ar.json')

export const langContext = React.createContext();

export function useLang(){
    return useContext(langContext);
}

export default function LangProvider({ children }) {
    const [ currentLang, setCurrentLang ] = useState();
    const [ currentLangResources, setCurrentLangResources ] = useState();

    useEffect(()=>{
        switch (currentLang) {
            case "ar":
                setCurrentLangResources(jsonAr);
                break;
            case "eng":
                setCurrentLangResources(jsonEn);
                break;
            case "fr":
                setCurrentLangResources(jsonFr);
            break;
            default:
                break;
        }
    },[currentLang])

    function handleSelectedLang(lang){
        switch (lang) {
            case "العربية":
                setCurrentLang('ar');
                break;
            case "English":
                setCurrentLang('eng');
                break;
            case "Français":
                setCurrentLang("fr");
                break;
            default:
                break;
        }
    }
    const { nav, home, categories, services, userInfo, users, signIn, signUp, setting, profile, contact} = currentLangResources || {};

    const value = {
        currentLang,
        handleSelectedLang,
        nav,home,categories,services,userInfo,users,signIn,signUp,setting,profile, contact
    }
  return (
    <langContext.Provider value={ value }>
        { children }
    </langContext.Provider>
  )
}
