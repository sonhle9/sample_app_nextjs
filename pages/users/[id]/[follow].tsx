import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { SetStateAction, useCallback, useEffect, useState } from 'react'
import { useAppSelector } from '../../../redux/hooks'
import { selectUser } from '../../../redux/session/sessionSlice'
import userApi, { IUserFollow, UserFollow } from '../../../components/shared/api/userApi'
import flashMessage from '../../../components/shared/flashMessages'
import Pagination from 'react-js-pagination'

const ShowFollow: NextPage = () => {
  const [users, setUsers] = useState([] as UserFollow[])
  const [xusers, setXusers] = useState([] as UserFollow[])
  const [page, setPage] = useState(1)
  const [total_count, setTotalCount] = useState(1)
  const current_user = useAppSelector(selectUser)
  const [user, setUser] = useState({} as IUserFollow)
  const router = useRouter()
  const { id, follow } = router.query

  const setFollowPage= useCallback(async () => { 
    userApi.follow(id as string, page, follow as string
    ).then(response => {
      setUsers(response.users)
      setXusers(response.xusers)
      setTotalCount(response.total_count)
      setUser(response.user)
    })
    .catch((error: any) => {
      console.log(error)
    })
  }, [page, id, follow])

  useEffect(() => {
    setFollowPage()
  }, [setFollowPage])

  const handlePageChange = (pageNumber: SetStateAction<number>) => {
    console.log(`active page is ${pageNumber}`)
    setPage(pageNumber)
  }

  const removeUser = (userid: number) => {
    let sure = window.confirm("You sure?")
    if (sure === true) {
      userApi.destroy(userid
      ).then(response => {
          if (response.flash) {
            flashMessage(...response.flash)
            setFollowPage()
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  return (
    <>
    <div className="row">
      <aside className="col-md-4">
        <section className="user_info">
          <img alt={user.name} className="gravatar" src={"https://secure.gravatar.com/avatar/"+user.gravatar+"?s=80"} />
          <h1>{user.name}</h1>
          <span><Link href={"/users/"+user.id}>view my profile</Link></span>
          <span><b>Microposts:</b> {user.micropost}</span>
        </section>

        <section className="stats">
          <div className="stats">
            <Link href={"/users/"+user.id+"/following"}><a >
              <strong id="following" className="stat">
                {user.following}
              </strong> following
            </a></Link>
            <Link href={"/users/"+user.id+"/followers"}><a >
              <strong id="followers" className="stat">
                {user.followers}
              </strong> followers
            </a></Link>
          </div>

          <div className="user_avatars">
            {xusers.length > 0 &&
            <>
            {xusers.map((u, i) => (
            <Link key={i} href={'/users/'+u.id}><a >
              <img alt="{u.name}" className="gravatar" src={"https://secure.gravatar.com/avatar/"+u.gravatar_id+"?s=30"} />
            </a></Link>
            ))}
            </>
            }
          </div>
        </section>
      </aside>

      <div className="col-md-8">
        {users.length > 0 &&
        <>
        <h3>{follow?.toString()[0].toUpperCase()}{follow?.toString().slice(1)}</h3>
        {/* <h3>{follow?.toString().replace(/^\w/, (c) => c.toUpperCase())}</h3> */}
        {/* <h3>{follow?.toString().trim().replace(/^\w/, (c) => c.toUpperCase())}</h3> */}
        <ul className="users follow">
        {users.map((u, i) => (
        <li key={i}>
          <img alt={u.name} className="gravatar" src={"https://secure.gravatar.com/avatar/"+u.gravatar_id+"?s="+u.size} />
          <a href={'/users/'+u.id}>{u.name}</a>
          {
            current_user.value.admin && current_user.value.id !== u.id ? (
              <>
              | <a href={'#/users/'+u.id} onClick={() => removeUser(u.id)}>delete</a>
              </>
            ) : (
              <></>
            )
          }
        </li>
        ))}
        </ul>
        <Pagination
          activePage={page}
          itemsCountPerPage={5}
          totalItemsCount={total_count}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
        />
        </>
        }
      </div>
    </div>
    </>
  )
}

export default  ShowFollow
