import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { site, byId, img } from '../data'
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

export default function Timeline() {
  let year = ''; let side = 0
  return (
    <section id="timeline" className="border-t border-line-2 pb-24 pt-12 sm:pt-16">
      <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
        <div className="mb-10 text-center"><h2 className="text-[26px] font-extrabold tracking-tight sm:text-[32px]">타임라인 · 2022 – 2026</h2></div>
        <div className="relative mx-auto max-w-[1040px] before:absolute before:bottom-0 before:left-2 before:top-0 before:w-px before:bg-line md:before:left-1/2">
          {site.EVENTS.map((e, i) => {
            const y = e.d.slice(0, 4); const showYear = y !== year; year = y
            const yearEl = showYear && (
              <div key={'y' + y} className="relative my-8 flex justify-start pl-8 md:justify-center md:pl-0">
                <span className="rounded-full bg-ink px-4 py-1 text-[14px] font-bold text-paper">{y}</span>
              </div>
            )
            if (e.ms) return (
              <div key={i}>{yearEl}
                <Reveal className="relative my-4 flex pl-8 md:justify-center md:pl-0">
                  <span className="absolute left-2 top-1/2 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-4 ring-accent-2 md:left-1/2" />
                  <span className="text-[13px] text-ink-2 md:ml-[calc(50%+18px)]"><b className="mr-2 font-medium tabular-nums text-ink-3">{e.d}</b>{e.ms}</span>
                </Reveal>
              </div>
            )
            const it = byId(e.k as Kind, e.id!)!; const L = side % 2 === 0; side++
            const kind = e.k === 'pub' ? '논문' : '프로젝트'
            const sub = e.k === 'pub' ? it.venue : it.who
            const span = it.y.includes('–') ? ' – ' + it.y.split('–')[1].trim() : ''
            const card = (
              <Link to={`/p/${e.k}/${it.id}`} className="group flex flex-col gap-3 text-left">
                {it.cover && <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md border border-line-2 bg-paper-2 transition group-hover:-translate-y-1 group-hover:shadow-[0_20px_44px_-20px_rgba(37,99,235,.3)]"><img src={img(it.cover)} alt="" loading="lazy" className="h-full w-full object-contain transition duration-700 group-hover:scale-[1.02]" /></div>}
                <div className="flex items-center gap-2.5 text-[12.5px] text-ink-3"><b className="rounded-md bg-accent-2 px-2 py-px text-[11.5px] font-medium text-accent">{kind}</b><span>{e.d}{span}</span>{e.k === 'pub' && it.st && <span>· {it.st}</span>}</div>
                <h3 className="text-[19px] font-bold leading-snug tracking-tight transition group-hover:text-accent">{it.t}{it.ko && <span className="mt-0.5 block text-[13.5px] font-normal text-ink-2">{it.ko}</span>}</h3>
                <div className="text-[13.5px] text-ink-2">{sub}{e.k === 'pub' && it.role ? ` · ${it.role}` : ''}{e.k === 'proj' && it.res ? ` · ${it.res}` : ''}</div>
                <div className="text-[13.5px] text-ink-2">{e.sum}</div>
                <div className="flex flex-wrap gap-x-2.5 text-[12.5px] text-ink-3">{(it.tags || []).slice(0, 5).map((t) => <span key={t}>{t}</span>)}</div>
                <div className="text-[13px] text-ink-3 transition group-hover:text-accent">문제 해결 과정 보기 →</div>
              </Link>
            )
            return (
              <div key={i}>{yearEl}
                <div className="relative mb-10 grid grid-cols-1 gap-x-16 pl-8 md:grid-cols-2 md:pl-0">
                  <span className="absolute left-2 top-[26px] z-[1] h-[11px] w-[11px] -translate-x-1/2 rounded-full border-2 border-accent bg-paper md:left-1/2" />
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
