import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { PROFILE } from '../data'

const item = 'rounded-md px-3 py-1.5 hover:bg-paper-2 hover:text-ink'

export default function Nav() {
  const { pathname } = useLocation()
  const nav = useNavigate()
  const [copied, setCopied] = useState(false)
  // 홈이면 해당 절로 스크롤, 상세 페이지면 홈으로 이동한 뒤 스크롤(Home이 ?s=를 읽음)
  const go = (s: string) => {
    if (pathname === '/') document.getElementById(s)?.scrollIntoView({ behavior: 'smooth' })
    else nav(`/?s=${s}`)
  }
  // mailto 핸들러가 없는 환경도 있어서, 누르면 주소를 복사하고 알려준다
  const mail = async () => {
    try { await navigator.clipboard.writeText(PROFILE.email); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { location.href = `mailto:${PROFILE.email}` }
  }
  return (
    <nav className="sticky top-0 z-20 border-b border-line-2 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-5 sm:px-8">
        <Link to="/" className="text-[15px] font-bold tracking-tight">{PROFILE.name}</Link>
        <ul className="flex items-center gap-1 text-[13.5px] font-medium text-ink-2">
          <li><button type="button" className={item} onClick={() => go('cv')}>이력</button></li>
          <li><button type="button" className={item} onClick={() => go('timeline')}>타임라인</button></li>
          <li><button type="button" className={item} onClick={mail} title={PROFILE.email}>{copied ? `${PROFILE.email} 복사됨` : '이메일'}</button></li>
        </ul>
      </div>
    </nav>
  )
}
