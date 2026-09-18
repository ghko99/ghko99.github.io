---
layout: page
title: "근거 기반 한국어 에세이 자동 채점 Agent"
description: "석사논문의 방법을 그대로 서비스로 옮겼습니다. 기획부터 배포까지 혼자 진행했고, 사람 채점자 대비 신뢰도는 95.4%입니다."
img: assets/img/pf/g1_home.jpg
importance: 89
category: 프로젝트
github: https://github.com/ghko99/essay-agent
permalink: /projects/proj-geulgyeol/
---

<div class="pf-meta"><span class="pf-kind">프로젝트</span> <b>2026.03 – 06</b> · 1인 프로젝트 · 웹 서비스 배포<br>기획, 데이터, 학습, Agent, 추론 서버, 프론트엔드, 배포까지 단독 수행 · 약 8만 편의 한국어 글쓰기 평가 데이터로 학습 · 8개 루브릭 1~9점</div>
<p class="pf-sub">글결</p>
<p class="pf-links"><a class="btn btn-sm z-depth-0" href="https://geulgyeol.tech/" target="_blank" rel="noopener">geulgyeol.tech</a> <a class="btn btn-sm z-depth-0" href="https://github.com/ghko99/essay-agent" target="_blank" rel="noopener">GitHub</a></p>
<p class="pf-tags"><span>Kanana-1.5-8B-Instruct</span> <span>PEFT · LoRA</span> <span>vLLM AsyncLLMEngine</span> <span>FastAPI · SSE</span> <span>Native Function Calling</span> <span>Bareun · Kiwi · ETRI</span></p>
## 개요

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/g2_pipeline.jpg" title="학생 에세이, LoRA 채점 모델, Base LLM 검증 Agent, 근거 기반 리포트로 이어지는 구조" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">학생 에세이, LoRA 채점 모델, Base LLM 검증 Agent, 근거 기반 리포트로 이어지는 구조</div></div></div>

<div class="pf-intro"><p>점수뿐 아니라 피드백과 <b>객관적인 채점 근거</b>를 함께 제시하는 LLM Agent입니다. LoRA로 학습한 채점 모델이 점수, 피드백, 확신도를 내고, LoRA를 뗀 Base LLM이 검증 Agent로서 외부 도구를 호출해 독립적으로 평가한 뒤 사후에 결합합니다. 석사논문의 방법을 그대로 서비스로 옮긴 결과물입니다.</p></div>

## 문제 해결 과정

<ol class="pf-steps"><li><a href="#step-1">LoRA 채점 모델</a></li><li><a href="#step-2">Soft Self-Consistency</a></li><li><a href="#step-3">검증 Agent</a></li><li><a href="#step-4">근거 도구</a></li><li><a href="#step-5">서비스</a></li><li><a href="#step-6">결과</a></li></ol>

<h3 id="step-1"><span class="pf-num">1</span> LoRA 채점 모델 <small>Kanana-1.5-8B</small></h3>

<div class="pf-q"><h4>고민</h4><ul><li>3점과 4점의 차이와 3점과 9점의 차이를 같게 보는 손실 함수(Cross-Entropy)로 점수의 순서를 가르칠 수 있을까?</li><li>중간 점수에 몰린 데이터의 편향은 어떻게 할까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>AI Hub 데이터를 전처리해 Kanana-1.5-8B-Instruct를 LoRA로 학습했습니다.</li><li>모델이 각 숫자에 매긴 확률의 기대값과 정답 점수의 거리를 학습하는 손실(Weighted Number Token Loss)을 적용했습니다.</li><li>점수가 순서와 거리를 가진 수치로 학습됩니다.</li></ul></div>

<h3 id="step-2"><span class="pf-num">2</span> Soft Self-Consistency <small>추론</small></h3>

<div class="pf-q"><h4>고민</h4><ul><li>가장 확률이 높은 숫자 하나만 고르면 나머지 점수의 확률 정보가 버려집니다. 이를 살릴 수 없을까?</li><li>같은 글도 실행마다 점수가 달라집니다. 정수 점수만 모으는 일반적인 Self-Consistency로 충분할까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>1~9점 확률 분포의 기대값을 점수로 쓰는 방식(Expected Value Decoding)으로, 추가 학습 없이 0.602에서 <b>0.610</b>으로 올렸습니다.</li><li>기대값 디코딩과 여러 번 채점을 결합한 Soft Self-Consistency를 적용했습니다.</li><li>성능과 비용을 함께 보고 서비스에는 30회 앙상블을 택했습니다.</li></ul></div>

