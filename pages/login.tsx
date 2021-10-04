import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { MutableRefObject, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchUser, User } from '../redux/session/sessionSlice'
import sessionApi, { Response } from '../shared/api/sessionApi'
import flashMessage from '../shared/flashMessages'

const New: NextPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberme] = useState('1')
  const inputEl = useRef() as MutableRefObject<HTMLInputElement>
  const dispatch = useDispatch()

  const handleEmailInput = (e: any) => {
    setEmail(e.target.value)
  }
  const handlePasswordInput = (e: any) => {
    setPassword(e.target.value)
  }
  const handleRememberMeInput = (e: any) => {
    setRememberme(e.target.value)
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    inputEl.current.blur()
    sessionApi.create(
      {
        session: {
          email: email,
          password: password,
          remember_me: rememberMe
        }
      }
    )
    .then((response: Response<User>) => {
      if (response.user) {
        localStorage.setItem("token", response.jwt)
        localStorage.setItem("remember_token", response.token)
        dispatch(fetchUser())
        router.push("/users/"+response.user.id)
      }
      if (response.flash) {
        flashMessage(...response.flash)
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
            type="checkbox"
            name="remember_me"
            id="session_remember_me"
            value={rememberMe}
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
