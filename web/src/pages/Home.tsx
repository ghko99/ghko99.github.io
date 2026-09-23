import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import CV from '../components/CV'
import Timeline from '../components/Timeline'
import { PROFILE } from '../data'
import { T, useLang } from '../i18n'

export default function Home() {
  useLang()
  const { search } = useLocation()
  // 상세 페이지에서 "이력/타임라인"으로 돌아올 때 해당 절로 스크롤
  useEffect(() => {
    const s = new URLSearchParams(search).get('s')
    if (s) setTimeout(() => document.getElementById(s)?.scrollIntoView({ behavior: 'smooth' }), 50)
    // 상세 페이지를 닫고 돌아온 경우: 카드를 눌렀을 때의 스크롤 위치로 복원
    try {
      if (sessionStorage.getItem('restoreScroll') === '1') {
        const y = Number(sessionStorage.getItem('homeScroll') || 0)
        sessionStorage.removeItem('restoreScroll'); sessionStorage.removeItem('homeScroll')
        requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, y)))
      }
    } catch { /* ignore */ }
    document.title = T('고강희 · Ganghee Go', 'Ganghee Go · 고강희')
  }, [search])
  return (
    <>
      <Hero />
      <main>
        <CV />
        <Timeline />
      </main>
      <footer className="border-t border-line-2 py-8 text-[13px] text-ink-3">
        <div className="mx-auto flex max-w-[1120px] flex-wrap justify-between gap-2 px-5 sm:px-8">
          <span>{T(PROFILE.name, PROFILE.en)} · {T(PROFILE.en, PROFILE.name)}</span>
          <span>{PROFILE.email} · github.com/ghko99 · 2026.09</span>
        </div>
      </footer>
    </>
  )
}
