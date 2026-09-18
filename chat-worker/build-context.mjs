// data6.js(포트폴리오 데이터)와 페이지의 EVENTS를 읽어 챗봇 자료 문자열을 만든다.
import { readFileSync, writeFileSync } from "node:fs";
const page = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const js = page.match(/<script>([\s\S]*)<\/script>/)[1]
  .replace(/^const IMG = .*$/m, "const IMG={};")
  .split("/* ---------- detail")[0];
const stub = "const document={getElementById:()=>({innerHTML:\"\",querySelectorAll:()=>[]}),querySelectorAll:()=>[],addEventListener(){}};const IntersectionObserver=class{observe(){}unobserve(){}};const setTimeout=()=>{};const window={addEventListener(){}};const location={hash:\"\"};const history={};";
const { PUBS, PROJECTS, EVENTS } = new Function(stub + js + ";return {PUBS,PROJECTS,EVENTS};")();
const strip = s => String(s || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const node = n => `${n.t}${n.s ? "(" + n.s + ")" : ""}: ${n.q ? "고민 " + strip(n.q) + " " : ""}${n.a ? "해결 " + strip(n.a) : ""}${n.num ? " 수치 " + n.num.map(x => x.l + " " + (x.b ? x.b + "에서 " : "") + x.a).join(", ") : ""}`;
const lines = [
  "이름 고강희(Ganghee Go). 1999.07.09생. 인하대학교 전기컴퓨터공학과 인공지능 전공 석사(2024.09–2026.08, 학점 4.38/4.5), 금융인공지능(AIF) 연구실, 지도교수 김도국. 학부 인하대 컴퓨터공학 우수 졸업(2018.03–2024.02, 평점 4.15/4.5, 전공 4.23, 졸업 석차 13/138). 연수고등학교(2015–2018).",
  "연락: 이메일 khko99@inha.edu, GitHub github.com/ghko99, 블로그 velog.io/@khko99, ORCID 0009-0006-1027-105X. 전화번호는 공개하지 않음.",
  "관심 분야: LLM 기반 AI 서비스 개발과 상용화, 한국어 NLP와 언어모델, 데이터 엔지니어링, 자동 에세이 채점(AES), 텍스트 데이터 증강, RAG, LLM Agent.",
  "수상: 제1회 AI 반도체 기술인재 선발대회 우수상(한국정보통신진흥협회 회장상, 과기정통부, sLLM/sLM 분야, 전국 91팀 중 2위, 2024.12). 자격: ADsP(2026.08), TOEIC Speaking IH 140(2026.08), AICE Associate(2026.08).",
  "참여 과제: YM-나을텍 딥러닝 기반 모호성 분석 및 비식별화 모듈 개발(2026.03–09, 참여 연구원, 법률·판결문 LLM 파인튜닝과 데이터 전처리, 민감 속성 정의, 비식별화 모듈) / 과학기술사업화진흥원 실험실 특화형 창업선도대학 단독형 2기(2025.07–12, 참여 연구원, 창업팀 Upflow AI 기술 총괄) / 정보통신기획평가원 산업융합형 멀티모달 생성 인공지능 인재양성(2025.07–10, 참여 연구원) / 한국연구재단 U-KTA(2025.03–2026.02, 참여 연구원) / 한국지능정보사회진흥원 한국어 초거대 언어모델 데이터 구축(2023.07–12, 참여 연구원).",
  "활동: AIF 연구실 학부연구생(2022.12–2024.02) 후 석사. 실험실 창업팀 Upflow AI 기술 총괄(2025.04–, 공동창업자는 아님, 창업 과제 참여). 인하대 SW 인재양성·벤처스타트업 아카데미 1기(2023.04–2024.02). 다학년 연구 프로젝트(2022).",
  "기술: Python, PyTorch, Hugging Face Transformers, PEFT, FastAPI / LLM 파인튜닝, LoRA·QLoRA, RAG, LangChain, FAISS, vLLM, Ollama, AES, 한국어 NLP / Pandas, NumPy, Dask, scikit-learn, Docker, Git, Linux, Anaconda / OpenAI API, Claude API, W&B, TensorBoard, Triton Inference Server.",
  "포트폴리오 사이트: https://ghko99.github.io (타임라인의 카드를 누르면 각 논문·프로젝트의 문제 해결 과정이 열림).",
  "",
  "## 시간순 요약",
  ...EVENTS.map(e => e.ms ? `${e.d} ${e.ms}` : `${e.d} ${(e.k === "pub" ? PUBS : PROJECTS).find(x => x.id === e.id).t} — ${e.sum}`),
  "",
  "## 논문",
  ...PUBS.map(p => `[${p.t}${p.ko ? " / " + p.ko : ""}] ${p.venue}, ${p.y}, ${p.role || "학위논문"}, 저자 ${p.authors}, 상태 ${p.st}. ${p.meta || ""} 개요: ${strip(p.intro.html)} 문제 해결 과정: ${p.nodes.map(node).join(" | ")} 링크: ${(p.links || []).map(l => l[0] + " " + l[1]).join(", ")}`),
  "",
  "## 프로젝트",
  ...PROJECTS.map(p => `[${p.t}${p.ko ? " — " + p.ko : ""}] ${p.y}, ${p.who}${p.res ? ", 성과: " + p.res : ""}. 기술: ${(p.tags || []).join(", ")}. ${p.meta || ""} 개요: ${strip(p.intro.html)} 문제 해결 과정: ${p.nodes.map(node).join(" | ")} 링크: ${(p.links || []).map(l => l[0] + " " + l[1]).join(", ")}`),
];
const repos = readFileSync(new URL("./src/repos.txt", import.meta.url), "utf8");
lines.push("", "## GitHub 저장소 (github.com/ghko99) — 질문과 관련된 저장소가 있으면 링크를 함께 알려준다",
  "논문·프로젝트와 저장소 연결: KAES 저널 논문/HCLT 2023 → Korean-Text-Data-Augmentation, KCC 2023 → aes_data_augment, TKIPS 논문 → lora-self-consistency-aes, UKTA 논문/U-KTA 과제 → aes-ukta-exp (웹은 ttytu/UKTA-web), FEAK 논문 → yunjinyong730/Advanced_UKTA, 석사논문/글결 → essay-agent, aes-llm-training, essay_scoring_llm, kanana-wntl-14all-strategy-comparison, LH 청약 챗봇 → aichipcon_AIF_sLLM, HSCODE → Hscode, 화장품 OEM → cosmetics-oem-erp-prototype, AI-Hub 데이터 구축 → Korean-Text-Data-Augmentation. YM-나을텍 비식별화 과제와 멀티모달 인재양성 과제는 공개 저장소가 없음.",
  repos);
const text = lines.join("\n");
writeFileSync(new URL("./src/context.js", import.meta.url), "export const CONTEXT = " + JSON.stringify(text) + ";\n");
console.log("context.js written:", text.length, "chars");
