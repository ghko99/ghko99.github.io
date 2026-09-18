---
layout: page
title: "에세이 자동 평가 모델 성능 향상을 위한 데이터 증강과 전처리"
description: "Topic Labeling 전처리와 MLM, T5, Random Masking 증강을 비교했습니다. 총점 QWK를 0.411에서 0.438로 올렸습니다."
img: assets/img/pf/cov_hclt.jpg
importance: 96
category: 논문
github: https://github.com/ghko99/Korean-Text-Data-Augmentation
permalink: /projects/pub-hclt/
---

<div class="pf-meta"><span class="pf-kind">논문 · 게재</span> <b>제35회 한글 및 한국어 정보처리 학술대회 (HCLT 2023)</b> · 2023.10 · 1저자<br>고강희, 김도국<br>AI-HUB 에세이 50,400편 · 11개 항목 · 각 실험 5회 반복 평균</div>
<p class="pf-links"><a class="btn btn-sm z-depth-0" href="https://koreascience.kr/article/CFKO202306643316614.page" target="_blank" rel="noopener">Korea Science</a> <a class="btn btn-sm z-depth-0" href="https://sites.google.com/view/hclt2023" target="_blank" rel="noopener">HCLT 2023</a> <a class="btn btn-sm z-depth-0" href="https://github.com/ghko99/Korean-Text-Data-Augmentation" target="_blank" rel="noopener">GitHub</a> <a class="btn btn-sm z-depth-0" href="/assets/pdf/pub-hclt.pdf" target="_blank">논문 PDF</a></p>
<p class="pf-tags"><span>KoBERT + GRU</span> <span>KcELECTRA MLM</span> <span>KoT5 paraphrase</span> <span>Random Masking</span> <span>Topic Labeling</span></p>
## 개요

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/hc0_overview.png" title="제안하는 데이터 증강 및 전처리를 활용한 AES 모델 개요" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">제안하는 데이터 증강 및 전처리를 활용한 AES 모델 개요</div></div></div>

<div class="pf-intro"><p>KCC 2023에서 주제 정보가 채점에 도움이 된다는 것을 확인한 뒤, 데이터의 품질과 다양성 자체를 높이는 방법을 찾았습니다. Topic Labeling 전처리와 세 가지 증강(MLM, T5, Random Masking)을 KoBERT 채점기에 적용해 비교했습니다.</p></div>

## 문제 해결 과정

<ol class="pf-steps"><li><a href="#step-1">Topic Labeling</a></li><li><a href="#step-2">MLM 증강</a></li><li><a href="#step-3">T5 증강</a></li><li><a href="#step-4">Random Masking</a></li><li><a href="#step-5">결과</a></li></ol>

<h3 id="step-1"><span class="pf-num">1</span> Topic Labeling <small>전처리</small></h3>

<div class="pf-q"><h4>고민</h4><ul><li>50개 주제 정보를 모델에 분명하게 알려주려면 어떻게 해야 할까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>매 문장 앞에 주제를 붙였습니다. "저는 학습시간이 5시간…"은 "학습과 여가활동 [SEP] 저는 학습시간이 5시간…"이 됩니다.</li><li>이 전처리만으로 모든 항목이 향상되었습니다.</li></ul></div>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>평가항목 평균 QWK · 전처리만 적용</td><td class="pv">0.5368</td><td class="rs">0.5483</td><td class="nt"></td></tr></tbody></table>

<h3 id="step-2"><span class="pf-num">2</span> MLM 증강</h3>

<div class="pf-q"><h4>고민</h4><ul><li>학생 글에는 신조어와 오탈자가 많습니다. 범용 언어모델로 자연스러운 문장을 만들 수 있을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>KcELECTRA-base-v2022를 학생 글 46만 문장으로 추가 학습한 뒤(RTD 방식), 문장의 25%를 가리고 다시 채우는 방식으로 증강했습니다.</li><li>"특히 K-POP으로 인한 가수들이 널리널리 알려져…"는 "최근 K-POP으로 인한 가수들이 더 널리 알려져… 한국을 사랑하는 것 같습니다."가 됩니다.</li></ul></div>

<h3 id="step-3"><span class="pf-num">3</span> T5 증강</h3>

<div class="pf-a"><h4>내용</h4><ul><li>같은 뜻의 다른 문장을 만드는 모델(psyche/KoT5-paraphrase-generation)로 문장 단위로 증강한 뒤 다시 한 편의 글로 합쳤습니다.</li><li>같은 문장이 "특히 K-POP이 널리 퍼지면서 많은 사람들이 한국에 관심을 갖고 한국을 좋아하는 것 같습니다"로 바뀝니다.</li></ul></div>

<h3 id="step-4"><span class="pf-num">4</span> Random Masking</h3>

<div class="pf-q"><h4>고민</h4><ul><li>아무 단어나 가리면 고급 어휘까지 사라져 글의 수준이 떨어집니다. 무엇을 가려야 할까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>형태소 분석기(mecab)로 품사를 확인해 기호, 숫자, 감탄사, 부사만 가리고, 뜻을 담는 단어(내용어)는 보존했습니다.</li></ul></div>

<h3 id="step-5"><span class="pf-num">5</span> 결과</h3>

<div class="pf-a"><h4>내용</h4><ul><li>MLM 증강을 더했을 때 평가항목 평균 QWK <b>0.5515</b>, 총점 QWK <b>0.4380</b>으로 가장 높았습니다.</li><li>항목마다 잘 맞는 증강이 달랐습니다. 문법·일관성·독해력은 Random Masking, 단어·구조·명료성·서술력은 T5, 문장표현·단락·분량·참신성은 MLM이 우세했습니다.</li></ul></div>

<table class="tbl"><thead><tr><th>모델</th><th>총점 QWK</th><th>Pearson</th></tr></thead><tbody><tr><td>Baseline</td><td>0.4111</td><td>0.5065</td></tr><tr><td>Only topic labeling</td><td>0.4255</td><td>0.5203</td></tr><tr><td>Topic + T5</td><td>0.4331</td><td>0.5256</td></tr><tr><td>Topic + Random Masking</td><td>0.4338</td><td>0.5243</td></tr><tr><td>Topic + MLM</td><td>0.4380</td><td>0.5254</td></tr></tbody></table>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>평가항목 평균 QWK</td><td class="pv">0.5368</td><td class="rs">0.5515</td><td class="nt"></td></tr><tr><td>총점 QWK</td><td class="pv">0.4111</td><td class="rs">0.4380</td><td class="nt"></td></tr></tbody></table>
