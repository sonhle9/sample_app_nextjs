import { NextPage } from 'next';
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect, useRef, MutableRefObject, useCallback }  from 'react'
import Pagination from 'react-js-pagination'
import flashMessage from './shared/flashMessages'
// import Pluralize from 'react-pluralize'
import Skeleton from 'react-loading-skeleton'
// import API from './shared/api/'
import { useAppSelector } from './redux/hooks'
import { selectUser } from './redux/user/userSlice'
import { isEmpty } from 'lodash'
import micropostApi, { ListResponse, Micropost } from './shared/api/micropostApi';

const Home: NextPage = () => {
  const [page, setPage] = useState(1)
  const [feed_items, setFeedItems] = useState([] as Micropost[])
  const [total_count, setTotalCount] = useState(1)
  const [following, setFollowing] = useState(Number)
  const [followers, setFollowers] = useState(Number)
  const [micropost, setMicropost] = useState(Number)
  const [gravatar, setGavatar] = useState(String)
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [imageName, setImageName] = useState('')
  const inputEl = useRef() as MutableRefObject<HTMLInputElement>;
  const inputImage = useRef() as MutableRefObject<HTMLInputElement>;
  const [errorMessage, setErrorMessage] = useState([])
  const userData = useAppSelector(selectUser);

  const setFeeds= useCallback(async () => { 
    micropostApi.getAll({page: page}
    ).then((response: ListResponse<Micropost>) => {
      if (response.feed_items) {
        setFeedItems(response.feed_items)
        setTotalCount(response.total_count)
        setFollowing(response.following)
        setFollowers(response.followers)
        setMicropost(response.micropost)
        setGavatar(response.gravatar)
      } else {
        setFeedItems([])
      }
    })
    .catch((error: any) => {
      console.log(error)
    })
  }, [page])

  useEffect(() => {
    setFeeds()
  }, [setFeeds])

  const handlePageChange = (pageNumber: any) => {
    setPage(pageNumber)
  }

  const handleContentInput = (e: any) => {
    setContent(e.target.value)
  }

  const handleImageInput = (e: any) => {
    if (e.target.files[0]) {
      const size_in_megabytes = e.target.files[0].size/1024/1024
      if (size_in_megabytes > 512) {
        alert("Maximum file size is 512MB. Please choose a smaller file.")
        setImage(null)
        e.target.value = null
      } else {
        setImage(e.target.files[0])
        setImageName(e.target.files[0].name)
      }
    }
  }

  const handleSubmit = (e: any) => {
      const formData2 = new FormData()
      formData2.append('micropost[content]',
        content
      )
      if (image) {
      formData2.append('micropost[image]',
        image || new Blob,
        imageName
      )
      }

      var BASE_URL = ''
      if (process.env.NODE_ENV === 'development') {
        BASE_URL = 'http://localhost:3001/api'
      } else if (process.env.NODE_ENV === 'production') {
        BASE_URL = 'https://railstutorialapi.herokuapp.com/api'
      }

      fetch(BASE_URL+`/microposts`, {
        method: "POST",
        body: formData2,
        credentials: 'include',
        // headers: {
        //   'X-CSRF-Token': getCookie('CSRF-TOKEN'),
        //   'Authorization': `Bearer ${localStorage.getItem('token')}`
        // }
      })
      .then((response: any) => response.json().then((data: any) => {
        
        if (data.flash) {
          inputEl.current.blur()
          flashMessage(...data.flash)
          setContent('')
          setImage(null)
          inputImage.current.value = ''
          setErrorMessage([])
          setFeeds()
        }
        if (data.error) {
          inputEl.current.blur()
          setErrorMessage(data.error)
        }

      })
      )

    e.preventDefault()
  }

  const removeMicropost = (micropostid: number) => {
    micropostApi.remove(micropostid)
      .then((response: any) => {
        if (response.flash) {
          flashMessage(...response.flash)
          setFeeds()
        }
      })
      .catch((error: any) => {
        console.log(error)
      })
  }

  return userData.status === 'loading' ? (
    <>
    <Skeleton height={304} />
    <Skeleton circle={true} height={60} width={60} />
    </>
  ) : userData.error ? (
    <h2>{userData.error}</h2>
  ) : !isEmpty(userData.value) ? (
    <div className="row">
      <aside className="col-md-4">
        <section className="user_info">
          <Image alt={userData.value.name} className="gravatar" src={"https://secure.gravatar.com/avatar/"+gravatar+"?s=50"} width='50' height='50'/>
          <h1>{userData.value.name}</h1>
          <span><Link href={"/users/"+userData.value.id}><a >view my profile</a></Link></span>
          {/* <span><Pluralize singular={'micropost'} count={ micropost } /></span> */}
          <span>{micropost} micropost{micropost !== 1 ? 's' : ''}</span>
        </section>

        <section className="stats">
          <div className="stats">
            <Link href={"/users/"+userData.value.id+"/following"}><a >
              <strong id="following" className="stat">
                {following}
              </strong> following
            </a></Link>
            <Link href={"/users/"+userData.value.id+"/followers"}><a >
              <strong id="followers" className="stat">
                {followers}
              </strong> followers
            </a></Link>
          </div>
        </section>

        <section className="micropost_form">
          <form
          encType="multipart/form-data"
          action="/microposts"
          acceptCharset="UTF-8"
          method="post"
          onSubmit={handleSubmit}
          >
            { errorMessage.length !== 0 &&
              <div id="error_explanation">
                <div className="alert alert-danger">
                  The form contains { errorMessage.length } error.
                </div>
                <ul>
                  { errorMessage.map((error, i) => {
                     return (<li key={i}>{error}</li>)
                  })}
                </ul>
              </div>
            }
            <div className="field">
                <textarea
                placeholder="Compose new micropost..."
                name="micropost[content]"
                id="micropost_content"
                value={content}
                onChange={handleContentInput}
                >
                </textarea>
            </div>
            <input ref={inputEl} type="submit" name="commit" value="Post" className="btn btn-primary" data-disable-with="Post" />
            <span className="image">
              <input
              ref={inputImage}
              accept="image/jpeg,image/gif,image/png"
              type="file"
              name="micropost[image]"
              id="micropost_image"
              onChange={handleImageInput}
              />
            </span>
          </form>
        </section>
      </aside>

      <div className="col-md-8">
        <h3>Micropost Feed</h3>
        <Pagination
          activePage={page}
          itemsCountPerPage={5}
          totalItemsCount={total_count}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
        />
        <ol className="microposts">
          { feed_items.map((i: any, t) => (
              <li key={t} id= {'micropost-'+i.id} >
                <Link href={'/users/'+i.user_id}><a >
                  <Image alt={i.user_name} className="gravatar" src={"https://secure.gravatar.com/avatar/"+i.gravatar_id+"?s="+i.size} width='50' height='50'/>
                </a></Link>
                <span className="user"><Link href={'/users/'+i.user_id}><a >{i.user_name}</a></Link></span>
                <span className="content">
                  {i.content}
                  { i.image &&
                    <Image alt="Micropost Photo" src={''+i.image+''} width='100%' height='100%'/>
                  }
                </span>
                <span className="timestamp">
                {'Posted '+i.timestamp+' ago. '}
                {userData.value.id === i.user_id &&
                  <Link href={'#/microposts/'+i.id}><a  onClick={() => removeMicropost(i.id)}>delete</a></Link>
                }
                </span>
              </li>
          ))}
        </ol>

        <Pagination
          activePage={page}
          itemsCountPerPage={5}
          totalItemsCount={total_count}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
        />
      </div>
  </div>
  ) : (
    <>
    <div className="center jumbotron">
        <h1>Welcome to the Sample App</h1>
        <h2>
        This is the home page for the <Link href="https://www.railstutorial.org/"><a >React Tutorial</a></Link> sample application.
        </h2>
        <Link href="/signup"><a  className="btn btn-lg btn-primary">Sign up now!</a></Link>
    </div>
    <Link href="https://rubyonrails.org/"><a ><Image alt="Rails logo" width="70" height="49.48" src="/logo.svg" /></a></Link>
    </>
  )
}

export default Home
