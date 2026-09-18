---
layout: page
title: "UKTA: Unified Korean Text Analyzer"
description: "294개 언어학적 자질을 어텐션으로 결합한 설명 가능한 채점기입니다. 공동 1저자."
img: assets/img/pf/cov_ukta.jpg
importance: 94
category: 논문
github: https://github.com/ghko99/aes-ukta-exp
permalink: /projects/pub-ukta/
---

<div class="pf-meta"><span class="pf-kind">논문 · 게재</span> <b>ACM SAC '25 · Catania, Italy</b> · 2025.03 · 공동 1저자<br>Seokho Ahn*, Junhyung Park*, Ganghee Go*, Chulhui Kim, Jiho Jung, Myung Sun Shin, Do-Guk Kim, Young-Duk Seo<br>The 40th ACM/SIGAPP Symposium on Applied Computing · * 공동 1저자 · 작문 평가 모델 담당 · 인하대 AIF 연구실 · KDD 연구실 · 국어교육과 연구실 공동 연구</div>
<p class="pf-links"><a class="btn btn-sm z-depth-0" href="https://dl.acm.org/doi/10.1145/3672608.3707957" target="_blank" rel="noopener">DOI</a> <a class="btn btn-sm z-depth-0" href="https://arxiv.org/abs/2502.09648" target="_blank" rel="noopener">arXiv</a> <a class="btn btn-sm z-depth-0" href="https://ukta.inha.ac.kr/" target="_blank" rel="noopener">ukta.inha.ac.kr</a> <a class="btn btn-sm z-depth-0" href="https://github.com/ghko99/aes-ukta-exp" target="_blank" rel="noopener">GitHub</a> <a class="btn btn-sm z-depth-0" href="/assets/pdf/pub-ukta.pdf" target="_blank">논문 PDF</a></p>
<p class="pf-tags"><span>Bareun</span> <span>294 lexical features</span> <span>KoBERT</span> <span>BiGRU</span> <span>Attention</span> <span>XAI</span></p>
## 개요

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/u1_hero.jpg" title="(A) 입력 (B) 형태소와 어휘 자질 결과 (C) 설명 가능한 평가 — 루브릭 점수와 기여 자질" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">(A) 입력 (B) 형태소와 어휘 자질 결과 (C) 설명 가능한 평가 — 루브릭 점수와 기여 자질</div></div></div>

<div class="pf-intro"><p>기존 한국어 작문 평가 도구는 한 가지 관점만 보고, 앞 단계의 오류가 뒤로 전파되며, 왜 그 점수인지 설명하지 못했습니다. UKTA는 저수준 형태소 분석부터 고수준 작문 평가까지 <b>세 층</b>을 한 곳에서 제공하는 한국어 최초의 통합 분석기입니다.</p></div>

## 문제 해결 과정

<ol class="pf-steps"><li><a href="#step-1">형태소 분석</a></li><li><a href="#step-2">어휘 자질 294개</a></li><li><a href="#step-3">작문 평가 모델</a></li><li><a href="#step-4">결과</a></li></ol>

<h3 id="step-1"><span class="pf-num">1</span> 형태소 분석 <small>저수준</small></h3>

<div class="pf-q"><h4>고민</h4><ul><li>형태소 분석이 틀리면 그 뒤의 모든 분석이 틀립니다. 오류가 퍼지는 것을 어디서 막아야 할까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>가장 정확한 형태소 분석기(Bareun)를 첫 단계에 두어 오류가 뒤로 퍼지는 것을 최소화했습니다. 결과는 표와 목록으로 보여주고 JSON, TXT로 내려받을 수 있습니다.</li></ul></div>

<h3 id="step-2"><span class="pf-num">2</span> 어휘 자질 294개 <small>중수준</small></h3>

<div class="pf-q"><h4>고민</h4><ul><li>글의 수준을 설명하는 수치에는 무엇이 있을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>기본 자질은 형태소와 단어의 개수, 밀도, 길이입니다.</li><li>어휘가 얼마나 다양한지는 TTR, RTTR, CTTR, MSTTR, MATTR, MTLD, HD-D, Voc-D 같은 지표로 전체 토큰과 형태소별로 계산합니다.</li><li>글이 얼마나 짜임새 있게 이어지는지(응집성)는 핵심어(KeyBERT)와 문장 유사도(SBERT)로 주제 일관성, 문장 간 유사도, 인접 문장·단락의 어휘 중복도를 봅니다.</li></ul></div>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/u_func.jpg" title="형태소 분석 결과와 어휘 자질 결과 화면" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">형태소 분석 결과와 어휘 자질 결과 화면</div></div></div>

<h3 id="step-3"><span class="pf-num">3</span> 작문 평가 모델 <small>고수준 · 본인 담당</small></h3>

<div class="pf-q"><h4>고민</h4><ul><li>딥러닝 점수는 근거를 말해주지 않습니다. 294개 자질을 그대로 이어 붙여도 성능은 오르지 않습니다.</li><li>자질과 문맥을 어떻게 결합해야 정확하면서도 설명이 될까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>문장 수준에서는 KoBERT(가중치 고정)와 BiGRU가 문맥 벡터를 만들고, 에세이 수준에서는 294개 자질에 어텐션을 적용해 자질 벡터를 만듭니다. 두 벡터를 합쳐 10개 루브릭 점수를 예측합니다.</li><li>어텐션 가중치가 곧 근거가 됩니다. 어떤 자질이 점수에 얼마나 기여했는지 그림으로 보여줄 수 있습니다.</li></ul></div>

<div class="row"><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/u3_fusion.jpg" title="모델 구조" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">모델 구조</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/u2_attention.jpg" title="루브릭별 자질 어텐션 가중치" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">루브릭별 자질 어텐션 가중치</div></div></div>

<h3 id="step-4"><span class="pf-num">4</span> 결과</h3>

<div class="pf-a"><h4>내용</h4><ul><li>AI-HUB 46,000편, 10개 루브릭, 5회 반복 평균 기준으로 10개 중 <b>9개</b> 항목이 향상되었습니다. 독창성(QWK +0.103), 분량(+0.084), 서술(+0.067)의 개선이 특히 컸습니다.</li><li>점수가 높은 글에서는 응집성과 명사 다양성 자질이, 낮은 글에서는 어휘 다양성 부족 자질이 상위에 올랐습니다. 점수의 근거가 자질로 설명됩니다.</li></ul></div>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>평균 QWK</td><td class="pv">0.509</td><td class="rs">0.538</td><td class="nt"></td></tr><tr><td>평균 정확도</td><td class="pv">0.649</td><td class="rs">0.657</td><td class="nt"></td></tr><tr><td>독창성 QWK</td><td class="pv">0.069</td><td class="rs">0.172</td><td class="nt"></td></tr></tbody></table>
