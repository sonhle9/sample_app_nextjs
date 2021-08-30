import type { NextPage } from 'next'
import Link from 'next/link'

const Footer: NextPage = () => {
  return (
    <footer className="footer">
      <small>
        The <Link href="https://www.railstutorial.org/"><a >React Tutorial</a></Link> by <Link href="https://mdnv.github.io/"><a >mdnv</a></Link>
      </small>
      <nav>
        <ul>
          <li><Link href="/about"><a >About</a></Link></li>
          <li><Link href="/contact"><a >Contact</a></Link></li>
          <li><Link href="https://news.railstutorial.org/"><a >News</a></Link></li>
        </ul>
      </nav>
    </footer>
  )
}

export default Footer
