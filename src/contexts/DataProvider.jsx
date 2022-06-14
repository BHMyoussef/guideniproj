import {createContext, useContext, useEffect, useState } from 'react'

export const dataContext = createContext();

export function useData(){
    return useContext(langContext);
}

export default function DataProvider({ children }) {
    
    const value = {color: "red"}


  return (
    <langContext.Provider value={ value }>
        { children }
    </langContext.Provider>
  )
}
