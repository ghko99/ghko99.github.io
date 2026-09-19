import { PROFILE, img } from '../data'

const BRIEF: [string, string][] = [
  ['연구 분야', '자연어처리 · LLM · Automated Essay Scoring'],
  ['관심 분야', 'Agent · LLM · RAG · 데이터 증강'],
  ['경험', 'LLM 파인튜닝 · RAG · 데이터 엔지니어링 · NPU 추론 서빙'],
  ['강점', '실행력 · 협업 · 책임감 · 성실성'],
]
const FACTS: [string, string][] = [
  ['2편', '국제학회 논문 게재 · ACM SAC 2025, 2026'],
  ['2위', 'AI 반도체 기술인재 선발대회 · 전국 91팀'],
  ['Upflow', '실험실 창업팀 · AI 기술 총괄'],
  ['13 / 138', '학사 졸업 석차 · 학점 4.15, 석사 4.38'],
  ['5건', 'AI · LLM 국책·산학 과제 참여'],
]

export default function Hero() {
  return (
    <header id="top" className="py-12 sm:py-20">
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-8 px-5 sm:px-8 md:grid-cols-[minmax(220px,340px)_1fr] md:gap-16">
        <img src={img('profile')} alt="고강희" className="block w-full max-w-[240px] rounded-md border border-line md:max-w-none" />
        <div>
          <div className="mb-3 text-[13px] text-ink-3">인하대학교 대학원 인공지능 전공 · 공학석사</div>
          <h1 className="text-[36px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[44px]">
            {PROFILE.name}<span className="ml-3 text-[0.4em] font-normal tracking-normal text-ink-3">{PROFILE.en}</span>
          </h1>
          <p className="mt-3 text-[18px] font-medium tracking-tight text-ink-2">NLP · LLM · 인공지능 석사 신입</p>
          <dl className="mt-5 grid max-w-[60ch] grid-cols-[max-content_1fr] gap-x-5 gap-y-2 text-[14.5px] leading-relaxed">
            {BRIEF.map(([k, v]) => (
              <div key={k} className="contents"><dt className="text-[13px] text-ink-3">{k}</dt><dd className="text-ink-2">{v}</dd></div>
            ))}
          </dl>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-[14px] text-ink-2">
            <a className="underline decoration-line underline-offset-4 hover:text-accent hover:decoration-accent" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            <a className="underline decoration-line underline-offset-4 hover:text-accent hover:decoration-accent" href={PROFILE.github} target="_blank" rel="noopener">GitHub</a>
            <a className="underline decoration-line underline-offset-4 hover:text-accent hover:decoration-accent" href={PROFILE.blog} target="_blank" rel="noopener">Blog</a>
            <a className="underline decoration-line underline-offset-4 hover:text-accent hover:decoration-accent" href={PROFILE.orcid} target="_blank" rel="noopener">ORCID</a>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-2 border-t border-line pt-5">
            {FACTS.map(([n, l]) => (
              <div key={n} className="text-[13px] text-ink-3"><b className="block text-[20px] font-semibold leading-tight tracking-tight text-ink">{n}</b>{l}</div>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
