import React, { useState } from 'react'
import { useLang } from '../contexts/LangProvider'

export default function SelectForm({choices,setProperty, title}) {
    const { currentLang } = useLang()
    function handleSelect(event){
        setProperty(event.target.value)
    }
  return (
        <div className="mb-4 w-full">
            <label className='inline-block text-lg font-medium' htmlFor='cityId'>
                {title}
            </label>
            <select name='cityId'  className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" onChangeCapture={handleSelect}>
                <option value="">{ title } </option>
                { choices&&choices.map((choice,i)=>
                    <option key={i} value={choice.id}>{ choice.name[currentLang]?choice.name[currentLang]:choice.name} </option>
                )}
            </select>
        </div>
  )
}
