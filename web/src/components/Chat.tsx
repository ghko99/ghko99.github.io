import { useEffect, useRef, useState } from 'react'
import { img } from '../data'

const ENDPOINT = 'https://goganghee-chat.goganghee.workers.dev'
const SESSION_MAX = 30
const HI = '안녕하세요! 고강희입니다. 논문이나 프로젝트에서 궁금한 게 있으면 편하게 물어보세요.'

type Msg = { who: 'me' | 'him'; text: string; status?: string; sources?: { t: string; u: string }[] }
const listeners = new Set<() => void>()
/** 어디서든 채팅창을 연다 (히어로 사진, 런처) */
export const openChat = () => listeners.forEach((f) => f())

const clean = (t: string) => t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '$1($2)').replace(/`([^`]+)`/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/^[\s]*[-*•]\s+/gm, '').replace(/^#+\s*/gm, '').replace(/^(고강희|Ganghee)\s*[:：]\s*/, '').replace(/\n{3,}/g, '\n\n').trim()
const URL_RE = /(https?:\/\/[^\s<>()\]]+[^\s<>()\].,!?;:'"]|(?:github\.com|velog\.io|geulgyeol\.tech|ukta\.inha\.ac\.kr)\/[^\s<>()\]]+[^\s<>()\].,!?;:'"]|[\w.+-]+@[\w-]+\.[\w.]+)/g
function Linkify({ text }: { text: string }) {
  const out: React.ReactNode[] = []; let i = 0; let m: RegExpExecArray | null; const re = new RegExp(URL_RE)
  while ((m = re.exec(text))) { out.push(text.slice(i, m.index)); const raw = m[0]; out.push(<a key={m.index} href={raw.includes('@') ? 'mailto:' + raw : raw.startsWith('http') ? raw : 'https://' + raw} target="_blank" rel="noopener" className="break-all text-accent underline underline-offset-2">{raw}</a>); i = m.index + raw.length }
  out.push(text.slice(i)); return <>{out}</>
}

export default function Chat() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [locked, setLocked] = useState<string | null>(null)
  const turns = useRef<{ role: 'user' | 'assistant'; content: string }[]>([])
  const strikes = useRef(0); const sent = useRef(0); const lastAt = useRef(0)
  const logRef = useRef<HTMLDivElement>(null); const inRef = useRef<HTMLInputElement>(null)

  useEffect(() => { const f = () => setOpen(true); listeners.add(f); return () => { listeners.delete(f) } }, [])
  useEffect(() => { if (open && msgs.length === 0) { setMsgs([{ who: 'him', text: HI }]); turns.current.push({ role: 'assistant', content: HI }) } if (open) setTimeout(() => inRef.current?.focus(), 50) }, [open, msgs.length])
  useEffect(() => { const el = logRef.current; if (el) el.scrollTop = el.scrollHeight }, [msgs])
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }; addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [])

  const update = (f: (m: Msg) => Msg) => setMsgs((ms) => ms.map((m, i) => (i === ms.length - 1 ? f(m) : m)))

  async function ask(q: string) {
    q = q.trim(); if (!q || busy || locked || Date.now() - lastAt.current < 1500) return
    lastAt.current = Date.now(); setBusy(true); setInput('')
    turns.current.push({ role: 'user', content: q }); sent.current++
    setMsgs((ms) => [...ms, { who: 'me', text: q }, { who: 'him', text: '', status: '···' }])
    const request = () => fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: turns.current.slice(-12) }) })
    try {
      let res = await request()
      if (res.status === 502 || res.status === 503) { await new Promise((r) => setTimeout(r, 1500)); res = await request() }
      if (!res.ok) { update((m) => ({ ...m, status: undefined, text: res.status === 429 ? '지금 질문이 많이 몰려 있습니다. 잠시 후에 다시 물어봐 주십시오.' : '지금은 답변이 어렵습니다. 잠시 후 다시 물어봐 주십시오.' })); turns.current.pop(); return }
      const flag = res.headers.get('X-Flag')
      const reader = res.body!.getReader(); const dec = new TextDecoder(); let raw = ''; let text = ''; let sources: Msg['sources'] = []
      // 제어 줄(\x1e{json}\n)은 진행 상태·참고 자료, 나머지는 본문
      while (true) {
        const { value, done } = await reader.read(); if (done) break
        raw += dec.decode(value, { stream: true }); let out = ''; let i = 0
        while (i < raw.length) { const k = raw.indexOf('\x1e', i); if (k < 0) { out += raw.slice(i); i = raw.length; break } out += raw.slice(i, k); const nl = raw.indexOf('\n', k); if (nl < 0) { raw = raw.slice(k); i = -1; break }
          try { const ev = JSON.parse(raw.slice(k + 1, nl)); if (ev.s === 'tool') update((m) => ({ ...m, status: ev.label })); else if (ev.s === 'sources') sources = ev.items || [] } catch { /* ignore */ } i = nl + 1 }
        if (i !== -1) raw = ''
        text += out; if (text.trim()) update((m) => ({ ...m, status: undefined, text: clean(text) }))
      }
      text = clean(text); update((m) => ({ ...m, status: undefined, text, sources }))
      turns.current.push({ role: 'assistant', content: text })
      if (flag === 'abuse' && ++strikes.current >= 3) { update((m) => ({ ...m, text: '이 대화는 여기까지 하겠습니다.' })); setLocked('대화가 종료되었습니다.'); return }
      if (sent.current >= SESSION_MAX) { setMsgs((ms) => [...ms, { who: 'him', text: '여기까지 답하겠습니다. 더 궁금하신 점은 khko99@naver.com 로 보내 주시면 직접 답하겠습니다.' }]); setLocked('이메일로 문의해 주십시오.') }
    } catch { update((m) => ({ ...m, status: undefined, text: '연결이 잠시 끊겼습니다. 다시 한번 보내 주십시오.' })); turns.current.pop() }
    finally { setBusy(false); if (!locked) setTimeout(() => inRef.current?.focus(), 0) }
  }

  return (
    <>
      {!open && (
        <button type="button" onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-[39] inline-flex items-center gap-2.5 rounded-full bg-ink py-2.5 pl-2.5 pr-4 text-[14px] font-semibold text-paper shadow-[0_12px_30px_-10px_rgba(15,23,42,.45)] transition hover:-translate-y-0.5 hover:bg-accent hover:text-white">
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-2 text-[15px]">💬<i className="absolute -bottom-px -right-px h-[9px] w-[9px] rounded-full border-2 border-ink bg-emerald-400" /></span>고강희에게 질문하기
        </button>
      )}
      {open && (
        <div role="dialog" aria-label="고강희와 채팅" className="fixed bottom-5 right-5 z-40 flex h-[min(640px,calc(100vh-80px))] w-[min(400px,calc(100vw-40px))] flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_24px_70px_-20px_rgba(15,23,42,.35)]">
          <div className="flex items-center gap-3 border-b border-line-2 px-3.5 py-3">
            <img src={img('profile')} alt="" className="h-10 w-10 rounded-full border-2 border-accent-2 object-cover object-[50%_18%]" />
            <div className="min-w-0 flex-1 leading-tight"><b className="block text-[15px] font-semibold">고강희</b><span className="flex items-center gap-1.5 text-[12px] text-ink-3"><i className="h-[7px] w-[7px] rounded-full bg-emerald-400" />지금 답할 수 있어요</span></div>
            <button type="button" onClick={() => setOpen(false)} className="px-2 py-1.5 text-[13px] text-ink-3 hover:text-ink">닫기</button>
          </div>
          <div ref={logRef} className="flex flex-1 flex-col gap-1.5 overflow-y-auto bg-paper-2 px-3.5 py-4">
            {msgs.map((m, i) => (
              <div key={i} className="contents">
                <div className={`max-w-[84%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-[14.5px] leading-relaxed ${m.who === 'me' ? 'self-end rounded-br-md bg-accent text-white' : 'self-start rounded-bl-md border border-line-2 bg-paper'} ${m.status ? 'flex items-center gap-2 text-[13.5px] text-ink-3' : ''}`}>
                  {m.status ? (m.status === '···' ? '···' : <><span className="h-3 w-3 flex-none animate-spin rounded-full border-2 border-line-2 border-t-accent" />{m.status}</>) : m.who === 'him' ? <Linkify text={m.text} /> : m.text}
                </div>
                {!!m.sources?.length && <div className="-mt-1 mb-0.5 ml-1 flex max-w-[84%] flex-wrap items-center gap-1.5 self-start text-[11.5px] text-ink-3">참고{m.sources.map((s) => <a key={s.u} href={s.u} target="_blank" rel="noopener" className="rounded-full border border-line-2 bg-paper px-2 py-px hover:border-accent hover:text-accent">{s.t}</a>)}</div>}
              </div>
            ))}
          </div>
          {msgs.length <= 1 && !locked && <div className="flex gap-1.5 bg-paper-2 px-3 pt-2.5"><button type="button" onClick={() => ask('안녕하세요')} className="rounded-full border border-line bg-paper px-3 py-1.5 text-[12.5px] text-ink-2 hover:border-accent hover:text-accent">안녕하세요</button></div>}
          <form className="flex gap-2 border-t border-line-2 bg-paper px-3 py-2.5" onSubmit={(e) => { e.preventDefault(); ask(input) }}>
            <input ref={inRef} value={input} onChange={(e) => setInput(e.target.value)} disabled={!!locked} placeholder={locked || '메시지 보내기'} maxLength={600} autoComplete="off" className="flex-1 rounded-xl border border-line bg-paper px-3 py-2 text-[14.5px] outline-none focus:border-accent disabled:bg-paper-2 disabled:text-ink-3" />
            <button type="submit" disabled={busy || !!locked} className="rounded-xl bg-accent px-4 py-2 text-[14px] font-semibold text-white disabled:opacity-45">전송</button>
          </form>
        </div>
      )}
    </>
  )
}
