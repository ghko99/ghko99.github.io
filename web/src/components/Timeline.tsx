import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { site, byId, img } from '../data'
import { stackOf } from '../data/stack'
import { cardOf } from '../data/card'
import type { Kind } from '../data/types'

/** 스크롤에 따라 나타나는 카드 */
function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current!
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { el.classList.add('opacity-100', 'translate-y-0'); io.disconnect() } }), { rootMargin: '0px 0px -6% 0px', threshold: 0.05 })
    io.observe(el); return () => io.disconnect()
  }, [])
  return <div ref={ref} className={`translate-y-5 opacity-0 transition duration-700 ease-out ${className}`}>{children}</div>
}

/** 가로 · 핵심만: 한 줄에 제목과 한 줄 요약만 */
function Horizontal() {
  let year = ''
  return (
    <div className="mt-2 overflow-x-auto pb-4 pt-2 [scrollbar-width:thin]">
      <div className="relative flex min-w-max items-start gap-4 pt-[22px] before:absolute before:left-0 before:right-0 before:top-[7px] before:h-px before:bg-line">
        {site.EVENTS.map((e, i) => {
          const y = e.d.slice(0, 4); const showYear = y !== year; year = y
          const yearEl = showYear && <div key={'y' + y} className="relative -mt-[22px] flex-none self-start bg-paper px-3 text-[14px] font-semibold tabular-nums leading-[1.5] text-ink-2">{y}</div>
          if (e.ms) return (
            <div key={i} className="contents">{yearEl}
              <div className="relative w-[170px] flex-none border-l border-line-2 pl-3 text-[12.5px] leading-normal text-ink-2 before:absolute before:-left-[4px] before:-top-[20px] before:h-[7px] before:w-[7px] before:rounded-full before:bg-ink-3">
                <span className="mb-1 block text-[12px] tabular-nums text-ink-3">{e.d}</span>{e.ms.split('. ')[0].split(' — ')[0]}
              </div>
            </div>
          )
          const it = byId(e.k as Kind, e.id!)!
          const sub = e.k === 'pub' ? it.venue : it.res || it.who
          return (
            <div key={i} className="contents">{yearEl}
              <Link to={`/p/${e.k}/${it.id}`} onClick={() => { try { sessionStorage.setItem('homeScroll', String(window.scrollY)) } catch { /* ignore */ } }} className="group relative w-[218px] flex-none border-l border-line-2 pl-0.5 text-left before:absolute before:-left-[5px] before:-top-[20px] before:h-[9px] before:w-[9px] before:rounded-full before:border before:border-ink-3 before:bg-paper">
                <span className="block pl-2.5 text-[12px] tabular-nums text-ink-3">{e.d}</span>
                <span className="mb-1 mt-1.5 block pl-2.5 text-[11.5px] font-medium text-ink-2">{e.k === 'pub' ? '논문' : '프로젝트'}</span>
                <b className="line-clamp-3 block pl-2.5 text-[14.5px] font-semibold leading-[1.45] group-hover:text-accent">{it.ko || it.t}</b>
                <span className="mt-1 line-clamp-2 block pl-2.5 text-[12px] text-ink-3">{sub}</span>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const loadMode = (): 'v' | 'h' => { try { return localStorage.getItem('tlmode') === 'h' ? 'h' : 'v' } catch { return 'v' } }

export default function Timeline() {
  const [mode, setMode] = useState<'v' | 'h'>(loadMode)
  useEffect(() => { try { localStorage.setItem('tlmode', mode) } catch { /* ignore */ } }, [mode])
  let year = ''; let side = 0
  const tgl = (m: 'v' | 'h') => `px-3 py-[5px] ${mode === m ? 'bg-ink text-paper' : 'bg-paper text-ink-3 hover:text-ink'}`
  return (
    <section id="timeline" className="border-t border-line-2 pb-24 pt-12 sm:pt-16">
      <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="text-[22px] font-bold tracking-tight sm:text-[26px]">타임라인 <span className="ml-2 text-[13px] font-normal text-ink-3">2022 – 2026 · 논문과 프로젝트를 시간순으로</span></h2>
          <div role="group" aria-label="타임라인 보기 방식" className="inline-flex overflow-hidden rounded-full border border-line text-[12.5px]">
            <button type="button" className={tgl('v')} onClick={() => setMode('v')}>세로 · 자세히</button>
            <button type="button" className={tgl('h')} onClick={() => setMode('h')}>가로 · 핵심만</button>
          </div>
        </div>
        {mode === 'h' && <Horizontal />}
        <div hidden={mode === 'h'} className="relative mx-auto max-w-[1040px] before:absolute before:bottom-0 before:left-2 before:top-0 before:w-px before:bg-line md:before:left-1/2">
          {site.EVENTS.map((e, i) => {
            const y = e.d.slice(0, 4); const showYear = y !== year; year = y
            const yearEl = showYear && (
              <div key={'y' + y} className="relative my-8 flex justify-start pl-8 md:justify-center md:pl-0">
                <span className="bg-paper px-3 text-[14px] font-semibold tabular-nums text-ink-2">{y}</span>
              </div>
            )
            if (e.ms) return (
              <div key={i}>{yearEl}
                <Reveal className="relative my-4 flex pl-8 md:justify-center md:pl-0">
                  <span className="absolute left-2 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-3 md:left-1/2" />
                  <span className="text-[13px] text-ink-2 md:ml-[calc(50%+18px)]"><b className="mr-2 font-medium tabular-nums text-ink-3">{e.d}</b>{e.ms}</span>
                </Reveal>
              </div>
            )
            const it = byId(e.k as Kind, e.id!)!; const L = side % 2 === 0; side++
            const kind = e.k === 'pub' ? '논문' : '프로젝트'
            const sub = e.k === 'pub' ? it.venue : it.who
            const span = it.y.includes('–') ? ' – ' + it.y.split('–')[1].trim() : ''
            const cd = cardOf(e.k, it.id)
            const card = (
              <Link to={`/p/${e.k}/${it.id}`} onClick={() => { try { sessionStorage.setItem('homeScroll', String(window.scrollY)) } catch { /* ignore */ } }} className="group flex flex-col gap-2.5 text-left">
                {it.cover && <div className="mb-0.5 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md border border-line-2 bg-paper-2 transition group-hover:border-ink-3"><img src={img(it.cover)} alt="" loading="lazy" className="h-full w-full object-contain" /></div>}
                <div className="flex items-center gap-2.5 text-[12.5px] text-ink-3"><b className="font-medium text-ink-2">{kind}</b><span className="text-line">|</span><span>{e.d}{span}</span>{e.k === 'pub' && it.st && <span>· {it.st}</span>}</div>
                <h3 className="text-[18px] font-semibold leading-snug tracking-tight transition group-hover:text-accent">{it.t}{it.ko && <span className="mt-0.5 block text-[13.5px] font-normal text-ink-2">{it.ko}</span>}</h3>
                {(cd?.logos.length || e.k === 'pub' || !cd) ? <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-ink-2">
                  {cd?.logos.map((l) => <img key={l} src={`/logos/${l}`} alt="" className="inline-block h-[18px] w-auto max-w-[140px] object-contain" loading="lazy" />)}
                  {(e.k === 'pub' || !cd) && <span>{sub}</span>}
                </div> : null}
                <div className="text-[13.5px] leading-relaxed text-ink-2">{cd ? cd.what : e.sum}</div>
                {cd && <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-0.5 text-[13px] text-ink-2">
                  <dt className="font-medium text-ink">역할</dt><dd>{cd.role}</dd>
                  <dt className="font-medium text-ink">성과</dt><dd>{cd.result}</dd>
                </dl>}
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12.5px] text-ink-3">{(stackOf(e.k, it.id) || (it.tags || []).map((t) => [t] as [string])).slice(0, 6).map(([t, logo]) => <span key={t} className="inline-flex items-center gap-1">{logo && <img src={`/logos/${logo}`} alt="" className="h-[14px] w-[14px] object-contain" loading="lazy" />}{t}</span>)}</div>
                <div className="text-[13px] text-ink-3 underline decoration-line underline-offset-4 transition group-hover:text-accent group-hover:decoration-accent">문제 해결 과정 보기</div>
              </Link>
            )
            return (
              <div key={i}>{yearEl}
                <div className="relative mb-10 grid grid-cols-1 gap-x-16 pl-8 md:grid-cols-2 md:pl-0">
                  <span className="absolute left-2 top-[26px] z-[1] h-[9px] w-[9px] -translate-x-1/2 rounded-full border border-ink-3 bg-paper md:left-1/2" />
                  <Reveal className={L ? 'md:col-start-1' : 'md:col-start-2'}>{card}</Reveal>
                  <div className={`hidden pt-[18px] text-[13px] text-ink-3 md:block ${L ? 'md:col-start-2' : 'md:col-start-1 md:row-start-1 md:text-right'}`}>{e.d}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
