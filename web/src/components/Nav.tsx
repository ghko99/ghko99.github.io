import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { PROFILE } from '../data'
import { T, setLang, setTheme, useLang, useTheme } from '../i18n'

const item = 'rounded-md px-3 py-1.5 hover:bg-paper-2 hover:text-ink'

export default function Nav() {
  const { pathname } = useLocation()
  const nav = useNavigate()
  const lang = useLang()
  const theme = useTheme()
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
  const dark = theme === 'dark' || (theme === 'auto' && typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches)
  return (
    <nav className="sticky top-0 z-20 border-b border-line-2 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-5 sm:px-8">
        <Link to="/" className="text-[15px] font-bold tracking-tight">{T(PROFILE.name, PROFILE.en)}</Link>
        <ul className="flex items-center gap-1 text-[13.5px] font-medium text-ink-2">
          <li><button type="button" className={item} onClick={() => go('cv')}>{T('이력', 'CV')}</button></li>
          <li><button type="button" className={item} onClick={() => go('timeline')}>{T('타임라인', 'Timeline')}</button></li>
          <li className="hidden sm:block"><button type="button" className={item} onClick={mail} title={PROFILE.email}>{copied ? T(`${PROFILE.email} 복사됨`, 'Email copied') : T('이메일', 'Email')}</button></li>
          <li className="ml-1 flex overflow-hidden rounded-full border border-line text-[12px]">
            {(['ko', 'en'] as const).map((l) => (
              <button key={l} type="button" onClick={() => setLang(l)} className={`px-2 py-1 ${lang === l ? 'bg-ink text-paper' : 'text-ink-3 hover:text-ink'}`}>{l.toUpperCase()}</button>
            ))}
          </li>
          <li>
            <button type="button" onClick={() => setTheme(dark ? 'light' : 'dark')} aria-label={T('화면 모드 바꾸기', 'Toggle theme')} title={T('화면 모드', 'Theme')} className="ml-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-2 hover:text-ink">
              {dark ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" /></svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13.4A8.5 8.5 0 0 1 10.6 4a8.5 8.5 0 1 0 9.4 9.4z" /></svg>
              )}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
