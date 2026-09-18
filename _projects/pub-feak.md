---
layout: page
title: "From Evaluation to Feedback: A Feature-Based and LLM-Constrained Tool for Korean Writing Assessment"
description: "진단은 모델이, 설명은 LLM이. 환각 없는 피드백으로 전문가와 통계적 차이가 없었고 25배 빨랐습니다."
img: assets/img/pf/cov_feak.jpg
importance: 90
category: 논문
github: https://github.com/yunjinyong730/Advanced_UKTA
permalink: /projects/pub-feak/
---

<div class="pf-meta"><span class="pf-kind">논문 · 게재</span> <b>ACM SAC '26 · Thessaloniki, Greece</b> · 2026.03 · 2저자<br>Chanwoo Jang, Ganghee Go, Jinyong Yun, Seokho Ahn, Myungsun Shin, Ho-Hyun Kil, Sungmin Chang, Do-Guk Kim, Young-Duk Seo<br>The 41st ACM/SIGAPP Symposium on Applied Computing · 진단은 모델이, 설명은 LLM이 · 인하대 AIF 연구실 · KDD 연구실 · 국어교육과 연구실 공동 연구</div>
<p class="pf-links"><a class="btn btn-sm z-depth-0" href="https://dl.acm.org/doi/10.1145/3748522.3780021" target="_blank" rel="noopener">DOI</a> <a class="btn btn-sm z-depth-0" href="https://www.sigapp.org/sac/sac2026/" target="_blank" rel="noopener">SAC 2026</a> <a class="btn btn-sm z-depth-0" href="https://github.com/yunjinyong730/Advanced_UKTA" target="_blank" rel="noopener">GitHub</a> <a class="btn btn-sm z-depth-0" href="/assets/pdf/pub-feak.pdf" target="_blank">논문 PDF</a></p>
<p class="pf-tags"><span>KoBERT</span> <span>BiGRU</span> <span>Contextual Attention</span> <span>Elite Gap z-score</span> <span>GPT-4o-mini</span> <span>Constrained Prompting</span></p>
## 개요

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/f0_example.jpg" title="(A) 입력 에세이 (B) 8개 루브릭 점수 (C) 근거와 수정 예시가 있는 피드백" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">(A) 입력 에세이 (B) 8개 루브릭 점수 (C) 근거와 수정 예시가 있는 피드백</div></div></div>

<div class="pf-intro"><p>기존 자동 평가는 점수는 정확하지만 무엇을 고쳐야 하는지 말해주지 못하고, 범용 LLM은 설명은 유창하지만 환각과 정보 과부하가 따릅니다. FEAK는 정량 진단을 전용 모델에 맡기고, LLM은 그 진단을 학생이 이해할 수 있는 말로 <b>옮기는 역할만</b> 하도록 제약합니다.</p></div>

## 문제 해결 과정

<ol class="pf-steps"><li><a href="#step-1">Evaluation</a></li><li><a href="#step-2">Feature Extraction</a></li><li><a href="#step-3">Feedback</a></li><li><a href="#step-4">검증</a></li></ol>

<h3 id="step-1"><span class="pf-num">1</span> Evaluation <small>Enhanced AWE</small></h3>

<div class="pf-q"><h4>고민</h4><ul><li>294개 언어 자질(글의 특징을 나타내는 수치)을 모두 쓰면 느리고 신뢰도도 떨어집니다. 어떤 자질을 남겨야 할까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>KoBERT와 BiGRU 위에 내용 기반 어텐션을 두어, 에세이 내용에 따라 어떤 자질이 중요한지 모델이 스스로 가중치를 정하게 했습니다.</li><li>294개 중 통계적으로 유의한 <b>29개</b> 핵심 자질만 사용했습니다.</li></ul></div>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/f1_pipeline.jpg" title="Evaluation, Feature Extraction, Feedback의 세 단계" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">Evaluation, Feature Extraction, Feedback의 세 단계</div></div></div>

<h3 id="step-2"><span class="pf-num">2</span> Feature Extraction <small>6가지로 압축</small></h3>

<div class="pf-q"><h4>고민</h4><ul><li>수백 개의 진단 결과를 모두 보여주면, 학생은 무엇부터 고쳐야 할지 알 수 있을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>점수가 가장 낮은 하위 2개 루브릭만 대상으로 삼았습니다.</li><li>상위 10% 우수 에세이와 얼마나 차이가 나는지를 수치로 구했습니다(Elite Gap, z-score 기준).</li><li>격차의 크기, 모델이 본 중요도(어텐션), 개선 필요 가중치를 합한 우선순위 점수로 <b>6개</b> 자질을 골랐습니다.</li></ul></div>

<h3 id="step-3"><span class="pf-num">3</span> Feedback <small>Constrained Prompting</small></h3>

<div class="pf-q"><h4>고민</h4><ul><li>LLM이 스스로 평가하면 없는 사실을 지어내는 환각이 생깁니다. 평가는 하지 않고 설명만 하게 할 수 있을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>GPT-4o-mini에 원본 글과 수치로 정리된 증거표만 주었습니다. 지시는 "평가하지 말고 옮겨 적으라"는 것입니다.</li><li>모든 수치는 바꾸지 않고 그대로 인용하게 했고, 출력 순서를 현상 → 관련 자질 → 수정 전후 예시로 고정했습니다.</li></ul></div>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/f2_feedback.jpg" title="증거 기반 피드백 생성" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">증거 기반 피드백 생성</div></div></div>

<h3 id="step-4"><span class="pf-num">4</span> 검증 <small>사용자 연구 21명</small></h3>

<div class="pf-a"><h4>내용</h4><ul><li>사용자 21명이 피드백을 받아 글을 고쳤습니다. FEAK 피드백으로 고친 글의 점수 향상(<b>+4.43점</b>)은 전문가 피드백(+5.43점)과 통계적으로 차이가 없었고(p=.231), 범용 LLM 피드백(+2.14점)보다는 유의하게 높았습니다(p=.028). 피드백 생성 시간은 전문가 471초, FEAK <b>16.4초</b>입니다.</li><li>사용자는 증거와의 일치성(3.78 대 3.09)과 구체성(3.87 대 3.27)에서 FEAK를 범용 LLM보다 높게 평가했습니다.</li><li>개선한 분석기는 UKTA 대비 평균 QWK를 0.474에서 <b>0.521</b>로, 독창성 항목을 0.172에서 0.318로 올렸습니다.</li></ul></div>

<table class="tbl"><thead><tr><th>조건</th><th>Draft</th><th>Revision</th><th>향상</th><th>시간(초)</th></tr></thead><tbody><tr><td>Expert</td><td>70.00</td><td>75.43</td><td>+5.43</td><td>471.2</td></tr><tr><td>LLM</td><td>68.14</td><td>70.29</td><td>+2.14</td><td>8.8</td></tr><tr><td>FEAK</td><td>67.43</td><td>71.86</td><td>+4.43</td><td>16.4</td></tr></tbody></table>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>평균 QWK · UKTA와 FEAK</td><td class="pv">0.474</td><td class="rs">0.521</td><td class="nt"></td></tr><tr><td>독창성 QWK</td><td class="pv">0.172</td><td class="rs">0.318</td><td class="nt"></td></tr></tbody></table>
