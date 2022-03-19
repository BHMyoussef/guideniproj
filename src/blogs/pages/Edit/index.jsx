import { useEffect, useState } from 'react'
// import { Button } from 'react-bootstrap'
import styled from 'styled-components'

// For notification:
// import { toast, ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'

// firebase stuffs

import { Timestamp,  doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage, firestore} from '../../../firebase'
import { Link, useParams } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'

const EditBlog = () => {
    const {id} = useParams()
    /* Get the form data*/
    const [data, setData] = useState({
        title: '',
        category: '',
        description: '',
        createdAt: Timestamp.now(),
        cover: '',
    })
    const [oldImage, setOldImage] = useState(null);

  /* Upload Progress :*/
  const [progress, setProgress] = useState(0)

  // handle submit
  const handleSubmit = async (e) => {
      e.preventDefault()
    const blogsRef = doc(firestore, `blogs/${id}`)
      

    if (!data.title || !data.description  || !data.category) {
      alert('Please fill all the fields')
      return
    }

    /*Submit the data to firebase: */
    //console.log("image:'', data.image)
      console.log({cover: data.cover, oldImage})
      if (data.cover !== oldImage) {
          
          try {
              // Delete the image:
              const storageRef = ref(storage, oldImage);
              await deleteObject(storageRef);
          } catch (err) {
              console.log("deleete: ",err);
            }

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
        console.log('Uploaded:', progress)
        setProgress(progress) // -> update progress bar
      }, // to handle Errors
      (err) => {
        console.error('Error:', err)
      },
      // When the upload is complete
      () => {
      
        setProgress(0)

        // GET image URL:
        getDownloadURL(uploadImage.snapshot.ref).then((url) => {

          // save all data to firestore
          updateDoc(blogsRef, {
            title: data.title,
            category: data.category,
            description: data.description,
            createdAt: Timestamp.now().toDate(),
            cover: url,
          })
            .then(() => {
              setProgress(0)
            })
              .catch((err) => {
                console.log("Update image: ", err)
            })
        })
      },
    )
      } // end if
      else {
          
          // save all data to firestore
          updateDoc(blogsRef, {
              title: data.title,
            category: data.category,
            description: data.description,
              createdAt: Timestamp.now().toDate(),
              cover: data.cover
            })
            .then(() => {
                setProgress(0)
                console.log({oldImage})
                console.log({cover: data.cover})
                  window.location = '/'
            })
            .catch((err) => {
                console.log(err)
            })
        }
        }
      
    //  Get data
    useEffect(() => {
        const docRef = doc(firestore, `blogs/${id}`);
        getDoc(docRef).then(result => {
            const { cover, title, category, description, } = result.data()
            setData({
          title,
          category,
          description,
          createdAt: Timestamp.now(),
          cover,
            })
            console.log("Get data: ", data.cover)
            setOldImage(cover)
        })
    }, [])
  // handle change
  const change = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const changeImage = (e) => {
    // console.log(data.cover)
    setOldImage(data.cover);
    setData({ ...data, cover: e.target.files[0] })
  }

  return (
      <StyledDiv className='container mx-auto'>
          <Link className="link-goBack" to="/">
        <span>
          <FaArrowLeft size={30} />
        </span>
      </Link>
      <h1>Edit Blog:</h1>
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
        <div className="w-full bg-gray-200 rounded-full h-2.5">
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
  position:relative;
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

  
.link-goBack {
  position: absolute;
  top: -2rem;
  left: -2rem;
  text-decoration: none;
  font-size: 1rem;
  color: #a9a9a9;
  font-weight: 500;
  margin-bottom: 2rem;
  display: block;
  
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

export default EditBlog;
