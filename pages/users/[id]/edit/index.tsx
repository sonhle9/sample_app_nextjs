import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const Edit: NextPage = () => {
  const router = useRouter()
  const id = router.query.id
  return (
    <h1>Edit user {id}</h1>
  )
}

export default Edit
