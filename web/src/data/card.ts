/** 타임라인 미리보기 카드: 기관·학회 로고, 개요(두 줄), 역할(한 줄), 성과(한 줄) */
export type Card = { logos: string[]; what: string; role: string; result: string }

export const CARD: Record<string, Card> = {
  'pub-kcc': { logos: ['kiise.png'], what: '학부연구생 시절의 첫 논문. AI-HUB 에세이 5만여 편으로 KoBERT 기반 자동 채점기를 만들고, 글의 Topic·Type 정보를 삽입하는 데이터 증강을 제안.', role: '1저자 · 데이터 증강 설계와 채점 모델 실험 전체', result: 'KCC 2023 포스터 발표' },
  'proj-aihub': { logos: ['nia.png', 'aihub.png'], what: '전문어·일상어 20억 어절 말뭉치를 구축하고 LLaMA 기반 13B·33B·65B 한국어 모델을 공개한 국책 과제. 인하대는 일상어 8.6억 어절 파트 담당.', role: '참여 연구원 · 일상어 데이터 수집·증강 파이프라인 구축과 품질 검증', result: 'AI-Hub 데이터 개방' },
  'proj-hscode': { logos: ['inha.png'], what: '3인 캡스톤 프로젝트. 수출 기업과 포워딩 기업을 연결하는 모바일 매칭 앱 InhaTrade로, 통관용 HSCODE 11,000여 개 중 알맞은 코드를 AI로 추천하고 4개 언어를 지원.', role: 'AI/ML · 다국어 담당 · Sentence-Transformers 유사도 추천, DeepL 번역 연동', result: 'HSCODE 추천 기능과 4개 언어 지원 구현' },
  'pub-hclt': { logos: ['sighclt.png'], what: '에세이 데이터의 품질과 다양성을 높이기 위한 세 가지 데이터 증강법(MLM, T5, Random Masking)을 비교한 연구.', role: '1저자 · 데이터 증강·전처리 설계와 실험 전체', result: 'HCLT 2023 구두 발표' },
  'proj-lh': { logos: ['kait.svg', 'msit.svg', 'rebellions.svg'], what: '4인 팀 프로젝트. 사용자 조건에 맞는 청약 공고를 추천하고 20페이지가 넘는 공고문 내용을 RAG로 답하는 24시간 상담 챗봇.', role: 'RAG 검색 시스템 구축 · 소형 LLM(EEVE-10.8B) 파인튜닝', result: 'sLLM/sLM 분야 우수상' },
  'pub-ukta': { logos: ['acm.svg'], what: '형태소 분석부터 작문 평가까지 세 층을 한 곳에서 제공하는 한국어 최초의 통합 텍스트 분석기.', role: '공동 1저자 · 294개 언어 자질을 결합한 딥러닝 채점 모델 개발', result: 'ACM SAC 2025 게재 · 구두 발표' },
  'proj-ukta-proj': { logos: ['nrf.svg'], what: '국어교육학과·KDD 연구실과 협업한 정부과제. 설명 가능한 텍스트 분석·글쓰기 평가 도구 개발.', role: 'AI 모델링 · 딥러닝 채점 모델 성능 고도화', result: '국제학회 논문 2건 게재' },
  'proj-oem': { logos: ['upflow.png'], what: '화장품 OEM/ODM 공장용 AI SaaS형 ERP. 형식이 제각각인 의뢰서를 LLM으로 표준 의뢰서로 바꾸고, 내부 데이터와 5개국 성분 규제를 RAG로 통합 검색.', role: 'AI 개발 총괄 · LLM 문서 구조화 추출과 RAG 검색 파이프라인 설계·구현', result: 'MVP 구축 · 예비창업패키지 1차 통과' },
  'pub-kaes': { logos: ['cup.png'], what: '한국어 특성을 반영한 두 가지 증강(CHEF, RMI)과 주제 인식 전처리를 KoBERT-GRU 채점기에 적용하고 통계 검정으로 검증한 연구.', role: '1저자 · 데이터 증강 기법 제안, 실험과 통계 검증 전체', result: 'SCI(E) 저널 심사 중' },
  'pub-feak': { logos: ['acm.svg'], what: '정량 진단은 전용 모델이, 설명은 LLM이 맡도록 제약해 환각 없는 작문 피드백을 만드는 도구.', role: '2저자 · 딥러닝 채점(진단) 모델 담당', result: 'ACM SAC 2026 게재' },
  'proj-geulgyeol': { logos: [], what: '점수와 함께 피드백과 객관적인 채점 근거를 제시하는 한국어 에세이 채점 Agent. LoRA 채점 모델과 검증 Agent의 결과를 결합.', role: '1인 개발 · 기획, 데이터, 학습, Agent, 추론 서버, 프론트엔드, 배포', result: '웹 서비스 배포' },
  'pub-tkips': { logos: ['kips.png', 'kci.png'], what: '하나의 생성형 LLM이 루브릭별 점수와 피드백을 함께 생성하도록 학습 손실(NTL, SAL)과 추론(Self-Consistency)을 결합한 연구.', role: '1저자 · LLM 학습 손실 설계, 파인튜닝과 실험 전체', result: 'KCI 등재지 게재' },
  'pub-thesis': { logos: ['inha.png'], what: '생성형 LLM 하나로 판별 모델 수준의 정확도와 교육적 피드백을 동시에 달성하기 위해 보조 손실(WNTL, SAL)과 디코딩 전략(ED, SC)을 더한 프레임워크.', role: '단독 저자', result: '석사 학위 취득 · 연구 결과를 KCI 저널 논문과 글결 서비스로 확장' },
}
export const cardOf = (kind: string, id: string): Card | undefined => CARD[`${kind}-${id}`]
