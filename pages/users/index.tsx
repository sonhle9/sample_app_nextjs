import type { NextPage } from 'next'
import React, { useCallback, useEffect, useState } from 'react'
import Pagination from 'react-js-pagination'
import { useAppSelector } from '../../redux/hooks'
import { selectUser } from '../../redux/session/sessionSlice'
import userApi, { User } from '../../components/shared/api/userApi'
import flashMessage from '../../components/shared/flashMessages'
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper
} from '@mui/material'

const Index: NextPage = () => {
  const [users, setUsers] = useState([] as User[])
  const [page, setPage] = useState(1)
  const [total_count, setTotalCount] = useState(1)
  const current_user = useAppSelector(selectUser);

  const setUsersList= useCallback(async () => { 
    userApi.index({page: page}
    ).then(response => {
      if (response.results) {
        setUsers(response.results)
        setTotalCount(response.totalResults)
      } else {
        setUsers([])
      }
    })
    .catch(error => {
      console.log(error)
    })
  }, [page])

  useEffect(() => {
    setUsersList()
  }, [setUsersList])

  const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
    setPage(pageNumber)
  }

  const removeUser = (userId: string) => {
    let sure = window.confirm("You sure?")
    if (sure === true) {
      userApi.destroy(userId
      ).then(response => {
          if (response.flash) {
            flashMessage(...response.flash)
            setUsersList()
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  return (
    <>
    <h1>All users</h1>

    <Pagination
      activePage={page}
      itemsCountPerPage={5}
      totalItemsCount={total_count}
      pageRangeDisplayed={5}
      onChange={handlePageChange}
    />

    {/* <ul className="users">
      {users.map((u, i) => (
      <li key={i}>
        <img alt={u.name} className="gravatar" src={"https://secure.gravatar.com/avatar/"+u.gravatar_id+"?s="+u.size} />
        <a href={'/users/'+u.id}>{u.name}</a>
        {
          current_user.value.admin && current_user.value.id !== u.id ? (
            <>
            | <a href={'#/users/'+u.id} onClick={() => removeUser(i, u.id)}>delete</a>
            </>
          ) : (
            <></>
          )
        }
      </li>
      ))}
    </ul> */}
    <TableContainer sx={{ maxHeight: '300px' }} component={Paper}>
      <Table stickyHeader aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>id</TableCell>
            <TableCell>avatar</TableCell>
            <TableCell>role</TableCell>
            <TableCell>isEmailVerified</TableCell>
            <TableCell>name</TableCell>
            <TableCell>email</TableCell>
            {/* <TableCell>password</TableCell>
            <TableCell>createdAt</TableCell>
            <TableCell>updatedAt</TableCell> */}
            <TableCell>deactive</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(u => (
            <TableRow
              key={u.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                
              <TableCell>{u.id}</TableCell>

              <TableCell align='center'>
                <img alt={u.name} className="gravatar" src={"https://secure.gravatar.com/avatar/"+u.id+"?s=50"} />
              </TableCell>

              <TableCell>{u.role}</TableCell>

              <TableCell>{u.isEmailVerified}</TableCell>

              <TableCell>
                <a href={'/users/'+u.id}>{u.name}</a>
              </TableCell>

              <TableCell>{u.email}</TableCell>

              {/* <TableCell>{u.password}</TableCell>

              <TableCell>{u.createdAt}</TableCell>

              <TableCell>{u.updatedAt}</TableCell> */}

              <TableCell>
              {
                current_user.value.role==="admin" && current_user.value.id !== u.id ? (
                  <>
                  | <a href={'#/users/'+u.id} onClick={() => removeUser(u.id)}>delete</a>
                  </>
                ) : (
                  <></>
                )
              }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Pagination
      activePage={page}
      itemsCountPerPage={5}
      totalItemsCount={total_count}
      pageRangeDisplayed={5}
      onChange={handlePageChange}
    />
    </>
  )
}

export default Index
