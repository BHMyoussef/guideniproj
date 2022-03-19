import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
// import { data } from '../../config/data'
import Chip from '../../components/common/Chip'
import EmptyList from '../../components/common/EmptyList'
import './styles.css'
import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'

// import firebase stuff
import { firestore } from '../../../firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'

const Blog = () => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  // const [data, setData] = useState([])
  useEffect(() => {
    const blogsRef = collection(firestore, 'blogs')
    const q = query(blogsRef, orderBy('createdAt', 'desc'))

    onSnapshot(q, (snapshot) => {
      const blogs = snapshot.docs.map(function (doc) {
        return { id: doc.id, ...doc.data() }
      })
      console.log('Bogs: ', blogs)
      let blog = blogs.filter((blog) => blog.id === id)
      if (blog) {
        console.log('Blog: ', blog)
        setBlog(blog[0])
      }
    }) // snapshot end.
  }, [])

  return (
    <div className='container mx-auto'>
      <Link className="blog-goBack" to="/blog">
        <span>
          <FaArrowLeft />
        </span>
        <span>Go Back</span>
      </Link>
      {blog ? (
        <div className="blog-wrap">
          <header>
            <p className="blog-date">
              Published {blog.createdAt.toDate().toDateString()}
            </p>
            <h1>{blog.title}</h1>
          </header>
          <img src={blog.cover} alt="cover" />
          <p className="blog-desc">{blog.description}</p>
        </div>
      ) : (
        <EmptyList />
      )}
    </div>
  )
}

export default Blog
