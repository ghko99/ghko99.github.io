---
layout: page
title: "LLM으로 비정형 의뢰를 표준 의뢰서로, 규제 정보를 RAG로"
description: "창업팀 Upflow에서 AI 개발을 총괄했습니다. 비정형 의뢰를 LLM으로 표준 의뢰서로 바꾸고 규제 정보를 RAG로 검색하는 MVP를 완성했습니다."
img: assets/img/pf/oem_p05.jpg
importance: 92
category: 프로젝트
github: https://github.com/ghko99/cosmetics-oem-erp-prototype
permalink: /projects/proj-oem/
---

<div class="pf-meta"><span class="pf-kind">프로젝트</span> <b>2025.04 – 12</b> · 창업팀 Upflow · AI 개발 총괄 · MVP 구축 · 예비창업패키지 1차 통과<br>2025 실험실 특화 창업 선도대학 · 예비창업패키지 · 인공지능 융합 프로젝트 1 · CEO/CTO + 외주 디자이너·개발자 + AIF 연구실 석사 6명</div>
<p class="pf-sub">화장품 OEM 통합 관리 플랫폼</p>
<p class="pf-links"><a class="btn btn-sm z-depth-0" href="https://github.com/ghko99/cosmetics-oem-erp-prototype" target="_blank" rel="noopener">GitHub</a> <a class="btn btn-sm z-depth-0" href="https://upflow.ai.kr/" target="_blank" rel="noopener">upflow.ai.kr</a></p>
<p class="pf-tags"><span>FastAPI</span> <span>LangChain</span> <span>Pydantic</span> <span>GPT-4 · Claude</span> <span>Next.js 15 · React 19</span> <span>PostgreSQL 17</span> <span>Faiss</span> <span>AWS · Docker</span></p>
## 개요

<div class="row"><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/oem_p03.jpg" title="협력 OEM 공장 현장 — BRCOS" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">협력 OEM 공장 현장 — BRCOS</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/oem_p05.jpg" title="프로젝트 목표 — 샘플 개발 의뢰부터 생산까지 의사결정을 보조하는 검색 엔진" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">프로젝트 목표 — 샘플 개발 의뢰부터 생산까지 의사결정을 보조하는 검색 엔진</div></div></div>

<div class="pf-intro"><p>화장품 OEM/ODM 공장에는 손글씨, 엑셀, 한글, PDF 등 형식이 제각각인 의뢰서가 들어오고, 실무자는 이를 매번 옮겨 적어야 합니다. 이 프로젝트는 그 반복 작업을 자동화하는 <b>AI 기반 SaaS형 ERP</b>입니다. LLM이 비정형 의뢰를 표준 의뢰서로 바꾸고, RAG로 내부 데이터와 5개국 성분 규제를 통합 검색합니다.</p></div>

## 문제 해결 과정

<ol class="pf-steps"><li><a href="#step-1">현장의 문제 정의</a></li><li><a href="#step-2">표준 의뢰서 자동 생성 Agent</a></li><li><a href="#step-3">의뢰 챗봇 화면</a></li><li><a href="#step-4">규제 검색 엔진 · 설계 변경</a></li><li><a href="#step-5">규제 데이터베이스와 보고서</a></li><li><a href="#step-6">ERP 관리 화면</a></li><li><a href="#step-7">모델 선정과 비용</a></li><li><a href="#step-8">성과와 다음 단계</a></li></ol>

<h3 id="step-1"><span class="pf-num">1</span> 현장의 문제 정의</h3>

<div class="pf-q"><h4>고민</h4><ul><li>손으로 쓴 의뢰서, 사진, 엑셀, 한글 문서가 뒤섞여 들어옵니다. 이것을 어떻게 하나의 형식으로 만들 수 있을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>공장을 직접 방문해 실제 의뢰서를 확보했습니다.</li><li>첫 과제를 데이터 표준화와 내부 문서 구조화로 정하고, 필수 항목 <b>19개</b>로 이루어진 표준 샘플 개발 의뢰서 양식을 정의했습니다.</li></ul></div>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/oem_p04.jpg" title="현장의 손글씨 의뢰서와 표준 샘플 개발 의뢰서" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">현장의 손글씨 의뢰서와 표준 샘플 개발 의뢰서</div></div></div>

<h3 id="step-2"><span class="pf-num">2</span> 표준 의뢰서 자동 생성 Agent</h3>

<div class="pf-q"><h4>고민</h4><ul><li>LLM의 자유로운 출력을 어떻게 19개 항목이 정확히 채워진 구조화된 데이터로 받을 수 있을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>엑셀, 한글, PDF 입력을 AI 모듈이 읽어 표준 의뢰서 양식으로 바꾸고, 19개 필수 항목을 자동으로 뽑도록 설계했습니다.</li><li>출력 형식을 Pydantic 스키마로 정의하고, LangChain과 OpenAI에 형식 지시를 더해 정해진 구조로만 답하게 했습니다.</li><li>전체 흐름과 프롬프트를 단계별로 설계했습니다.</li></ul></div>

<div class="row"><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/oem_p06.jpg" title="표준 의뢰서 자동 생성 Agent 구조" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">표준 의뢰서 자동 생성 Agent 구조</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/oem_p07.jpg" title="Pydantic 기반 구조화 출력 아키텍처" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">Pydantic 기반 구조화 출력 아키텍처</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/oem_p09.jpg" title="전체 흐름과 프롬프트 엔지니어링" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">전체 흐름과 프롬프트 엔지니어링</div></div></div>

