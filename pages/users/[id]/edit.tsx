import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import userApi, { UserEdit } from '../../shared/api/userApi'
import flashMessage from '../../shared/flashMessages'

const Edit: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string
  const [user, setUser] = useState({} as UserEdit)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password_confirmation, setPasswordConfirmation] = useState('')
  const [errors, setErrors] = useState([] as string[])
  const [gravatar, setGravatar] = useState('')

  const inputEl = useRef(null)

  const getUserInfo= useCallback(async () => { 
    userApi.edit(id
    ).then(response => {
      if (response.user) {
        setUser(response.user)
        setName(response.user.name)
        setEmail(response.user.email)
        setGravatar(response.gravatar)
      }
      if (response.flash) {
        flashMessage(...response.flash)
        router.push('/')
      }
    })
    .catch(error => {
      console.log(error)
    })
  }, [id, router])

  useEffect(() => {
    getUserInfo()
  }, [getUserInfo])

  const handleNameInput = (e: { target: { value: React.SetStateAction<string> } }) => {
    setName(e.target.value)
  }

  const handleEmailInput = (e: { target: { value: React.SetStateAction<string> } }) => {
    setEmail(e.target.value)
  }
  const handlePasswordInput = (e: { target: { value: React.SetStateAction<string> } }) => {
    setPassword(e.target.value)
  }
  const handlePasswordConfirmationInput = (e: { target: { value: React.SetStateAction<string> } }) => {
    setPasswordConfirmation(e.target.value)
  }

  const handleUpdate = (e: { preventDefault: () => void }) => {
    userApi.update(id,
      { 
        user: {
          name: name,
          email: email,
          password: password,
          password_confirmation: password_confirmation
        },
      }
    ).then(response => {
      if (response.flash_success) {
        flashMessage(...response.flash_success)
        setPassword('')
        setPasswordConfirmation('')
        getUserInfo()
      }
      if (response.error) {
        setErrors(response.error)
      }
    })
    .catch(error => {
      console.log(error)
    })
    e.preventDefault()
  }

  return (
    <>
    <h1>Update your profile</h1>
    <div className="row">
      <div className="col-md-6 col-md-offset-3">
        <form
        action="/users/1"
        acceptCharset="UTF-8"
        method="post"
        onSubmit={handleUpdate}
        >
          { errors.length !== 0 &&
            <div id="error_explanation">
              <div className="alert alert-danger">
                The form contains {errors.length} error{errors.length !== 1 ? 's' : ''}.
              </div>
              <ul>
                { errors.map((error, i) => {
                   return (<li key={i}>{error}</li>)
                })}
              </ul>
            </div>
          }
          <label htmlFor="user_name">Name</label>
          <input
          className="form-control"
          type="text"
          value={name}
          name="name"
          id="user_name"
          onChange={handleNameInput}
          />

          <label htmlFor="user_email">Email</label>
          <input
          className="form-control"
          type="email"
          value={email}
          name="email"
          id="user_email"
          onChange={handleEmailInput}
          />

          <label htmlFor="user_password">Password</label>
          <input
          className="form-control"
          type="password"
          name="password"
          id="user_password"
          value={password}
          onChange={handlePasswordInput}
          />

          <label htmlFor="user_password_confirmation">Confirmation</label>
          <input
          className="form-control"
          type="password"
          name="password_confirmation"
          id="user_password_confirmation"
          value={password_confirmation}
          onChange={handlePasswordConfirmationInput}
          />

          <input ref={inputEl} type="submit" name="commit" value="Save changes" className="btn btn-primary" data-disable-with="Save changes" />
        </form>
        <div className="gravatar_edit">
          <img alt={user.name} className="gravatar" src={"https://secure.gravatar.com/avatar/"+gravatar+"?s=80"} />
          <a href="https://gravatar.com/emails" target="_blank" rel="noopener noreferrer">change</a>
        </div>
      </div>
    </div>
    </>
  )
}

export default Edit
