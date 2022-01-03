import type { NextPage } from 'next'
import Link from 'next/link'

const Footer: NextPage = () => {
  return (
    <footer className="footer">
      <small>
        The <Link href="https://nextjs.org/"><a target="_blank">NextJS Tutorial</a></Link> by <Link href="https://github.com/sonhle9"><a target="_blank">sonhle9</a></Link>
      </small>
      <nav>
        <ul>
          <li><Link href="/about"><a >About</a></Link></li>
          <li><Link href="/contact"><a >Contact</a></Link></li>
          <li><Link href="https://nextjs.org/blog"><a target="_blank">News</a></Link></li>
        </ul>
      </nav>
    </footer>
  )
}

export default Footer
