// build-index.mjs가 생성. 프로젝트 목록과 연결 저장소.
export const REGISTRY = [
 {
  "id": "pub-kaes",
  "kind": "pub",
  "name": "Enhancing Korean Automated Essay Scoring via Linguistically Informed Augmentation and Topic-Aware Preprocessing",
  "ko": "",
  "when": "2025 – 2026",
  "url": "https://ghko99.github.io/#pub-kaes",
  "summary": "한국어 자동 에세이 채점은 라벨 데이터가 적고 형태론이 복잡하다는 두 가지 벽에 부딪힙니다.",
  "repos": [
   {
    "name": "Korean-Text-Data-Augmentation",
    "branch": "master"
   }
  ],
  "pdf": "https://ghko99.github.io/papers/pub-kaes.pdf"
 },
 {
  "id": "pub-tkips",
  "kind": "pub",
  "name": "다중 목적 학습과 Self-Consistency를 활용한 생성형 LLM의 자동 에세이 채점 성능 최적화",
  "ko": "Optimizing Automated Essay Scoring Performance of Generative LLMs Using Multi-objective Learning and Self-Consistency",
  "when": "2026.05",
  "url": "https://ghko99.github.io/#pub-tkips",
  "summary": "기존 채점 모델은 점수는 잘 맞히지만 피드백을 만들지 못하고, 생성형 LLM은 점수를 텍스트 토큰 으로 다루기 때문에 점수 사이의 순서와 거리를 배우지 못하며 실행할 때마다 결과가 달라집니다.",
  "repos": [
   {
    "name": "lora-self-consistency-aes",
    "branch": "main"
   }
  ],
  "pdf": "https://ghko99.github.io/papers/pub-tkips.pdf"
 },
 {
  "id": "pub-feak",
  "kind": "pub",
  "name": "From Evaluation to Feedback: A Feature-Based and LLM-Constrained Tool for Korean Writing Assessment",
  "ko": "",
  "when": "2026.03",
  "url": "https://ghko99.github.io/#pub-feak",
  "summary": "기존 자동 평가는 점수는 정확하지만 무엇을 고쳐야 하는지 말해주지 못하고, 범용 LLM은 설명은 유창하지만 환각과 정보 과부하가 따릅니다.",
  "repos": [],
  "pdf": "https://ghko99.github.io/papers/pub-feak.pdf"
 },
 {
  "id": "pub-ukta",
  "kind": "pub",
  "name": "UKTA: Unified Korean Text Analyzer",
  "ko": "",
  "when": "2025.03",
  "url": "https://ghko99.github.io/#pub-ukta",
  "summary": "기존 한국어 작문 평가 도구는 한 가지 관점만 보고, 앞 단계의 오류가 뒤로 전파되며, 왜 그 점수인지 설명하지 못했습니다.",
  "repos": [
   {
    "name": "aes-ukta-exp",
    "branch": "main"
   }
  ],
  "pdf": "https://ghko99.github.io/papers/pub-ukta.pdf"
 },
 {
  "id": "pub-hclt",
  "kind": "pub",
  "name": "에세이 자동 평가 모델 성능 향상을 위한 데이터 증강과 전처리",
  "ko": "",
  "when": "2023.10",
  "url": "https://ghko99.github.io/#pub-hclt",
  "summary": "KCC 2023에서 주제 정보가 채점에 도움이 된다는 것을 확인한 뒤, 데이터의 품질과 다양성 자체를 높이는 방법을 찾았습니다.",
  "repos": [
   {
    "name": "Korean-Text-Data-Augmentation",
    "branch": "master"
   }
  ],
  "pdf": "https://ghko99.github.io/papers/pub-hclt.pdf"
 },
 {
  "id": "pub-kcc",
  "kind": "pub",
  "name": "데이터 증강을 이용한 KoBERT 기반 에세이 자동 평가 성능 향상",
  "ko": "",
  "when": "2023.06",
  "url": "https://ghko99.github.io/#pub-kcc",
  "summary": "사람은 글 전체의 주제와 내부 요소의 관계를 보고 점수를 주지만, 당시의 국내 AES 모델은 어휘와 문법만 보았습니다.",
  "repos": [
   {
    "name": "aes_data_augment",
    "branch": "master"
   }
  ],
  "pdf": "https://ghko99.github.io/papers/pub-kcc.pdf"
 },
 {
  "id": "pub-thesis",
  "kind": "pub",
  "name": "생성형 대규모 언어모델 기반 한국어 자동 에세이 채점 성능 개선 연구",
  "ko": "",
  "when": "2026.08",
  "url": "https://ghko99.github.io/#pub-thesis",
  "summary": "판별 모델은 점수만 내고, 생성형 LLM은 점수와 피드백을 함께 내지만 정확도와 재현성이 낮습니다.",
  "repos": [
   {
    "name": "essay-agent",
    "branch": "main"
   },
   {
    "name": "aes-llm-training",
    "branch": "main"
   },
   {
    "name": "essay_scoring_llm",
    "branch": "main"
   },
   {
    "name": "kanana-wntl-14all-strategy-comparison",
    "branch": "main"
   }
  ]
 },
 {
  "id": "proj-geulgyeol",
  "kind": "proj",
  "name": "글결",
  "ko": "근거 기반 한국어 에세이 자동 채점 Agent",
  "when": "2026.03 – 06",
  "url": "https://ghko99.github.io/#proj-geulgyeol",
  "summary": "점수뿐 아니라 피드백과 객관적인 채점 근거 를 함께 제시하는 LLM Agent입니다.",
  "repos": [
   {
    "name": "essay-agent",
    "branch": "main"
   },
   {
    "name": "essay_scoring_llm",
    "branch": "main"
   }
  ]
 },
 {
  "id": "proj-lh",
  "kind": "proj",
  "name": "LH 청약 추천 및 챗봇",
  "ko": "제1회 AI반도체 기술인재 선발대회 · sLLM/sLM 분야 · 수요기업 리벨리온",
  "when": "2024.08 – 12",
  "url": "https://ghko99.github.io/#proj-lh",
  "summary": "청약 통장 가입자는 늘고 있지만 청약 절차와 20페이지가 넘는 공고문은 이해하기 어렵습니다.",
  "repos": [
   {
    "name": "aichipcon_AIF_sLLM",
    "branch": "main"
   }
  ]
 },
 {
  "id": "proj-ukta-proj",
  "kind": "proj",
  "name": "U-KTA",
  "ko": "사용자 중심의 한국어 텍스트 분석 및 설명 가능한 글쓰기 평가 도구",
  "when": "2024.09 – 2026.05",
  "url": "https://ghko99.github.io/#proj-ukta-proj",
  "summary": "교사 한 명이 맡는 학생이 많아 개별 피드백은 물리적으로 어렵고, 기존 AI 채점은 근거가 없는 데다 QWK 0.5 미만이며 학습한 주제에서만 작동합니다.",
  "repos": [
   {
    "name": "aes-ukta-exp",
    "branch": "main"
   }
  ]
 },
 {
  "id": "proj-oem",
  "kind": "proj",
  "name": "화장품 OEM 통합 관리 플랫폼",
  "ko": "LLM으로 비정형 의뢰를 표준 의뢰서로, 규제 정보를 RAG로",
  "when": "2025.04 – 12",
  "url": "https://ghko99.github.io/#proj-oem",
  "summary": "화장품 OEM/ODM 공장에는 손글씨, 엑셀, 한글, PDF 등 형식이 제각각인 의뢰서가 들어오고, 실무자는 이를 매번 옮겨 적어야 합니다.",
  "repos": [
   {
    "name": "cosmetics-oem-erp-prototype",
    "branch": "main"
   }
  ]
 },
 {
  "id": "proj-aihub",
  "kind": "proj",
  "name": "한국어 성능이 개선된 초거대 AI 언어모델 데이터 구축",
  "ko": "20억 어절 말뭉치 · LLaMA 기반 13B/33B/65B 공개",
  "when": "2023.07 – 12",
  "url": "https://ghko99.github.io/#proj-aihub",
  "summary": "기존에 공개된 한국어 데이터는 뉴스와 댓글에 치우쳐 있었고, 고성능 모델과 데이터는 비공개인 경우가 많았습니다.",
  "repos": [
   {
    "name": "Korean-Text-Data-Augmentation",
    "branch": "master"
   }
  ]
 },
 {
  "id": "proj-hscode",
  "kind": "proj",
  "name": "HSCODE 자동 추천 시스템",
  "ko": "디지털 포워딩 기업 매칭 앱 InhaTrade",
  "when": "2023.09 – 12",
  "url": "https://ghko99.github.io/#proj-hscode",
  "summary": "수출 기업과 포워딩 기업을 연결하는 모바일 매칭 플랫폼입니다.",
  "repos": [
   {
    "name": "Hscode",
    "branch": "master"
   }
  ]
 }
];
