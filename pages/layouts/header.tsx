import type { NextPage } from 'next'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { fetchUser, selectUser } from '../../redux/session/sessionSlice'
import { useRouter } from 'next/router'
import { useAppSelector } from '../../redux/hooks'
import sessionApi from '../../components/shared/api/sessionApi'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Stack,
  Menu,
  MenuItem
} from '@mui/material'
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useState } from 'react'

const Header: NextPage = () => {
  const router = useRouter()
  const userData = useAppSelector(selectUser);
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const onClick = () => {
    handleClose()
    sessionApi.destroy(
      {
        refreshToken: `${localStorage.getItem('refreshToken')}`,
      }
    ).then(() => {
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("userID")
      // localStorage.removeItem("remember_token")
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("refreshToken")
      sessionStorage.removeItem("userID")
      // sessionStorage.removeItem("remember_token")
      router.push('/')
      dispatch(fetchUser()) 
    })
    .catch((error) => {
      console.log("logout error", error)
    })
  }

  return (
    <AppBar position='static' color='transparent'>
      <Toolbar>
        <Link href="/" passHref>
        <IconButton size='large' edge='start' color='inherit' aria-label='logo'>
          <CatchingPokemonIcon />
        </IconButton>
        </Link>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          {/* sample app */}
        </Typography>
        <Stack direction='row' spacing={2}>
          <Link href="/" passHref><Button color='inherit'>Home</Button></Link>
          <Link href="/help" passHref><Button color='inherit'>Help</Button></Link>
          {
            userData.status === 'loading' ? (
              <Button color='inherit'>Loading</Button>
            ) : userData.error ? (
              <Button color='inherit'>{userData.error}</Button>
            ) : userData.loggedIn ? (
              <>
              <Link href="/users" passHref><Button color='inherit'>Users</Button></Link>
              <Button
                color='inherit'
                id='resources-button'
                aria-controls={open ? 'resources-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                endIcon={<KeyboardArrowDownIcon />}
                onClick={handleClick}>
                Account
              </Button>
              </>
            ) : (
              <Link href="/login" passHref>
              <Button color='inherit'>Log in</Button>
              </Link>
            )
          }
        </Stack>
        <Menu
          id='resources-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          MenuListProps={{
            'aria-labelledby': 'resources-button'
          }}>
          <Link href={"/users/"+userData.value.id} passHref>
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          </Link>
          <Link href={"/users/"+userData.value.id+"/edit"} passHref>
          <MenuItem onClick={handleClose}>Settings</MenuItem>
          </Link>
          <MenuItem onClick={onClick}>Log out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
    // <header className="navbar navbar-fixed-top navbar-inverse">
    //   <div className="container">
    //   <Link href="/"><a id="logo">sample app</a></Link>
    //     <nav>
    //       <div className="navbar-header">
    //         <button type="button" className="navbar-toggle collapsed"
    //                 data-toggle="collapse"
    //                 data-target="#bs-example-navbar-collapse-1"
    //                 aria-expanded="false">
    //           <span className="sr-only">Toggle navigation</span>
    //           <span className="icon-bar"></span>
    //           <span className="icon-bar"></span>
    //           <span className="icon-bar"></span>
    //         </button>
    //       </div>
    //       <ul className="nav navbar-nav navbar-right collapse navbar-collapse"
    //           id="bs-example-navbar-collapse-1">
    //         <li><Link href="/"><a >Home</a></Link></li>
    //         <li><Link href="/help"><a >Help</a></Link></li>
    //         {
    //           userData.status === 'loading' ? (
    //             <li><Link href="/"><a >Loading</a></Link></li>
    //           ) : userData.error ? (
    //             <li><Link href="/"><a >{userData.error}</a></Link></li>
    //           ) : userData.loggedIn ? (
    //             <>
    //             <li><Link href="/users"><a >Users</a></Link></li>
    //             <li><Link href={"/users/"+userData.value.id}>Profile</Link></li>
    //             <li><Link href={"/users/"+userData.value.id+"/edit"}><a >Settings</a></Link></li>
    //             <li className="divider"></li>
    //             <li>
    //               {/*<button onClick={onClick}>Logout</button>*/}
    //               <Link href="#logout"><a onClick={onClick}>Log out</a></Link>
    //             </li>
    //             </>
    //           ) : (
    //             <li><Link href="/login"><a >Log in</a></Link></li>
    //           )
    //         }
    //       </ul>
    //     </nav>
    //   </div>
    // </header>
    // <></>
    // <header className="navbar navbar-fixed-top navbar-inverse">
    //   <div className="container">
    //     <Link href="/"><a id="logo">sample app</a></Link>
    //     <nav>
    //       <div className="navbar-header">
    //         <button type="button" className="navbar-toggle collapsed"
    //                 data-toggle="collapse"
    //                 data-target="#bs-example-navbar-collapse-1"
    //                 aria-expanded="false">
    //           <span className="sr-only">Toggle navigation</span>
    //           <span className="icon-bar"></span>
    //           <span className="icon-bar"></span>
    //           <span className="icon-bar"></span>
    //         </button>
    //       </div>
    //       <ul className="nav navbar-nav navbar-right collapse navbar-collapse"
    //           id="bs-example-navbar-collapse-1">
    //         <li><Link href="/"><a >Home</a></Link></li>
    //         <li><Link href="/help"><a >Help</a></Link></li>
    //         {
    //         userData.status === 'loading' ? (
    //         <li><Link href="/"><a >Loading</a></Link></li>
    //         ) : userData.error ? (
    //         <li><Link href="/"><a >{userData.error}</a></Link></li>
    //         ) : userData.loggedIn ? (
    //         <>
    //         <li><Link href="/users"><a >Users</a></Link></li>
    //         <li className="dropdown">
    //           <a href="#" className="dropdown-toggle" data-toggle="dropdown">
    //             Account <b className="caret"></b>
    //           </a>
    //           <ul className="dropdown-menu">
    //             <li><Link href={"/users/"+userData.value.id}>Profile</Link></li>
    //             <li><Link href={"/users/"+userData.value.id+"/edit"}><a >Settings</a></Link></li>
    //             <li className="divider"></li>
    //             <li>
    //               <Link href="#logout"><a onClick={onClick}>Log out</a></Link>
    //             </li>
    //           </ul>
    //         </li>
    //         </>
    //         ) : (
    //         <li><Link href="/login"><a >Log in</a></Link></li>
    //         )
    //         }
    //       </ul>
    //     </nav>
    //   </div>
    // </header>
  )
}

export default Header
