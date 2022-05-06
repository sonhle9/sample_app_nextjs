import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { MutableRefObject, useRef, useState } from 'react'
import userApi from '../components/shared/api/userApi'
import errorMessage from '../components/shared/errorMessages'
import { useDispatch } from 'react-redux'
import { fetchUser } from '../redux/session/sessionSlice'

// For more details read the end of https://github.com/sonhle9/sample_app_nextjs/tree/for_java_spring
const initialState = {
  username: 'sminzhz@gmail.com',
  email: '', // sminzhz@gmail.com pleáe typing like https://github.com/sonhle9/sample_app_spring and entẻ thí texxt
  password: '', // Abc@12345678
  role: 'ROLE_ADMIN',
  password_confirmation: 'Abc@12345678',
  errorMessage: [] as string[],
};

const New: NextPage = () => {
  const router = useRouter()
  const [state, setState] = useState(initialState)
  const myRef = useRef() as MutableRefObject<HTMLInputElement>
  const dispatch = useDispatch()

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    const { username, email, role, password, password_confirmation } = state

    userApi.create(
      {
        // user: {
          username,
          email,
          role,
          password,
          // password_confirmation: password_confirmation
        // }
      }
    ).then(response => {
      if (response.accessToken) {
        myRef.current.blur()
        if (1 === 1) {
          // localStorage.setItem('token', response.jwt)
          localStorage.setItem('token', response.accessToken)
          localStorage.setItem('refreshToken', response.refreshToken)
          localStorage.setItem('userID', response.id)
        } else {
          // sessionStorage.setItem('token', response.jwt)
          sessionStorage.setItem('token', response.accessToken)
          sessionStorage.setItem('refreshToken', response.refreshToken)
          sessionStorage.setItem('userID', response.id)
        }
        dispatch(fetchUser())
        // router.push('/users/'+response.id)
      }
      // if (typeof response === 'string') {
      // if (response.status === 400) {
      //   myRef.current.blur()
      //   setState({
      //     ...state,
      //     errorMessage: [response.errors[0].codes[1]],
      //   });
      // }
    })
    .catch(error => { // status code = 400 auto run into this
      console.log('My error', typeof error)
      console.log('My error', JSON.stringify(error))
      myRef.current.blur()
      setState({
        ...state,
        errorMessage: [error.message],
      });
    })
    e.preventDefault()
  }

  return (
    <>
    <h1>Log in</h1>

    <div className="row">
      <div className="col-md-6 col-md-offset-3">
        <form
        className="new_user"
        id="new_user" action="/users"
        acceptCharset="UTF-8"
        method="post"
        onSubmit={handleSubmit}
        >
          { state.errorMessage.length !== 0 &&
            errorMessage(state.errorMessage)
          }

          {/* <label htmlFor="user_name">Username</label> */}
          <input
          className="form-control"
          type="hidden"
          name="username"
          id="user_name"
          autoComplete="off"
          value={state.username}
          onChange={handleChange}
          />

          <label htmlFor="user_email">Email</label>
          <input
          className="form-control"
          type="email"
          name="email"
          id="user_email"
          value={state.email}
          onChange={handleChange}
          />

          {/* <label htmlFor="user_role">Role</label> */}
          <input
          className="form-control"
          type="hidden"
          name="role"
          id="user_role"
          value={state.role}
          onChange={handleChange}
          />

          <label htmlFor="user_password">Password</label>
          <input
          className="form-control"
          type="password"
          name="password"
          id="user_password"
          value={state.password}
          onChange={handleChange}
          />

          {/* <label htmlFor="user_password_confirmation">Confirmation</label> */}
          <input
          disabled
          className="form-control"
          type="hidden"
          name="password_confirmation"
          id="user_password_confirmation"
          value={state.password_confirmation}
          onChange={handleChange}
          />

          <input ref={myRef} type="submit" name="commit" value="Log in" className="btn btn-primary" data-disable-with="Create my account" />
    </form>  </div>
    </div>
    </>
  )
}

export default New