<h3 id="step-3"><span class="pf-num">3</span> 의뢰 챗봇 화면</h3>

<div class="pf-a"><h4>내용</h4><ul><li>대화로 의뢰 내용을 입력하면 오른쪽 폼이 실시간으로 채워지는 화면을 초기 설계부터 테스트 페이지까지 구현했습니다.</li></ul></div>

<div class="row"><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/oem_p08.jpg" title="초기 화면 설계" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">초기 화면 설계</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/oem_p10.jpg" title="테스트 페이지 — 대화와 폼이 함께 채워지는 구조" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">테스트 페이지 — 대화와 폼이 함께 채워지는 구조</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/o1_request.jpg" title="제품 요청 페이지" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">제품 요청 페이지</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/o4_detail.jpg" title="의뢰서 상세 페이지" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">의뢰서 상세 페이지</div></div></div>

<h3 id="step-4"><span class="pf-num">4</span> 규제 검색 엔진 · 설계 변경</h3>

<div class="pf-q"><h4>고민</h4><ul><li>처음에는 MCP로 외부 규제 데이터를 실시간 조회하도록 설계했습니다. 그런데 MCP 함수의 내부 동작을 파악하기 어렵고 수정과 유지보수가 불가능하다면, 이 구조를 계속 가져가야 할까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>초기 MCP 기반 설계를 버렸습니다.</li><li>외부 규제 데이터(식약처, 화장품 원료 성분 DB, EWG 등)를 직접 수집해 내부에서 전처리한 뒤 검색(RAG)하는 구조로 바꿨습니다.</li><li>Faiss 벡터 DB와 LangChain, OpenAI를 결합해 검색 결과를 규제 보고서로 만듭니다.</li></ul></div>

<div class="row"><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/oem_p12.jpg" title="초기 아키텍처 — MCP 기반 설계와 그 문제점" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">초기 아키텍처 — MCP 기반 설계와 그 문제점</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/oem_p13.jpg" title="개선된 아키텍처 — 외부 규제 데이터를 수집·전처리한 뒤 RAG로 검색" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">개선된 아키텍처 — 외부 규제 데이터를 수집·전처리한 뒤 RAG로 검색</div></div></div>

<h3 id="step-5"><span class="pf-num">5</span> 규제 데이터베이스와 보고서</h3>

<div class="pf-a"><h4>내용</h4><ul><li>규제 데이터를 항목별로 전처리해 데이터베이스에 넣었습니다.</li><li>관리자 페이지에서 성분을 검색하면 국가별 규제 현황과 근거가 담긴 글로벌 성분 규제 보고서가 생성됩니다.</li></ul></div>

<div class="row"><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/oem_p14.jpg" title="규제 데이터베이스 전처리와 화면 설계" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">규제 데이터베이스 전처리와 화면 설계</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/oem_p15.jpg" title="초기 기능 구현 — 화장품 성분 규제 보고서" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">초기 기능 구현 — 화장품 성분 규제 보고서</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/oem_p11.jpg" title="관리자 페이지 — 글로벌 성분 규제 보고서 생성" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">관리자 페이지 — 글로벌 성분 규제 보고서 생성</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/o6_regulation.jpg" title="규제 분석 보고서" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">규제 분석 보고서</div></div></div>

<h3 id="step-6"><span class="pf-num">6</span> ERP 관리 화면</h3>

<div class="pf-a"><h4>내용</h4><ul><li>진행 중인 의뢰와 상태를 한눈에 봅니다.</li><li>고객별 과거 의뢰와 생산 이력, 유사 의뢰 사례를 자연어 검색과 벡터 검색으로 찾습니다.</li></ul></div>

<div class="row"><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/o2_dashboard.jpg" title="관리자 대시보드" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">관리자 대시보드</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/o5_history.jpg" title="고객 이력 검색" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">고객 이력 검색</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/o3_similar.jpg" title="유사 의뢰 사례 검색" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">유사 의뢰 사례 검색</div></div></div>

<h3 id="step-7"><span class="pf-num">7</span> 모델 선정과 비용</h3>

<div class="pf-q"><h4>고민</h4><ul><li>비용과 성능이 모두 맞는 모델은 무엇일까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>GPT-4.1, Claude Opus 등 5개 모델을 문맥 이해, 한국어 처리, 도메인 이해 등 5개 지표로 테스트했습니다.</li><li>월 <b>40만 원</b> 이내로 운영할 수 있는 조합을 확정했습니다.</li><li>FastAPI AI 서버와 비즈니스 백엔드를 분리한 마이크로서비스 구조로 설계했습니다.</li></ul></div>

<h3 id="step-8"><span class="pf-num">8</span> 성과와 다음 단계</h3>

<div class="pf-a"><h4>내용</h4><ul><li>3개월의 1단계 기간 안에 표준 의뢰서 자동화와 통합 검색 엔진 MVP를 완성했습니다.</li><li>OEM 기업 파트너십으로 실제 업무 데이터를 확보했습니다.</li><li>AIF 연구실 석사 6명과의 산학협력을 이끌며 개발 방향을 정했고, 프론트엔드·백엔드와 API를 설계해 통합했습니다.</li><li>다음 단계는 AI 기능 고도화, 백엔드 통합, 프론트엔드 서버 구현, 전체 통합과 시연입니다.</li></ul></div>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>MVP 완성까지</td><td class="pv">—</td><td class="rs">3개월</td><td class="nt"></td></tr></tbody></table>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/oem_p16.jpg" title="향후 계획" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">향후 계획</div></div></div>
