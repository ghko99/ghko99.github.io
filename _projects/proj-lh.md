---
layout: page
title: "제1회 AI반도체 기술인재 선발대회 · sLLM/sLM 분야 · 수요기업 리벨리온"
description: "리벨리온 NPU에서 돌아가는 EEVE-10.8B RAG 챗봇입니다. 검색 최적화와 LoRA로 RAGAS 평균을 0.611에서 0.705로 올렸습니다."
img: assets/img/pf/lg1_recommend.jpg
importance: 95
category: 프로젝트
github: https://github.com/ghko99/aichipcon_AIF_sLLM
permalink: /projects/proj-lh/
---

<div class="pf-meta"><span class="pf-kind">프로젝트</span> <b>2024.08 – 12</b> · 4인 팀 AIF · RAG 시스템 · sLLM Fine-tuning 담당 · 우수상 · 91팀 중 2위<br>팀 AIF — 신광훈(데이터 증강·전처리) · 박진감(기획·웹 풀스택) · 권태형(데이터 수집·API·vLLM 서빙) · 고강희(RAG 시스템·sLLM Fine-tuning) · 2024.09 – 11</div>
<p class="pf-sub">LH 청약 추천 및 챗봇</p>
<p class="pf-links"><a class="btn btn-sm z-depth-0" href="https://github.com/ghko99/aichipcon_AIF_sLLM" target="_blank" rel="noopener">GitHub</a> <a class="btn btn-sm z-depth-0" href="https://www.aichipcon.or.kr/" target="_blank" rel="noopener">AI Chip 플랫폼X</a></p>
<p class="pf-tags"><span>EEVE-Korean-10.8B</span> <span>LoRA</span> <span>bge-m3 · FAISS</span> <span>Upstage Document Parse</span> <span>RAGAS</span> <span>Triton · vLLM</span> <span>Rebellions ATOM</span></p>
## 개요

<div class="row"><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/lh_poster.jpg" title="제1회 AI반도체 기술인재 선발대회" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">제1회 AI반도체 기술인재 선발대회</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/award_full.jpg" title="우수상 — sLLM/sLM 분야, 팀 AIF · 2024.12.20" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">우수상 — sLLM/sLM 분야, 팀 AIF · 2024.12.20</div></div></div>

<div class="pf-intro"><p>청약 통장 가입자는 늘고 있지만 청약 절차와 20페이지가 넘는 공고문은 이해하기 어렵습니다. 사용자 조건에 맞는 공고문을 추천하고 공고 내용을 RAG로 답해주는 24시간 상담 챗봇을 만들었으며, 리벨리온 NPU에서 돌아가는 경량 LLM으로 외부 API 없이 운영했습니다.</p></div>

## 문제 해결 과정

<ol class="pf-steps"><li><a href="#step-1">모델 선정</a></li><li><a href="#step-2">공고문 청킹</a></li><li><a href="#step-3">하이브리드 검색</a></li><li><a href="#step-4">데이터 구축과 증강</a></li><li><a href="#step-5">LoRA 파인튜닝</a></li><li><a href="#step-6">NPU 서빙</a></li><li><a href="#step-7">서비스</a></li><li><a href="#step-8">평가와 성과</a></li></ol>

<h3 id="step-1"><span class="pf-num">1</span> 모델 선정</h3>

<div class="pf-q"><h4>고민</h4><ul><li>리벨리온 NPU에서 돌아가는 경량 모델(solar, llama 계열) 가운데, 청약이라는 금융 분야의 한국어를 가장 잘 다루는 모델은 무엇일까?</li><li>파인튜닝 자원이 제한된 상황에서는 처음에 고른 모델이 최종 품질을 좌우하지 않을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>Horangi 한국어 LLM 리더보드와 Allganize 금융 LLM 리더보드를 분석했습니다.</li><li>EEVE-Korean-Instruct-10.8B가 한국어 과제에서 GPT-3.5 Turbo보다 우수하고 NPU에서 실행 가능해 선정했습니다.</li></ul></div>

<div class="row"><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/l1_leaderboard1.jpg" title="Horangi 한국어 LLM 리더보드" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">Horangi 한국어 LLM 리더보드</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/l2_leaderboard2.jpg" title="Allganize 금융 LLM 리더보드" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">Allganize 금융 LLM 리더보드</div></div></div>

<h3 id="step-2"><span class="pf-num">2</span> 공고문 청킹</h3>

<div class="pf-q"><h4>고민</h4><ul><li>표와 글이 섞인 PDF 공고문을 어떻게 읽고 나누어야 내용이 끊기지 않을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>문서 파서(Upstage Document Parse)로 단락, 문장, 제목 단위(Element)로 나누었습니다.</li><li>각 조각에 소속 제목을 붙여 문맥을 보존했고, 제목과 조각의 쌍을 검색 단위로 삼았습니다.</li></ul></div>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/l3_chunking.jpg" title="Element 단위 청킹과 제목 태깅" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">Element 단위 청킹과 제목 태깅</div></div></div>

<h3 id="step-3"><span class="pf-num">3</span> 하이브리드 검색</h3>

