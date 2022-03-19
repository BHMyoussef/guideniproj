import React, { useEffect, useState } from 'react'
import EmptyList from '../../components/common/EmptyList'
import BlogList from '../../components/Home/BlogList'
import Header from '../../components/Home/Header'
import SearchBar from '../../components/Home/SearchBar'
import AddBlog from '../../components/Home/AddBlog'

// Blogs Data
// import { data } from '../../config/data'

import { firestore } from '../../../firebase'
import { collection, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore'
const Bloga = () => {
  const [addBlog, setAddBlog] = useState(false)
  // console.log(addBlog)
  const [blogs, setBlogs] = useState([])
  const [oldBlogs, setOldBlogs] = useState([])
  const [searchKey, setSearchKey] = useState('')
  // console.log('Blogs lista', blogList)
  // get data out from firebase
  useEffect(() => {
    const blogsRef = collection(firestore, 'blogs')
    const q = query(blogsRef, orderBy('createdAt', 'desc'))
    onSnapshot(q, (snapshot) => {
      const blogs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    
      setBlogs(blogs)
      setOldBlogs(blogs)
    }) // snapshot end.
  }, [])

  // Search submit
  const handleSearchBar = (e) => {
    e.preventDefault()
    handleSearchResults()
  }

  // Search for blog by category
  const handleSearchResults = () => {
    const allBlogs = oldBlogs;
    if (searchKey.trim() && searchKey.trim() !== ' ') {
      
      const filteredBlogs = allBlogs.filter((blog) =>
      blog.category.toLowerCase().includes(searchKey.toLowerCase().trim()),
      )
      setBlogs(filteredBlogs)
    } else {
      setBlogs(oldBlogs)
    }
  }

  // Clear search and show all blogs
  const handleClearSearch = () => {
    setBlogs(oldBlogs)
    setSearchKey('')
  }

  return (
    <div className='container mx-auto'>
      {/* Page Header */}
      <Header addBlog={addBlog} setAddBlog={setAddBlog} />

      {/* Search Bar */}
      {!addBlog ? (
        <SearchBar
          value={searchKey}
          clearSearch={handleClearSearch}
          formSubmit={handleSearchBar}
          handleSearchKey={(e) => setSearchKey(e.target.value)}
        />
      ) : (
        <AddBlog setAddBlog={setAddBlog} />
      )}
      <br></br>
      {/* Blog List & Empty View */}
      {!blogs.length ? <EmptyList /> : <BlogList blogs={blogs} />}
    </div>
  )
}

export default Bloga
