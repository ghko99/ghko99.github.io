import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { byId, img, ORDER } from '../data'
import { stackOf } from '../data/stack'
import type { Img, Item, Kind, Node } from '../data/types'

function Figs({ imgs }: { imgs?: Img[] }) {
  const [lb, setLb] = useState<Img | null>(null)
  if (!imgs?.length) return null
  const two = imgs.length > 1
  return (
    <>
      <div className={two ? 'columns-1 gap-5 md:columns-2' : ''}>
        {imgs.map((im) => (
          <figure key={im.k} onClick={() => setLb(im)} className={`mb-5 cursor-zoom-in break-inside-avoid ${im.w ? 'md:[column-span:all] mx-auto max-w-[760px]' : ''} ${im.sm ? 'max-w-[380px]' : ''}`}>
            {/* 세로로 긴 그림은 폭을 채우지 않고 높이를 제한해 가운데 놓는다 */}
            <img src={img(im.k)} alt={im.c || ''} loading="lazy" className={`mx-auto block max-h-[480px] w-auto max-w-full rounded-md border border-line bg-white ${im.sm ? 'p-2.5' : ''}`} />
            {im.c && <figcaption className="mt-2 text-center text-[12.5px] text-ink-3">{im.c}</figcaption>}
          </figure>
        ))}
      </div>
      {lb && (
        <div className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/90 p-6" onClick={() => setLb(null)}>
          <figure><img src={img(lb.k)} alt="" className="max-h-[calc(100vh-80px)] max-w-full rounded-sm bg-white" /><figcaption className="mt-3 text-center text-[13px] text-neutral-300">{lb.c}</figcaption></figure>
        </div>
      )}
    </>
  )
}

function Step({ n, i, steps, onGo }: { n: Node; i: number; steps: Node[]; onGo: (j: number) => void }) {
  const total = steps.length
  const one = !(n.q && n.a)
  return (
    <div className="mt-9">
      <div className="mb-6 flex flex-wrap items-baseline gap-3.5"><small className="text-[12.5px] tabular-nums text-ink-3">{i + 1} / {total}</small><h2 className="text-[22px] font-bold tracking-tight sm:text-[26px]">{n.t}</h2>{n.s && <span className="text-[13.5px] text-ink-2">{n.s}</span>}</div>
      {(n.q || n.a) && (
        <div className={`prose-qa grid gap-6 ${one ? 'grid-cols-1' : 'grid-cols-1'}`}>
          {n.q && <div className="q"><h4 className="mb-3 flex items-center gap-2.5 text-[11.5px] font-bold tracking-[.14em] text-ink-3 before:h-px before:w-[22px] before:bg-ink-3">고민</h4><div dangerouslySetInnerHTML={{ __html: n.q }} /></div>}
          {n.a && <div className="a"><h4 className="mb-3 flex items-center gap-2.5 text-[11.5px] font-bold tracking-[.14em] text-accent before:h-px before:w-[22px] before:bg-accent">{n.q ? '해결' : '내용'}</h4><div dangerouslySetInnerHTML={{ __html: n.a }} /></div>}
        </div>
      )}
      {n.table && (
        <table className="mt-6 w-full border-collapse text-[13.5px] tabular-nums"><tbody>
          {n.table.map((r, ri) => <tr key={ri} className={ri === n.table!.length - 1 ? 'font-semibold' : ''}>{r.map((c, ci) => ri === 0 ? <th key={ci} className="border-b border-line-2 py-2 pr-3 text-left text-[12.5px] font-medium text-ink-3">{c}</th> : <td key={ci} className="border-b border-line-2 py-2 pr-3 align-top">{c}</td>)}</tr>)}
        </tbody></table>
      )}
      {n.num && (
        <table className="mt-6 w-full border-collapse text-[13.5px] tabular-nums"><thead><tr>{['지표', '이전', '결과', '비고'].map((h) => <th key={h} className="border-b border-line-2 py-2 pr-3 text-left text-[12.5px] font-medium text-ink-3">{h}</th>)}</tr></thead><tbody>
          {n.num.map((x, k) => <tr key={k}><td className="border-b border-line-2 py-2 pr-3">{x.l}</td><td className="border-b border-line-2 py-2 pr-3 whitespace-nowrap text-[13px] text-ink-3">{x.b || '—'}</td><td className="border-b border-line-2 py-2 pr-3 whitespace-nowrap text-[19px] font-bold">{x.a}</td><td className="border-b border-line-2 py-2 text-[12.5px] text-ink-3">{x.note}</td></tr>)}
        </tbody></table>
      )}
      <div className="mt-7"><Figs imgs={n.imgs} /></div>
      <div className="mt-9 flex justify-between gap-4 border-t border-line-2 pt-5 text-[14px]">
        {i > 0 ? <button type="button" onClick={() => onGo(i - 1)} className="text-left text-ink-2 hover:text-accent"><small className="block text-[12px] text-ink-3">이전 단계</small>{steps[i - 1].t}</button> : <span />}
        {i < total - 1 && <button type="button" onClick={() => onGo(i + 1)} className="text-right text-ink-2 hover:text-accent"><small className="block text-[12px] text-ink-3">다음 단계</small>{steps[i + 1].t}</button>}
      </div>
    </div>
  )
}

