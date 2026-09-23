import { PROFILE, img } from '../data'
import { T, useLang } from '../i18n'

const BRIEF = (): [string, string][] => [
  [T('연구 분야', 'Research'), T('자연어처리 · LLM · Automated Essay Scoring', 'NLP · LLM · Automated Essay Scoring')],
  [T('관심 분야', 'Interests'), T('Agent · LLM · RAG · 데이터 증강', 'Agents · LLM · RAG · Data Augmentation')],
  [T('경험', 'Experience'), T('LLM 파인튜닝 · RAG · 데이터 엔지니어링 · NPU 추론 서빙', 'LLM fine-tuning · RAG · Data engineering · NPU inference serving')],
]
const FACTS = (): [string, string][] => [
  [T('2편', '2'), T('국제학회 논문 게재 · ACM SAC 2025, 2026', 'International conference papers · ACM SAC 2025, 2026')],
  [T('2위', '2nd'), T('AI 반도체 기술인재 선발대회 · 전국 91팀', 'AI Semiconductor Talent Competition · 91 teams nationwide')],
  ['Upflow', T('실험실 창업팀 · AI 기술 총괄', 'Lab-based startup · Head of AI')],
  ['4.38 / 4.5', T('석사 학점 · 학사 4.15 / 4.5', 'MS GPA · BS 4.15 / 4.5')],
  [T('2건', '2'), T('웹 서비스 배포 · 글결, U-KTA', 'Web services shipped · Geulgyeol, U-KTA')],
  [T('5건', '5'), T('AI · LLM 국책·산학 과제 참여', 'Government and industry AI/LLM projects')],
]

export default function Hero() {
  useLang()
  return (
    <header id="top" className="py-12 sm:py-20">
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-8 px-5 sm:px-8 md:grid-cols-[280px_1fr] md:gap-16">
        {/* 원형 사진: 커서를 올리면 뒤집히며 다른 사진이 나온다 */}
        <div className="flip w-[200px] sm:w-[240px] md:w-[280px]" tabIndex={0} aria-label={T('고강희 사진', 'Photo of Ganghee Go')}>
          <div className="flip-inner aspect-square">
            <img src={img('profile')} alt={T('고강희', 'Ganghee Go')} className="flip-face" />
            <img src="/img/profile2.jpg" alt="" className="flip-face flip-back" loading="lazy" />
          </div>
        </div>
        <div>
          <div className="mb-3 text-[13px] text-ink-3">{T('인하대학교 대학원 인공지능 전공 · 공학석사', 'MS in Artificial Intelligence, Inha University')}</div>
          <h1 className="text-[36px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[44px]">
            {T(PROFILE.name, PROFILE.en)}<span className="ml-3 text-[0.4em] font-normal tracking-normal text-ink-3">{T(PROFILE.en, PROFILE.name)}</span>
          </h1>
          <p className="mt-3 text-[18px] font-medium tracking-tight text-ink-2">{T('NLP · LLM · 인공지능 석사 신입', 'NLP · LLM · AI engineer, MS graduate')}</p>
          <dl className="mt-5 grid max-w-[60ch] grid-cols-[max-content_1fr] gap-x-5 gap-y-2.5 leading-relaxed">
            {BRIEF().map(([k, v]) => (
              <div key={k} className="contents"><dt className="text-[13.5px] font-semibold tracking-wide text-ink-3">{k}</dt><dd className="text-[15px] font-medium text-ink">{v}</dd></div>
            ))}
          </dl>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[14px] text-ink-2">
            {([
              ['mail.svg', PROFILE.email, `mailto:${PROFILE.email}`],
              ['github.svg', 'GitHub', PROFILE.github],
              ['velog.svg', 'Blog', PROFILE.blog],
            ] as [string, string, string][]).map(([icon, label, href]) => (
              <a key={label} className="inline-flex items-center gap-1.5 hover:text-accent" href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener">
                <img src={`/logos/${icon}`} alt="" className="h-[16px] w-[16px] object-contain" />{label}
              </a>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-2 border-t border-line pt-5">
            {FACTS().map(([n, l]) => (
              <div key={n} className="text-[13px] text-ink-3"><b className="block text-[20px] font-semibold leading-tight tracking-tight text-ink">{n}</b>{l}</div>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
