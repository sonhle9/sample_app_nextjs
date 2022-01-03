import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { MutableRefObject, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchUser, User } from '../redux/session/sessionSlice'
import sessionApi, { Response } from '../shared/api/sessionApi'
import flashMessage from '../shared/flashMessages'
import errorMessage from '../shared/errorMessages'

const New: NextPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberme] = useState(true)
  const inputEl = useRef() as MutableRefObject<HTMLInputElement>
  const [errors, setErrors] = useState([] as string[])
  const dispatch = useDispatch()

  const handleEmailInput = (e: { target: { value: React.SetStateAction<string> } }) => {
    setEmail(e.target.value)
  }
  const handlePasswordInput = (e: { target: { value: React.SetStateAction<string> } }) => {
    setPassword(e.target.value)
  }
  const handleRememberMeInput = (e: { target: { value: React.SetStateAction<string> } }) => {
    setRememberme(!rememberMe)
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    sessionApi.create(
      {
        username: email,
        password: password,
        remember_me: rememberMe ? "1" : "1"
      }
    )
    .then((response: Response<User>) => {
      if (response.user) {
        inputEl.current.blur()
        if (rememberMe) {
          localStorage.setItem("token", response.jwt)
          localStorage.setItem("remember_token", response.token)
        } else {
          sessionStorage.setItem("token", response.jwt)
          sessionStorage.setItem("remember_token", response.token)
        }
        dispatch(fetchUser())
        router.push("/users/"+response.user.id)
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
    <React.Fragment>
    <h1>Log in</h1>
    <div className="row">
      <div className="col-md-6 col-md-offset-3">
        <form
        action="/login"
        acceptCharset="UTF-8"
        method="post"
        onSubmit={handleSubmit}
        >
          { errors.length !== 0 &&
            errorMessage(errors)
          }

          <label htmlFor="session_email">Email</label>
          <input
          className="form-control"
          type="email"
          name="email"
          id="session_email"
          value={email}
          onChange={handleEmailInput}
          />

          <label htmlFor="session_password">Password</label>
          <Link href="/password_resets/new">(forgot password)</Link>
          <input
          className="form-control"
          type="password"
          name="password"
          id="session_password"
          value={password}
          onChange={handlePasswordInput}
          />

          <label className="checkbox inline" htmlFor="session_remember_me">
            <input
            name="remember_me"
            type="hidden"
            value="0" />
            <input
            checked
            type="checkbox"
            name="remember_me"
            id="session_remember_me"
            value={rememberMe ? "1" : "0"}
            onChange={handleRememberMeInput}
            />
            <span>Remember me on this computer</span>
          </label>
          <input ref={inputEl} type="submit" name="commit" value="Log in" className="btn btn-primary" data-disable-with="Log in" />
        </form>
        <p>New user? <Link href="/signup">Sign up now!</Link></p>
      </div>
    </div>
    </React.Fragment>
  )
}

export default New
