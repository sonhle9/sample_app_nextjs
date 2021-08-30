import type { NextPage } from 'next'
import Head from 'next/head'
import Header from './header'
import Footer from './footer'

const Layout: NextPage = ({ children }) => {
  return (
    <div className="App">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="container">
        { children }

        <Footer />
      </div>
    </div>
  )
}

export default Layout
