import React, { useState } from 'react'
import { useLang } from '../contexts/LangProvider'

export default function SelectForm({choices,onSelect, title,v=true}) {
    const { currentLang } = useLang()
    function handleSelect(event){
        onSelect(event.target.value)
    }
    // i added the value so that i can show it to the user, in place of the title in setting page
    // The 'v' props is to decide either show the title or hide it
  return (
        <div className="mb-4 w-full">
            <label className='inline-block text-lg font-medium' htmlFor='cityId'>
                {v&&title}
            </label>
            <select name={title}  className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" onChangeCapture={handleSelect}>
                <option value="">{ title } </option>
                { choices&&choices.map((choice,i)=>
                    <option key={i} value={choice.id}>{ choice.name[currentLang]?choice.name[currentLang]:choice.name} </option>
                )}
            </select>
        </div>
  )
}
