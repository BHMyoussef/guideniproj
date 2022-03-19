import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../../contexts/AuthProvider'
import './styles.css'

const Header = ({ setAddBlog, addBlog }) => {
  const { isAdmin, currentUserInfo } = useAuth()
  const [userIsAdmin, setUserIsAdmin] = useState();

  useEffect(()=>{
    isAdmin().then(result=>{setUserIsAdmin(result)})
  },[currentUserInfo])
  
  return (
    <header className="home-header">
      <h1>
        <span>“</span> Blog <span>”</span>
      </h1>
      <p>
        awesome place to make oneself <br /> productive and entertained through
        daily updates.
      </p>
      {userIsAdmin && <button
        onClick={() => setAddBlog(!addBlog)}
        className={addBlog ? 'close' : ''}
      >
        {addBlog ? 'Close' : 'Add Blog'}
      </button>}
    </header>
  )
}

export default Header
