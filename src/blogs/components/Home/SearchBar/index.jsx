import React from 'react'
import './styles.css'
import { FaWindowClose } from 'react-icons/fa'

const SearchBar = ({ formSubmit, value, handleSearchKey, clearSearch }) => (
  <div className="searchBar-wrap">
    <form onSubmit={formSubmit}>
      <input
        type="text"
        placeholder="Search By Category"
        value={value}
        onChange={handleSearchKey}
      />
      {value && (
        <span onClick={clearSearch}>
          <FaWindowClose />
        </span>
      )}
      <button>Go</button>
    </form>
  </div>
)

export default SearchBar
