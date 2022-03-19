import React, { useEffect, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Chip from '../../../common/Chip'
import './styles.css'
// firebase stuffs

import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

import { storage, firestore } from '../../../../../firebase'
import { useAuth } from '../../../../../contexts/AuthProvider'


const BlogItem = ({
  blog: { description, title, createdAt, cover, category, id },
}) => {
  const { isAdmin, currentUserInfo } = useAuth()
  const [userIsAdmin, setUserIsAdmin] = useState();

  useEffect(()=>{
    isAdmin().then(result=>{setUserIsAdmin(result)})
  },[currentUserInfo])
  
  const deleteBlog = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (window.confirm('Are U sure')) {
    try {
      // Delete the document:
      //console.log("id: ", id);
      await deleteDoc(doc(firestore, "blogs", id));

      // Delete the image:
      const storageRef = ref(storage, cover);
      await deleteObject(storageRef);
    } catch (err) {
      console.log("Error: ", err);
    }


    } 
  }

  return (
    <div className="blogItem-wrap">
      <Link className="blogItem-link" to={`/blog/${id}`}>
        <img className="blogItem-cover" src={cover} alt="cover" />
        <Chip label={category} />
        <h3>{title}</h3>
        <p className="blogItem-desc">{description}</p>
        <footer>
          <div className="blogItem-author">
            {userIsAdmin && <>
            <Link className="btn edit-btn" to={`/edit/${id}`}>
              Edit
            </Link>
            <button className="btn delete-btn" onClick={deleteBlog}>
              Delete
            </button>
            </>}
          </div>
          <FaArrowRight size={20} />
        </footer>
      </Link>
    </div>
  )
}

export default BlogItem
