import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import flashMessage from '../components/shared/flashMessages'
import { MutableRefObject, useRef, useState } from 'react'
import axios from 'axios'

const Edit: NextPage = () => {
  const router = useRouter()
  const { token } = router.query
  const dispatch = useDispatch()
  const myRef = useRef() as MutableRefObject<HTMLInputElement>

  axios.post(`http://localhost:3001/v1/auth/verify-email?token=${token}`, { withCredentials: true }
  ).then(response => {
    setTimeout(() => {
      if (response.status === 204) {
        flashMessage('success', 'Account activated!')
        router.push("/")
      }
      if (response.status === 401) {
        flashMessage('success', 'Verify email failed')
        router.push("/")
      }
    })
  })
  .catch(error => {
    console.log(error)
  })
  return (
      <>
      <h1>Email Verifing ...</h1>
      <h1>{token}</h1>
      </>
  )
}

export default Edit
