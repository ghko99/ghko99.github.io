import { useEffect, useState } from 'react'

type Row = { when: string; title: string; sub?: string; href?: string; tag?: string; logos?: string[]; inline?: boolean; logosBelow?: boolean }
const Sec = ({ title, rows }: { title: string; rows: Row[] }) => (
  <div className="mb-8">
    <h3 className="mb-1 border-b-2 border-ink pb-2 text-[17px] font-bold tracking-[.02em]">{title}</h3>
    {rows.map((r, i) => (
      <div key={i} className="grid grid-cols-1 gap-x-6 gap-y-1 border-b border-line-2 py-3 last:border-0 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <b className="block text-[15px] font-semibold leading-snug">
            {r.tag && <span className="mr-2 rounded-sm border border-line px-1.5 py-px align-[2px] text-[11px] font-medium text-ink-2">{r.tag}</span>}
            {r.inline && r.logos?.map((l) => <img key={l} src={`/logos/${l}`} alt="" className="mr-2 inline-block h-[18px] w-auto max-w-[120px] object-contain align-[-4px]" loading="lazy" />)}
            {r.href ? <a className="underline decoration-line underline-offset-4 hover:text-accent hover:decoration-accent" href={r.href}>{r.title}</a> : r.title}
          </b>
          {r.inline && r.sub && <span className="mt-0.5 block text-[13px] text-ink-2">{r.sub}</span>}
          {!r.inline && (r.sub || r.logos) && <span className={`mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[13.5px] text-ink-2 ${r.logosBelow ? 'flex-col-reverse items-start' : ''}`}>
            {!!r.logos?.length && <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">{r.logos.map((l) => <img key={l} src={`/logos/${l}`} alt="" className="inline-block h-[18px] w-auto max-w-[150px] object-contain" loading="lazy" />)}</span>}
            {r.sub && <span>{r.sub}</span>}
          </span>}
        </div>
        <em className="whitespace-nowrap pt-0.5 text-[13px] not-italic tabular-nums text-ink-3">{r.when}</em>
      </div>
    ))}
  </div>
)

// 기술: 로고가 있는 것은 아이콘과 함께, 언어모델은 글자로
const TECH: [string, string | [string, string][]][] = [
  ['언어 · 프레임워크', [['Python', 'python.svg'], ['PyTorch', 'pytorch.svg'], ['Hugging Face Transformers', 'huggingface.svg'], ['FastAPI', 'fastapi.svg']]],
  ['LLM 학습 · 서빙', [['PEFT', 'huggingface.svg'], ['Unsloth', 'unsloth.png'], ['LangChain', 'langchain.svg'], ['vLLM', 'vllm.png'], ['Ollama', 'ollama.svg'], ['OpenAI API', 'openai.svg']]],
  ['데이터', [['Pandas', 'pandas.svg'], ['Dask', 'dask.svg'], ['NumPy', 'numpy.svg'], ['scikit-learn', 'scikitlearn.svg']]],
  ['인프라 · 도구', [['Docker', 'docker.svg'], ['Linux', 'linux.svg'], ['Git', 'git.svg'], ['Anaconda', 'anaconda.svg'], ['VS Code', 'visualstudiocode.svg'], ['Claude Code', 'claude.svg']]],
]

const load = () => { try { return localStorage.getItem('cvopen') !== '0' } catch { return true } }

export default function CV() {
  const [open, setOpen] = useState(load)
  useEffect(() => { try { localStorage.setItem('cvopen', open ? '1' : '0') } catch { /* ignore */ } }, [open])
  return (
    <section id="cv" className="border-t border-line-2 py-12 sm:py-16">
      <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
        <div className="mb-7 flex items-baseline justify-between gap-4">
          <h2 className="text-[26px] font-bold tracking-tight sm:text-[30px]">이력</h2>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="cvbody" className="rounded-full border border-line px-3 py-1 text-[12.5px] text-ink-3 hover:border-ink-3 hover:text-ink">{open ? '접기' : '펼치기'}</button>
          </div>
        </div>
        <div id="cvbody" hidden={!open}>
        <Sec title="학력" rows={[
          { when: '2024.09 – 2026.08', title: '인하대학교 대학원 전기컴퓨터공학과 · 인공지능 전공', logos: ['inha.png'], sub: '공학석사 · 금융인공지능(AIF) 연구실 · 지도교수 김도국 · 학점 4.38 / 4.5' },
          { when: '2018.03 – 2024.02', title: '인하대학교 컴퓨터공학과', logos: ['inha.png'], sub: '공학사 · 우수 졸업 · 학점 4.15 / 4.5 (전공 4.23) · 졸업 석차 13 / 138' },
        ]} />
        <Sec title="논문" rows={[
          { when: '2026.05', tag: '국내저널', href: '#/p/pub/tkips', logos: ['kips.png', 'kci.png'], title: '다중 목적 학습과 Self-Consistency를 활용한 생성형 LLM의 자동 에세이 채점 성능 최적화', sub: '정보처리학회논문지 (TKIPS) 15(5) · 1저자' },
          { when: '2026.03', tag: '국제학회', href: '#/p/pub/feak', logos: ['acm.svg'], title: 'From Evaluation to Feedback: A Feature-Based and LLM-Constrained Tool for Korean Writing', sub: 'ACM SAC 2026 · Thessaloniki, Greece · 2저자' },
          { when: '2025.03', tag: '국제학회', href: '#/p/pub/ukta', logos: ['acm.svg'], title: 'UKTA: Unified Korean Text Analyzer', sub: 'ACM SAC 2025 · Catania, Italy · 공동 1저자 · 구두 발표' },
          { when: '2023.10', tag: '국내학회', href: '#/p/pub/hclt', logos: ['sighclt.png'], title: '에세이 자동 평가 모델 성능 향상을 위한 데이터 증강과 전처리', sub: 'HCLT 2023 한글 및 한국어 정보처리 학술대회 · 1저자 · 구두 발표' },
          { when: '2023.06', tag: '국내학회', href: '#/p/pub/kcc', logos: ['kiise.png'], title: '데이터 증강을 이용한 KoBERT 기반 에세이 자동 평가 성능 향상', sub: 'KCC 2023 한국컴퓨터종합학술대회 · 1저자 · 포스터' },
          { when: '2025.06 –', tag: '심사중', href: '#/p/pub/kaes', logos: ['cup.png'], title: 'Enhancing Korean Automated Essay Scoring via Linguistically Informed Augmentation and Topic-Aware Preprocessing', sub: 'Natural Language Processing · SCI(E) · 1저자 · R1 수정본 제출' },
        ]} />
        <Sec title="참여 과제" rows={[
          { when: '2026.03 – 2026.09', title: '딥러닝 기반 모호성 분석 및 비식별화 모듈 개발', sub: 'YM-나을텍 용역과제 · 참여 연구원 · 법률·판결문 LLM 파인튜닝과 학습 데이터 전처리, 민감 속성 정의와 비식별화 모듈' },
          { when: '2025.07 – 2025.12', title: '실험실 특화형 창업선도대학 단독형 2기 (인하대학교)', logos: ['compa.svg'], sub: '참여 연구원 · 창업팀 Upflow AI 기술 총괄' },
          { when: '2025.07 – 2025.10', title: '산업융합형 멀티모달 생성 인공지능 인재양성', logos: ['iitp.svg'], sub: '참여 연구원 · 보고서 자동 생성 담당' },
          { when: '2025.03 – 2026.02', title: '사용자 중심의 한국어 텍스트 분석 도구(U-KTA) 개발', logos: ['nrf.svg'], sub: '참여 연구원 · 딥러닝 언어모델 성능 고도화 담당 · ACM SAC 2025, 2026' },
          { when: '2023.07 – 2023.12', title: '한국어 성능이 개선된 초거대 AI 언어모델 개발 및 데이터 구축', logos: ['nia.png', 'aihub.png'], sub: '참여 연구원 · 일상어 8.6억 어절 증강·품질 검증 · AI-Hub 개방' },
        ]} />
        <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
          <div>
            <Sec title="자격 · 어학" rows={[
              { when: '2026.08', title: 'ADsP 데이터분석 준전문가', logos: ['kdata.png'], inline: true },
              { when: '2026.08', title: 'AICE Associate', logos: ['kt.svg'], inline: true },
              { when: '2026.08', title: 'TOEIC Speaking IH', logos: ['ybm.svg'], inline: true },
            ]} />
            <Sec title="그 외 활동" rows={[
              { when: '2025.04 –', title: '창업팀 Upflow · AI 기술 총괄', logos: ['upflow.png'], inline: true, sub: '2025 예비창업패키지 1차 지원 통과 · 실험실 특화형 창업선도대학 과제 참여' },
              { when: '2022.12 – 2024.02', title: '금융인공지능(AIF) 연구실 학부연구생', logos: ['aif.png'], inline: true, sub: '한국어 자동 에세이 채점 연구' },
              { when: '2023.04 – 2024.02', title: 'SW 인재양성 · 벤처스타트업 아카데미 1기', logos: ['inha.png'], inline: true, sub: '알고리즘·자료구조 교육 수료' },
              { when: '2022.03 – 2022.06', title: '다학년 연구 프로젝트 · 자율주행 프로젝트', logos: ['inha.png'], inline: true, sub: 'ERP-42 mini 자율주행 차량 프로젝트' },
            ]} />
          </div>
          <div>
            <Sec title="수상" rows={[{ when: '2024.12', title: '제1회 AI 반도체 기술인재 선발대회 우수상 · 전국 91팀 중 2위', logos: ['kait.svg', 'msit.svg', 'rebellions.svg'], logosBelow: true, sub: '한국정보통신진흥협회 회장상 · sLLM/sLM 분야 · 수요기업 리벨리온' }]} />
            <h3 className="mb-1 border-b-2 border-ink pb-2 text-[17px] font-bold tracking-[.02em]">기술</h3>
            <div className="text-[13.5px] text-ink-2">
              {TECH.map(([k, v]) => (
                <div key={k} className="border-b border-line-2 py-2.5 last:border-0">
                  <b className="mb-1 block text-[13px] font-semibold text-ink">{k}</b>
                  {typeof v === 'string' ? v : (
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-0.5">
                      {v.map(([name, logo]) => <span key={name} className="inline-flex items-center gap-1.5"><img src={`/logos/${logo}`} alt="" className="h-[17px] w-[17px] object-contain" loading="lazy" />{name}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