<table class="tbl"><thead><tr><th>추론 방식</th><th>평균 QWK</th></tr></thead><tbody><tr><td>Hard Greedy</td><td>0.602</td></tr><tr><td>Soft Greedy</td><td>0.610</td></tr><tr><td>Hard Self-Consistency</td><td>0.624</td></tr><tr><td>Soft Self-Consistency</td><td>0.625</td></tr></tbody></table>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/g3_sc.jpg" title="샘플 수에 따른 QWK 변화" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">샘플 수에 따른 QWK 변화</div></div></div>

<h3 id="step-3"><span class="pf-num">3</span> 검증 Agent <small>Anchoring 차단</small></h3>

<div class="pf-q"><h4>고민</h4><ul><li>검증 Agent에게 최초 점수를 보여주면, 외부 도구를 쓰고도 그 점수를 그대로 따라 합니다. 어떻게 독립적으로 판단하게 할까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><pre>기존 방식  LoRA 점수 공개, Agent 검증, 기존 점수 복사
개선 방식  LoRA 점수 비공개, Agent 독립 평가, 사후 결합</pre><ul><li>검증 단계에서는 LoRA 어댑터를 떼고, 최초 점수를 숨긴 채 외부 도구의 측정값만으로 루브릭별 점수를 판단하게 했습니다.</li><li>지나치게 크게 바뀌지 않도록 조정 범위를 제한했습니다.</li><li>LLM 하나를 LoRA를 켜고 끄는 방식으로 채점과 검증에 재사용합니다.</li></ul></div>

<h3 id="step-4"><span class="pf-num">4</span> 근거 도구 <small>Function Calling</small></h3>

<div class="pf-q"><h4>고민</h4><ul><li>"문장이 어색하다", "어휘가 부족하다"는 피드백만으로 학생이 점수를 납득할 수 있을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>점수와 함께 확인할 수 있는 증거를 제시합니다. 오류 위치, 측정값, 공식 어문 규범이 그 예입니다.</li></ul></div>

<table class="tbl"><thead><tr><th>도구</th><th>검증 내용</th></tr></thead><tbody><tr><td>Bareun · Kiwi · ETRI</td><td>맞춤법과 띄어쓰기 오류</td></tr><tr><td>한국어 어문규범</td><td>오류와 관련된 공식 규정</td></tr><tr><td>한국어기초사전 · 우리말샘</td><td>어휘 수준과 사전 등재 여부</td></tr><tr><td>국립국어원 온용어</td><td>주제에 맞는 전문용어 사용 여부</td></tr><tr><td>Token Log Prob Perplexity</td><td>문장 간 연결의 자연스러움</td></tr><tr><td>핵심 키워드 검사</td><td>논제 요구사항 충족 여부</td></tr></tbody></table>

<h3 id="step-5"><span class="pf-num">5</span> 서비스 <small>vLLM · FastAPI · 웹</small></h3>

<div class="pf-a"><h4>내용</h4><ul><li>추론 서버는 vLLM AsyncLLMEngine, API는 FastAPI와 SSE 스트리밍, 화면은 Vanilla JS로 구성했습니다.</li><li>논제를 고르고 에세이를 쓰면 점수 분포, 확신도, 강점과 개선점, 최초 채점과 Agent 검증의 비교가 담긴 리포트를 받습니다.</li></ul></div>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/g1_home.jpg" title="논제 선택 — 서술형 60 · 논술형 89 · 주제별 15" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">논제 선택 — 서술형 60 · 논술형 89 · 주제별 15</div></div></div>

<h3 id="step-6"><span class="pf-num">6</span> 결과</h3>

<div class="pf-a"><h4>내용</h4><ul><li>Hard Greedy 0.602에서 Soft Self-Consistency <b>0.625</b>로 향상되었습니다.</li><li>사람 채점자끼리의 일치도는 0.6546, 모델과 사람의 일치도는 0.6247입니다. 사람 대비 <b>95.4%</b> 수준입니다.</li><li>남은 과제: 사실관계와 논리 오류를 검증하는 도구가 부족하고, 맞춤법과 사전 기능이 외부 API에 의존합니다. 통합 보정 결과의 QWK 검증도 필요합니다.</li><li>반복 수정 과정을 관리하는 Writing Agent로 확장할 계획입니다.</li></ul></div>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>평균 QWK</td><td class="pv">0.602</td><td class="rs">0.625</td><td class="nt"></td></tr><tr><td>사람 채점자 대비 신뢰도</td><td class="pv">—</td><td class="rs">95.4%</td><td class="nt"></td></tr></tbody></table>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/g4_final.jpg" title="최종 성능 — 모델과 사람 채점자" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">최종 성능 — 모델과 사람 채점자</div></div></div>