<div class="pf-q"><h4>고민</h4><ul><li>검색 정확도가 낮아 질문과 무관한 조각이 섞입니다. 무엇을 기준으로 걸러야 할까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>단어 일치 점수(BM25), 제목 유사도, 본문 유사도 세 가지를 합쳐 검색했습니다.</li><li>질문–문맥–답 데이터로 가중치를 1:1:1에서 <b>0.1 : 0.2 : 0.7</b>로 조정했습니다.</li><li>검색 점수가 0.77보다 낮은 조각은 제외해 관련 없는 내용을 걸러냈습니다.</li></ul></div>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>RAGAS Context Precision</td><td class="pv">0.663</td><td class="rs">0.848</td><td class="nt"></td></tr></tbody></table>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/lg3_retrieval.jpg" title="하이브리드 검색 구조" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">하이브리드 검색 구조</div></div></div>

<h3 id="step-4"><span class="pf-num">4</span> 데이터 구축과 증강</h3>

<div class="pf-q"><h4>고민</h4><ul><li>주택 청약 분야의 학습 데이터가 없습니다. 초기 모델은 없는 사실을 지어내고 답이 지나치게 깁니다.</li><li>학습 데이터를 어떻게 만들까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>청약 FAQ와 국토교통부 질의응답 500건을 모으고, GPT-4로 공고문 기반의 질문–문맥–답 데이터를 생성했습니다. 2,200만 어절을 수집해 전처리 후 2,000만 어절을 확보했습니다.</li><li>역번역(GPT, DeepL) 4배와 규칙 기반 증강 4배로 <b>3억 어절</b>까지 늘렸습니다.</li><li>맞춤법 검사(py-hanspell)와 유사도 기반 중복 제거로 품질을 관리했습니다.</li></ul></div>

<div class="row"><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/lg4_data.jpg" title="데이터 수집" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">데이터 수집</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/lg5_aug.jpg" title="역번역과 규칙 기반 증강" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">역번역과 규칙 기반 증강</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/lg6_quality.jpg" title="품질 검증" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">품질 검증</div></div></div>

<h3 id="step-5"><span class="pf-num">5</span> LoRA 파인튜닝</h3>

<div class="pf-a"><h4>내용</h4><ul><li>A100에서 EEVE-Korean을 LoRA로 1 epoch 학습했습니다.</li></ul></div>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>Faithfulness</td><td class="pv">0.5375</td><td class="rs">0.5825</td><td class="nt"></td></tr><tr><td>Answer Relevancy</td><td class="pv">0.5481</td><td class="rs">0.6780</td><td class="nt"></td></tr></tbody></table>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/lg7_finetune.jpg" title="학습 손실과 검증 손실" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">학습 손실과 검증 손실</div></div></div>

<h3 id="step-6"><span class="pf-num">6</span> NPU 서빙 <small>Triton · 리벨리온 vLLM</small></h3>

<div class="pf-q"><h4>고민</h4><ul><li>많은 사용자가 동시에 접속해도 초당 20건 이상을 안정적으로 처리할 수 있을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>리벨리온 ATOM+ 서버의 Triton Inference Server에 최대 배치 8로 컴파일하고, 비동기 스트리밍을 적용했습니다.</li><li>단일 요청은 24.7 tokens/s, 배치 8에서는 <b>143 tokens/s</b>입니다.</li><li>부하 테스트(Locust)에서 초당 100명씩 늘려 동시접속 <b>6,000명</b>까지 실패율 0%를 유지했습니다.</li></ul></div>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>tokens/s · 단일 요청과 배치 8</td><td class="pv">24.7</td><td class="rs">143.0</td><td class="nt"></td></tr></tbody></table>

<h3 id="step-7"><span class="pf-num">7</span> 서비스</h3>

<div class="pf-a"><h4>내용</h4><ul><li>대화형 설문으로 조건을 받아 공고문을 추천합니다.</li><li>공고문을 보면서 질문하면 답이 실시간(스트리밍)으로 표시됩니다.</li></ul></div>

<div class="row"><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/lg1_survey.jpg" title="조건 입력 — 대화형 설문" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">조건 입력 — 대화형 설문</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/lg1_recommend.jpg" title="개인화된 공고문 추천" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">개인화된 공고문 추천</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/lg2_chat.jpg" title="공고문 Q&amp;A 챗봇" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">공고문 Q&amp;A 챗봇</div></div></div>

<h3 id="step-8"><span class="pf-num">8</span> 평가와 성과</h3>

<div class="pf-a"><h4>내용</h4><ul><li>RAG 품질 지표(RAGAS 4개 평균)가 0.611에서 검색 개선으로 0.661, 파인튜닝으로 <b>0.705</b>까지 올랐습니다.</li><li>Allganize 평가 60문항 중 평균 36.4개를 맞혔습니다. LangChain + gpt-4-turbo 조합(36.6개)과 같은 수준을 외부 API 없이 NPU만으로 달성했습니다.</li><li>제1회 AI반도체 기술인재 선발대회 우수상(91팀 중 <b>2위</b>)을 받았습니다.</li></ul></div>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>RAGAS 평균</td><td class="pv">0.611</td><td class="rs">0.705</td><td class="nt"></td></tr><tr><td>정답 수 (60문항) · gpt-4-turbo는 36.6</td><td class="pv">—</td><td class="rs">36.4</td><td class="nt"></td></tr></tbody></table>

<div class="row"><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/lg8_ragas.jpg" title="단계별 RAGAS" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">단계별 RAGAS</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/lg9_bench.jpg" title="RAG 벤치마크 비교" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">RAG 벤치마크 비교</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/l4_result.jpg" title="최종 결과 정리" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">최종 결과 정리</div></div></div>
