import { Link, useLocation } from 'react-router-dom'
import { PROFILE } from '../data'

export default function Nav() {
  const { pathname } = useLocation()
  const home = pathname === '/'
  return (
    <nav className="sticky top-0 z-20 border-b border-line-2 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-5 sm:px-8">
        <Link to="/" className="text-[15px] font-bold tracking-tight">{PROFILE.name}</Link>
        <ul className="flex items-center gap-1 text-[13.5px] font-medium text-ink-2">
          <li><a className="rounded-md px-3 py-1.5 hover:bg-paper-2 hover:text-ink" href={home ? '#cv' : '/#/?s=cv'}>이력</a></li>
          <li><a className="rounded-md px-3 py-1.5 hover:bg-paper-2 hover:text-ink" href={home ? '#timeline' : '/#/?s=timeline'}>타임라인</a></li>
          <li><a className="ml-1 rounded-md bg-ink px-3 py-1.5 text-paper hover:bg-accent" href={`mailto:${PROFILE.email}`}>이메일</a></li>
        </ul>
      </div>
    </nav>
  )
}
