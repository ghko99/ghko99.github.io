---
layout: page
title: "사용자 중심의 한국어 텍스트 분석 및 설명 가능한 글쓰기 평가 도구"
description: "국어교육 연구실과 협업한 과제입니다. 설명가능성, 신뢰도(QWK 0.538에서 0.651), 범용성, 피드백의 네 단계로 확장했습니다."
img: assets/img/pf/u1_hero.jpg
importance: 93
category: 프로젝트
github: https://github.com/ttytu/UKTA-web
permalink: /projects/proj-ukta-proj/
---

<div class="pf-meta"><span class="pf-kind">프로젝트</span> <b>2024.09 – 2026.05</b> · 5인 이상 · AI 모델링 · 성능 최적화 담당 · ACM SAC 2025·2026 게재 · 웹 배포<br>인하대학교 · 한국연구재단(NRF) 협력과제 · 국어교육학 × 인공지능 연구실 · 월 1회 정기 회의</div>
<p class="pf-sub">U-KTA</p>
<p class="pf-links"><a class="btn btn-sm z-depth-0" href="https://ukta.inha.ac.kr/" target="_blank" rel="noopener">ukta.inha.ac.kr</a> <a class="btn btn-sm z-depth-0" href="https://github.com/ttytu/UKTA-web" target="_blank" rel="noopener">GitHub · UKTA-web</a> <a class="btn btn-sm z-depth-0" href="https://github.com/ghko99/aes-ukta-exp" target="_blank" rel="noopener">GitHub · aes-ukta-exp</a></p>
<p class="pf-tags"><span>KoBERT</span> <span>GRU</span> <span>Attention</span> <span>PyTorch</span> <span>Scikit-learn</span></p>
## 개요

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/u1_input.png" title="UKTA 웹 서비스 — 텍스트 입력 화면" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">UKTA 웹 서비스 — 텍스트 입력 화면</div></div></div>

<div class="pf-intro"><p>교사 한 명이 맡는 학생이 많아 개별 피드백은 물리적으로 어렵고, 기존 AI 채점은 근거가 없는 데다 QWK 0.5 미만이며 학습한 주제에서만 작동합니다. 국어교육 연구실과 협업해 교육 현장에서 실제로 쓸 수 있는 <b>설명 가능한 글쓰기 평가 도구</b>를 네 단계로 확장했습니다.</p></div>

## 문제 해결 과정

<ol class="pf-steps"><li><a href="#step-1">Phase 1 · 설명가능성</a></li><li><a href="#step-2">Phase 2 · 신뢰도</a></li><li><a href="#step-3">Phase 3 · 범용성</a></li><li><a href="#step-4">Phase 4 · 근거 기반 피드백</a></li></ol>

<h3 id="step-1"><span class="pf-num">1</span> Phase 1 · 설명가능성 <small>2024.09 – 2025.03</small></h3>

<div class="pf-q"><h4>고민</h4><ul><li>딥러닝 모델은 왜 그 점수인지 말해주지 않습니다. 294개 자질을 그대로 결합해서는 성능도 해석도 얻지 못합니다.</li><li>어떻게 해야 근거 있는 점수가 될까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>어떤 자질이 중요한지 모델이 스스로 배우는 어텐션을 설계했습니다.</li><li>문법 정확성 평가에서는 문법 오류 자질에, 창의성 평가에서는 어휘 다양성 자질에 높은 가중치가 실립니다.</li><li>가중된 자질 벡터와 KoBERT-GRU 문맥 벡터를 결합한 계층형 모델로 ACM SAC 2025에 게재했습니다.</li></ul></div>

<div class="row"><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/u3_fusion.jpg" title="계층형 융합 구조" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">계층형 융합 구조</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/u2_attention.jpg" title="루브릭별 자질 어텐션 가중치" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">루브릭별 자질 어텐션 가중치</div></div></div>

<h3 id="step-2"><span class="pf-num">2</span> Phase 2 · 신뢰도 <small>2025.03 – 07</small></h3>

<div class="pf-q"><h4>고민</h4><ul><li>초기 모델의 QWK는 0.538로 "적당한" 수준에 그쳤습니다. 본문만 보는 모델이 논제와 요구 조건을 놓치고 있는 것은 아닐까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>입력을 논제와 본문의 결합으로 바꿨습니다.</li><li>KoBERT의 최대 입력 길이를 50에서 400 토큰으로 늘렸습니다.</li><li>GRU에 Layer Normalization과 내용 기반 어텐션을 더했습니다.</li></ul></div>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>QWK · 사람 간 일치도 0.6383, 신뢰성 지수 93.5%</td><td class="pv">0.538</td><td class="rs">0.6506</td><td class="nt"></td></tr></tbody></table>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/u4_phase2.jpg" title="Phase 2 개선" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">Phase 2 개선</div></div></div>

<h3 id="step-3"><span class="pf-num">3</span> Phase 3 · 범용성 <small>2025.07 – 09</small></h3>

<div class="pf-q"><h4>고민</h4><ul><li>처음 보는 주제에서는 성능이 급락합니다. 새로 공개된 8만 편 데이터셋은 루브릭이 달라 기존 데이터와 호환되지 않습니다.</li><li>두 데이터셋을 함께 쓸 방법은 없을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>12만 편 규모의 두 데이터셋 루브릭을 비교해 내용, 구성, 표현 세 상위 범주로 통합하는 표준안을 제시했습니다.</li><li>주제가 달라도 채점할 수 있는 모델(Cross-Prompt AES)의 로드맵을 세우고 후속 연구를 이끌었습니다.</li></ul></div>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>통합 대상 에세이</td><td class="pv">4만</td><td class="rs">12만 이상</td><td class="nt"></td></tr></tbody></table>

<h3 id="step-4"><span class="pf-num">4</span> Phase 4 · 근거 기반 피드백 <small>2025.09 이후</small></h3>

<div class="pf-q"><h4>고민</h4><ul><li>LLM 피드백의 환각, 500개가 넘는 진단 결과의 정보 과부하, 교육 효과 검증의 부재. 이 셋을 한 번에 풀 수 있을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>역할을 나누었습니다. 자동 평가 모델(AWE)은 진단을, LLM은 해설을 맡습니다.</li><li>어텐션으로 가장 중요한 요인 몇 개만 고르는 Top-K 모듈을 만들었습니다.</li><li>성과(RQ1), 인식(RQ2), 과정(RQ3)을 함께 측정하는 혼합 연구를 설계해 ACM SAC 2026에 게재했습니다.</li></ul></div>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/u5_feak.jpg" title="FEAK 구조" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">FEAK 구조</div></div></div>