export default function Detail() {
  const { kind, id } = useParams<{ kind: Kind; id: string }>()
  const nav = useNavigate()
  const it: Item | undefined = kind && id ? byId(kind, id) : undefined
  const [cur, setCur] = useState(0)
  useEffect(() => { setCur(0); window.scrollTo(0, 0); if (it) document.title = `${it.t} — 고강희` }, [kind, id, it])
  // 닫기: 타임라인에서 들어왔으면 보던 위치로 돌아가고(Home이 homeScroll을 복원), 링크로 바로 열었으면 타임라인으로
  const close = () => { let y: string | null = null; try { y = sessionStorage.getItem('homeScroll') } catch { /* ignore */ } if (y) { try { sessionStorage.setItem('restoreScroll', '1') } catch { /* ignore */ } nav('/') } else nav('/?s=timeline') }
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape' && !document.querySelector('[role=dialog]')) close() }; addEventListener('keydown', k); return () => removeEventListener('keydown', k) })
  if (!it) return <div className="p-10">없는 항목입니다. <Link to="/" className="text-accent underline">홈으로</Link></div>
  const idx = ORDER.findIndex(([k, p]) => k === kind && p.id === id); const prev = ORDER[idx - 1]; const next = ORDER[idx + 1]
  const go = (j: number) => { setCur(j); setTimeout(() => document.getElementById('np')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0) }
  const steps = it.nodes
  return (
    <div className="mx-auto max-w-[1120px] px-5 pb-32 pt-6 sm:px-8 sm:pt-8">
      <button type="button" onClick={close} aria-label="닫기" title="닫기 (Esc)" className="fixed right-5 top-[68px] z-30 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper text-ink-2 shadow-[0_4px_14px_-6px_rgba(15,23,42,.3)] hover:border-ink hover:text-ink">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M2 2l10 10M12 2L2 12" /></svg>
      </button>
      <div className="mb-6 flex items-center justify-between text-[13px] text-ink-3">
        <button type="button" onClick={close} className="hover:text-ink">← 타임라인으로 돌아가기</button>
        <span>{kind === 'pub' ? '논문' : '프로젝트'}{kind === 'pub' && it.st ? ` · ${it.st}` : ''}</span>
      </div>
      <h1 className="text-[26px] font-bold leading-tight tracking-[-0.02em] sm:text-[34px]">{it.t}{it.ko && <span className="mt-2 block text-[16px] font-normal tracking-normal text-ink-2">{it.ko}</span>}</h1>
      <div className="mt-4 text-[13.5px] leading-relaxed text-ink-3">
        {kind === 'pub' ? <><b className="font-medium text-ink-2">{it.venue}</b> · {it.y}{it.role ? ` · ${it.role}` : ''}<br />{it.authors}</> : <><b className="font-medium text-ink-2">{it.y}</b> · {it.who}{it.res ? ` · ${it.res}` : ''}</>}
        {it.meta && <><br />{it.meta}</>}
      </div>
      {!!it.links?.length && <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[13.5px]">{it.links.map(([n, u]) => <a key={u} className="text-ink-2 underline decoration-line underline-offset-4 hover:text-accent" href={u.startsWith('papers/') ? '/' + u : u} target="_blank" rel="noopener">{n}</a>)}</div>}
      {(() => { const st = stackOf(kind!, id!); return st ? (
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-ink-2">
          {st.map(([name, logo]) => <span key={name} className="inline-flex items-center gap-1.5">{logo && <img src={`/logos/${logo}`} alt="" className="h-[16px] w-[16px] object-contain" loading="lazy" />}{name}</span>)}
        </div>
      ) : !!it.tags?.length && <div className="mt-3 text-[12.5px] text-ink-3">{it.tags.join(' · ')}</div> })()}

      <div className="mt-10"><Figs imgs={it.intro.imgs} /><h3 className="mb-2 text-[12.5px] font-medium text-ink-3">개요</h3><div className="intro" dangerouslySetInnerHTML={{ __html: it.intro.html }} /></div>

      <div className="sticky top-14 z-[2] mt-11 border-t border-line bg-paper pb-2 pt-4">
        <div className="mb-2.5 text-[12.5px] text-ink-3"><b className="font-medium text-ink">문제 해결 과정</b> — 단계를 누르면 아래에 그 단계의 고민과 해결이 열립니다.</div>
        <div className="flex overflow-x-auto pb-2 pt-1.5">
          {steps.map((n, j) => (
            <button key={j} type="button" onClick={() => go(j)} className="relative flex min-w-[112px] max-w-[180px] flex-1 flex-col items-start gap-1.5 pr-3.5 text-left before:absolute before:left-0 before:right-0 before:top-[13px] before:h-px before:bg-line first:before:left-[13px] last:before:right-auto last:before:w-[13px]">
              <small className={`relative z-[1] flex h-[26px] w-[26px] items-center justify-center rounded-full border-[1.5px] text-[11.5px] font-semibold tabular-nums ${j === cur ? 'border-ink bg-ink text-paper' : j < cur ? 'border-ink-2 bg-paper text-ink-2' : 'border-line bg-paper text-ink-3'}`}>{j + 1}</small>
              <b className={`text-[13px] leading-snug ${j === cur ? 'font-semibold text-ink' : 'font-medium text-ink-2'}`}>{n.t}</b>
              {n.s && <i className="-mt-1 text-[11.5px] not-italic text-ink-3">{n.s}</i>}
            </button>
          ))}
        </div>
      </div>
      <div id="np"><Step n={steps[cur]} i={cur} steps={steps} onGo={go} /></div>

      <div className="mt-14 flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-[14px]">
        {prev ? <button type="button" onClick={() => nav(`/p/${prev[0]}/${prev[1].id}`)} className="text-left text-ink-2 hover:text-accent"><small className="block text-[12px] text-ink-3">이전 · 시간순</small>{prev[1].t}</button> : <span />}
        {next && <button type="button" onClick={() => nav(`/p/${next[0]}/${next[1].id}`)} className="text-right text-ink-2 hover:text-accent"><small className="block text-[12px] text-ink-3">다음 · 시간순</small>{next[1].t}</button>}
      </div>
    </div>
  )
}
