import { useState } from 'react'
// import { Button } from 'react-bootstrap'
import styled from 'styled-components'

// For notification:
// import { toast, ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'

// firebase stuffs

import { Timestamp, collection, addDoc } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage, firestore } from '../../../../firebase'

const AddBlog = ({ setAddBlog }) => {
  /* Get the form data*/
  const [data, setData] = useState({
    title: '',
    category: '',
    description: '',
    createdAt: Timestamp.now(),
    cover: '',
  })

  /* Upload Progress :*/
  const [progress, setProgress] = useState(0)

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!data.title || !data.description || !data.cover || !data.category) {
      alert('Please fill all the fields')
      return
    }

    /*Submit the data to firebase: */
    //console.log("image:'', data.image)
    const storageRef = ref(storage, `/blogs/${Date.now()}${data.cover.name}`)

    //     /* To upload file to firebase/storage*/
    const uploadImage = uploadBytesResumable(storageRef, data.cover)

    uploadImage.on(
      'state_changed',
      // work with uploaded file
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        )
        // console.log('Uploaded:', progress)
        setProgress(progress) // -> update progress bar
      }, // to handle Errors
      (err) => {
        console.error('Error:', err)
      },
      // When the upload is complete
      () => {
        setData({
          title: '',
          category: '',
          description: '',
          createdAt: '',
          cover: '',
        })
        setProgress(0)

        // GET image URL:
        getDownloadURL(uploadImage.snapshot.ref).then((url) => {
          const blogsRef = collection(firestore, 'blogs')

          // save all data to firestore
          addDoc(blogsRef, {
            title: data.title,
            category: data.category,
            description: data.description,
            createdAt: Timestamp.now().toDate(),
            cover: url,
          })
            .then(() => {
              //toast('Blog added succefuly!!', {type: 'success'})
              // toast.success('Blog added succefuly!!')
              setAddBlog(false)
              setProgress(0)
            })
            .catch((err) => {
              // toast('Error adding blog', { type: 'error' })
            })
        })
      },
    )
  }
  // handle change
  const change = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const changeImage = (e) => {
    // console.log(data.cover)
    setData({ ...data, cover: e.target.files[0] })
  }

  return (
    <StyledDiv>
      <h1>Add Blog:</h1>
      <BlogForm onSubmit={handleSubmit}>
        <div className="inputs">
          <label htmlFor="title">Title:</label>
          <input
            value={data.title}
            onChange={change}
            type="text"
            name="title"
            id="title"
            required={true}
            placeholder="Add a title for your blog"
          />
        </div>
        <div className="inputs">
          <label htmlFor="category">Category:</label>
          <input
            value={data.category}
            onChange={change}
            type="text"
            name="category"
            id="category"
            placeholder="Art, Development, shooping, ..."
          />
        </div>

        <div className="inputs">
          <label htmlFor="description">Description:</label>
          <textarea
            value={data.description}
            onChange={change}
            type="text"
            name="description"
            id="description"
            placeholder="Description..."
          ></textarea>
        </div>
        <div className="inputs">
          <label htmlFor="cover">Cover:</label>
          <input
            onChange={changeImage}
            type="file"
            name="cover"
            id="cover"
            accept="image/*"
            placeholder="Cover image of the blog"
          />
        </div>
        {/* Add progress bar here */}
        <div className="inputs w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
    
        <div className="inputs">
          <button>ADD</button>
        </div>
      </BlogForm>
    </StyledDiv>
  )
}

const StyledDiv = styled.div`
  margin: 2rem 1rem;
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  border-radius: 0.5rem;
  background: #fdfdfd;
  transition: all 0.3s ease;
  animation: anime 0.5s linear;
  @keyframes anime {
    from {
      /* scale: 0; */
      opacity: 0;
      transform: translateY(-100%);
    }
    to {
      /* scale: 1; */
      opacity: 1;
      transform: translateY(0%);
    }
  }
`

const BlogForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .inputs {
    width: 100%;
    padding: 0.5rem 1rem;
    margin: 0.5rem auto;
    display: flex;
    flex-direction: column;

    label {
      margin-bottom: 0.5rem;
      font-size: 22px;
      font-weight: 500;
      letter-spacing: 1px;
      cursor: pointer;
    }
    input,
    textarea {
      cursor: pointer;
      padding: 0.5rem 1rem;
      font-size: 20px;
      outline: none;
      border-radius: 0.5rem;
      border: solid 1px rgba(0, 0, 0, 0.5);
    }
    textarea {
      resize: vertical;
    }
    button {
      padding: 0.5rem 1rem;
      font-size: 1.2rem;
      cursor: pointer;
    }

    input[type='range'] {
      background: red;
    }
  }
`

export default AddBlog
