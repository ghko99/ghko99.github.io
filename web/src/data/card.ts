import { T } from '../i18n'

/** 타임라인 미리보기 카드: 기관·학회 로고, 개요(두 줄), 역할(한 줄), 성과(한 줄) */
export type Card = { logos: string[]; what: string; role: string; result: string }

const CARD = (): Record<string, Card> => ({
  'pub-kcc': {
    logos: ['kiise.png'],
    what: T('학부연구생 시절의 첫 논문. AI-HUB 에세이 5만여 편으로 KoBERT 기반 자동 채점기를 만들고, 글의 Topic·Type 정보를 삽입하는 데이터 증강을 제안.', 'First paper, written as an undergraduate researcher. Built a KoBERT-based essay scorer on about 50,000 AI-HUB essays and proposed a data augmentation that injects each essay’s topic and type.'),
    role: T('1저자 · 데이터 증강 설계와 실험 전체', 'First author · designed the augmentation and ran every experiment'),
    result: T('KCC 2023 포스터 발표', 'Poster presentation at KCC 2023'),
  },
  'proj-aihub': {
    logos: ['nia.png', 'aihub.png'],
    what: T('전문어·일상어 20억 어절 말뭉치를 구축하고 LLaMA 기반 13B·33B·65B 한국어 모델을 공개한 국책 과제. 인하대는 일상어 8.6억 어절 파트 담당.', 'A government project that built a 2-billion-word Korean corpus of technical and everyday language and released LLaMA-based 13B, 33B and 65B models. Inha University covered the 860-million-word everyday-language part.'),
    role: T('참여 연구원 · 일상어 데이터 수집·증강 파이프라인 구축과 품질 검증', 'Researcher · built the collection and augmentation pipeline for everyday language and validated its quality'),
    result: T('AI-Hub 데이터 개방', 'Dataset released on AI-Hub'),
  },
  'proj-hscode': {
    logos: ['inha.png'],
    what: T('3인 캡스톤 프로젝트. 수출 기업과 포워딩 기업을 연결하는 모바일 매칭 앱 InhaTrade로, 통관용 HSCODE 11,000여 개 중 알맞은 코드를 AI로 추천하고 4개 언어를 지원.', 'Three-person capstone project. InhaTrade is a mobile app matching exporters with forwarding companies; it recommends the right code among more than 11,000 customs HS codes and supports four languages.'),
    role: T('AI/ML · 다국어 담당 · Sentence-Transformers 유사도 추천, DeepL 번역 연동', 'AI/ML and localization · similarity-based recommendation with Sentence-Transformers, DeepL translation'),
    result: T('HSCODE 추천 기능과 4개 언어 지원 구현', 'Shipped the HS code recommender with four-language support'),
  },
  'pub-hclt': {
    logos: ['sighclt.png'],
    what: T('에세이 데이터의 품질과 다양성을 높이기 위한 세 가지 데이터 증강법(MLM, T5, Random Masking)을 비교한 연구.', 'A study comparing three data augmentation methods (MLM, T5 paraphrasing and random masking) for improving the quality and diversity of essay data.'),
    role: T('1저자 · 데이터 증강·전처리 설계와 실험 전체', 'First author · designed the augmentation and preprocessing and ran every experiment'),
    result: T('HCLT 2023 구두 발표', 'Oral presentation at HCLT 2023'),
  },
  'proj-lh': {
    logos: ['kait.svg', 'msit.svg', 'rebellions.svg'],
    what: T('4인 팀 프로젝트. 사용자 조건에 맞는 청약 공고를 추천하고 20페이지가 넘는 공고문 내용을 RAG로 답하는 24시간 상담 챗봇.', 'Four-person team project. A round-the-clock chatbot that recommends public housing subscription notices matching a user’s conditions and answers questions about the 20-plus-page notices with RAG.'),
    role: T('RAG 검색 시스템 구축 · 소형 LLM(EEVE-10.8B) 파인튜닝', 'Built the RAG retrieval system · fine-tuned a small LLM (EEVE-10.8B)'),
    result: T('sLLM/sLM 분야 우수상', 'Excellence Award in the sLLM/sLM track'),
  },
  'pub-ukta': {
    logos: ['acm.svg'],
    what: T('형태소 분석부터 작문 평가까지 세 층을 한 곳에서 제공하는 한국어 최초의 통합 텍스트 분석기.', 'The first unified Korean text analyzer to cover three layers in one place, from morphological analysis to writing assessment.'),
    role: T('공동 1저자 · 294개 언어 자질을 결합한 딥러닝 채점 모델 개발', 'Co-first author · built the deep learning scorer that combines 294 linguistic features'),
    result: T('ACM SAC 2025 게재 · 구두 발표', 'Published at ACM SAC 2025 · oral presentation'),
  },
  'proj-ukta-proj': {
    logos: ['nrf.svg'],
    what: T('국어교육학과·KDD 연구실과 협업한 정부과제. 설명 가능한 텍스트 분석·글쓰기 평가 도구 개발.', 'A government-funded project with the Korean Language Education department and the KDD Lab, building an explainable text analysis and writing assessment tool.'),
    role: T('딥러닝 언어모델 성능 고도화 담당', 'Improved the performance of the deep learning language model'),
    result: T('국제학회 논문 2건 게재', 'Two international conference papers published'),
  },
  'proj-oem': {
    logos: ['upflow.png'],
    what: T('화장품 OEM/ODM 공장용 AI SaaS형 ERP. 형식이 제각각인 의뢰서를 LLM으로 표준 의뢰서로 바꾸고, 내부 데이터와 5개국 성분 규제를 RAG로 통합 검색.', 'An AI SaaS-style ERP for cosmetics OEM/ODM factories. An LLM converts request forms of every shape into one standard form, and RAG searches internal records together with ingredient regulations from five countries.'),
    role: T('AI 개발 총괄 · LLM 문서 구조화 추출과 RAG 검색 파이프라인 설계·구현', 'Head of AI · designed and built the LLM extraction and RAG retrieval pipeline'),
    result: T('MVP 구축 · 예비창업패키지 1차 통과', 'MVP shipped · passed the first round of the Pre-Startup Package'),
  },
  'pub-kaes': {
    logos: ['cup.png'],
    what: T('한국어 특성을 반영한 두 가지 증강(CHEF, RMI)과 주제 인식 전처리를 KoBERT-GRU 채점기에 적용하고 통계 검정으로 검증한 연구.', 'A study applying two Korean-specific augmentations (CHEF and RMI) and topic-aware preprocessing to a KoBERT-GRU scorer, with statistical tests to verify the gains.'),
    role: T('1저자 · 데이터 증강 기법 제안, 실험과 통계 검증 전체', 'First author · proposed the augmentation methods and ran all experiments and statistical validation'),
    result: T('SCI(E) 저널 심사 중', 'Under review at an SCI(E) journal'),
  },
  'pub-feak': {
    logos: ['acm.svg'],
    what: T('정량 진단은 전용 모델이, 설명은 LLM이 맡도록 제약해 환각 없는 작문 피드백을 만드는 도구.', 'A tool that produces hallucination-free writing feedback by letting a dedicated model do the quantitative diagnosis and constraining the LLM to explain it.'),
    role: T('2저자 · 딥러닝 채점(진단) 모델 담당', 'Second author · responsible for the deep learning scoring (diagnosis) model'),
    result: T('ACM SAC 2026 게재', 'Published at ACM SAC 2026'),
  },
  'proj-geulgyeol': {
    logos: [],
    what: T('점수와 함께 피드백과 객관적인 채점 근거를 제시하는 한국어 에세이 채점 Agent. LoRA 채점 모델과 검증 Agent의 결과를 결합.', 'A Korean essay scoring agent that returns feedback and objective evidence along with the score, combining a LoRA-tuned scorer with a separate verification agent.'),
    role: T('1인 개발 · 기획, 데이터, 학습, Agent, 추론 서버, 프론트엔드, 배포', 'Solo build · planning, data, training, agent, inference server, frontend and deployment'),
    result: T('웹 서비스 배포', 'Deployed as a web service'),
  },
  'pub-tkips': {
    logos: ['kips.png', 'kci.png'],
    what: T('하나의 생성형 LLM이 루브릭별 점수와 피드백을 함께 생성하도록 학습 손실(NTL, SAL)과 추론(Self-Consistency)을 결합한 연구.', 'A study combining training losses (number token loss and semantic alignment loss) with self-consistency decoding so that a single generative LLM produces both rubric scores and feedback.'),
    role: T('1저자 · LLM 학습 손실 설계, 파인튜닝과 실험 전체', 'First author · designed the training losses and ran the fine-tuning and experiments'),
    result: T('KCI 등재지 게재', 'Published in a KCI-indexed journal'),
  },
  'pub-thesis': {
    logos: ['inha.png'],
    what: T('생성형 LLM 하나로 판별 모델 수준의 정확도와 교육적 피드백을 동시에 달성하기 위해 보조 손실(WNTL, SAL)과 디코딩 전략(ED, SC)을 더한 프레임워크.', 'A framework that adds auxiliary losses (weighted number token loss, semantic alignment loss) and decoding strategies (expected-value decoding, self-consistency) so that one generative LLM reaches discriminative-model accuracy while still giving educational feedback.'),
    role: T('단독 저자', 'Sole author'),
    result: T('석사 학위 취득 · 연구 결과를 KCI 저널 논문과 글결 서비스로 확장', 'Master’s degree · extended into a KCI journal paper and the Geulgyeol service'),
  },
})
export const cardOf = (kind: string, id: string): Card | undefined => CARD()[`${kind}-${id}`]
