import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const Show: NextPage = () => {
  const router = useRouter()
  const id = router.query.id
  return (
    <h1>Details about user {id}</h1>
  )
}

export default Show
