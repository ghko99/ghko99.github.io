---
layout: page
title: "Enhancing Korean Automated Essay Scoring via Linguistically Informed Augmentation and Topic-Aware Preprocessing"
description: "한국어 특화 증강(CHEF, RMI)과 주제 인식 전처리로 사람 채점자 상한의 83%에 도달했습니다. SCI/E 심사 중."
img: assets/img/pf/cov_kaes.jpg
importance: 91
category: 논문
github: https://github.com/ghko99/Korean-Text-Data-Augmentation
permalink: /projects/pub-kaes/
---

<div class="pf-meta"><span class="pf-kind">논문 · 심사 중 · R1</span> <b>Natural Language Processing (Cambridge University Press)</b> · 2025 – 2026 · 1저자<br>Ganghee Go, Do-Guk Kim<br>Manuscript NLP-2025-0110.R1 · AI-HUB 에세이 44,658편 · 50개 주제 · 11개 평가 항목</div>
<p class="pf-links"><a class="btn btn-sm z-depth-0" href="https://www.cambridge.org/core/journals/natural-language-processing" target="_blank" rel="noopener">저널</a> <a class="btn btn-sm z-depth-0" href="https://github.com/ghko99/Korean-Text-Data-Augmentation" target="_blank" rel="noopener">GitHub</a></p>
<p class="pf-tags"><span>KoBERT</span> <span>mBART-50 CHEF</span> <span>KoELECTRA RMI</span> <span>10-fold CV</span> <span>Holm 보정</span></p>
## 개요

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/k0_framework.jpg" title="제안 프레임워크 — CHEF·RMI 증강, topic-aware 전처리, frozen KoBERT + GRU 채점기" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">제안 프레임워크 — CHEF·RMI 증강, topic-aware 전처리, frozen KoBERT + GRU 채점기</div></div></div>

<div class="pf-intro"><p>한국어 자동 에세이 채점은 라벨 데이터가 적고 형태론이 복잡하다는 두 가지 벽에 부딪힙니다. 이 연구는 한국어의 특성을 반영한 두 가지 증강 기법(CHEF, RMI)과 주제 인식 전처리를 KoBERT-GRU 채점기에 적용하고, 그 향상이 우연이 아님을 통계적으로 검증한 뒤, 사람 채점자끼리의 일치도와 같은 기준으로 모델의 위치를 가늠했습니다.</p></div>

## 문제 해결 과정

<ol class="pf-steps"><li><a href="#step-1">데이터</a></li><li><a href="#step-2">CHEF 증강</a></li><li><a href="#step-3">RMI 증강</a></li><li><a href="#step-4">주제 인식 전처리</a></li><li><a href="#step-5">KoBERT-GRU 채점기</a></li><li><a href="#step-6">증강 비율</a></li><li><a href="#step-7">검증과 사람 상한</a></li></ol>

<h3 id="step-1"><span class="pf-num">1</span> 데이터 <small>AI-HUB 44,658편</small></h3>

<div class="pf-q"><h4>고민</h4><ul><li>학년과 주제에 따라 점수 분포가 다른 데이터입니다. 어떻게 나누어 실험해야 결과를 믿을 수 있을까?</li><li>한 번 나누어 얻은 향상이 우연이 아니라는 것을 어떻게 보일 수 있을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>원본 45,497편에서 중복을 제거해 <b>44,658편</b>을 사용했습니다. 주제는 50개, 학년은 초등 4학년부터 고등 3학년까지입니다.</li><li>11개 항목을 채점자 3명이 각 0~3점으로 매겼고, 그 평균을 정답으로 삼았습니다.</li><li>데이터를 10개로 나누어 돌아가며 검증했습니다(10-fold 교차검증). 나눌 때 주제 비율이 유지되도록 했고, 증강으로 만든 데이터는 학습용 묶음에만 넣어 검증 결과에 섞이지 않게 했습니다.</li></ul></div>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>에세이 수 (중복 제거 전후)</td><td class="pv">45,497</td><td class="rs">44,658</td><td class="nt"></td></tr></tbody></table>

<h3 id="step-2"><span class="pf-num">2</span> CHEF 증강 <small>mBART-50 기반</small></h3>

<div class="pf-q"><h4>고민</h4><ul><li>단어를 다른 단어로 바꿔 넣는 증강은 한국어에서 뜻과 문법을 함께 망가뜨립니다. 핵심 어휘는 그대로 두고 표현만 바꿀 수는 없을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>문장을 형태소 단위로 분석한 뒤(mecab-ko), 뜻을 담는 핵심 형태소만 남기고 문장을 다시 생성했습니다(mBART-50).</li><li>조사, 어미, 문체가 바뀌면서 표현이 다양해집니다. 예를 들어 "먹는다"가 "먹습니다"로 바뀝니다.</li><li>생성된 문장이 원문의 80%보다 짧으면 원문을 그대로 두었습니다.</li></ul></div>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/k1_chef.jpg" title="CHEF — 형태소 분석 후 핵심 어휘를 보존하며 재생성" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">CHEF — 형태소 분석 후 핵심 어휘를 보존하며 재생성</div></div></div>

<h3 id="step-3"><span class="pf-num">3</span> RMI 증강 <small>KoELECTRA 기반</small></h3>

<div class="pf-q"><h4>고민</h4><ul><li>원래 있던 단어는 하나도 바꾸지 않고, 새로운 표현만 더할 수는 없을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>어절 사이에 빈칸([MASK])을 넣고, 언어모델(KoELECTRA-base)이 그 자리를 채우게 했습니다. 빈칸을 넣는 비율은 0.3입니다.</li><li>원문의 단어가 모두 남기 때문에 변형이 통제되고, 새 단어가 더해지므로 CHEF보다 어휘 변화는 큽니다. 예를 들어 "사람들은 이 날이 되면 팥죽을 먹는다."가 "사람들은 보통 이 날이 되면 팥죽을 먹는다."가 됩니다.</li></ul></div>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/k2_rmi.jpg" title="RMI — Random Masking Insertion" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">RMI — Random Masking Insertion</div></div></div>

<h3 id="step-4"><span class="pf-num">4</span> 주제 인식 전처리</h3>

<div class="pf-q"><h4>고민</h4><ul><li>같은 글이라도 어떤 논제에 답한 글인지에 따라 점수가 달라집니다. 논제를 모르는 모델에게 이를 어떻게 알려줄 수 있을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>각 문장 앞에 에세이의 주제를 붙였습니다. 별도의 라벨링 작업 없이 적용할 수 있습니다.</li><li>모델(KoBERT)이 문장 내용과 주제를 함께 보게 되고, 어휘·문장·분량·단락 구조·주제 항목에서 유의한 향상이 있었습니다.</li></ul></div>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>FCS QWK · 전처리만 적용</td><td class="pv">0.4243</td><td class="rs">0.4311</td><td class="nt"></td></tr></tbody></table>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/k3_topic.jpg" title="topic-aware preprocessing — 문장 앞에 주제 T를 결합" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">topic-aware preprocessing — 문장 앞에 주제 T를 결합</div></div></div>

<h3 id="step-5"><span class="pf-num">5</span> KoBERT-GRU 채점기</h3>

<div class="pf-q"><h4>고민</h4><ul><li>어떤 모델을 기준(베이스라인)으로 삼아야 비교가 공정할까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>문장은 KoBERT(가중치 고정)로 768차원 벡터로 바꾸고, 3층 GRU(256, 128, 64)가 11개 항목 점수를 예측합니다. 학습 설정은 Adam 5×10⁻⁴, batch 64, MSE 손실, RTX 3090 Ti입니다.</li><li>공식 참고 모델과 전통적인 기계학습 모델을 모두 비교한 뒤 KoBERT + GRU를 기준 모델로 정했습니다.</li></ul></div>

<table class="tbl"><thead><tr><th>모델</th><th>FCS QWK</th></tr></thead><tbody><tr><td>KoBERT + GRU</td><td>0.4243</td></tr><tr><td>word2vec + LSTM</td><td>0.3861</td></tr><tr><td>word2vec + GRU</td><td>0.3740</td></tr><tr><td>kNN</td><td>0.3732</td></tr><tr><td>Random Forest</td><td>0.3195</td></tr><tr><td>Ridge</td><td>0.3015</td></tr></tbody></table>

<h3 id="step-6"><span class="pf-num">6</span> 증강 비율</h3>

<div class="pf-q"><h4>고민</h4><ul><li>증강 데이터는 많을수록 좋을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>원본 대비 0.5, 1.0, 1.5, 2.0, 2.5배를 비교했습니다. <b>1:1</b>이 모든 기법과 전처리 조합에서 향상을 보인 유일한 비율이었습니다. 0.5배는 결과가 불안정했고, 1.5배 이상은 더 오르지 않았습니다.</li><li>뜻이 얼마나 보존되는지도 쟀습니다. RMI는 코사인 유사도 <b>0.978</b>, CHEF는 STS 점수 <b>0.928</b>로 가장 높았습니다.</li></ul></div>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/k4_ratio.jpg" title="증강 비율에 따른 성능 — 1:1이 가장 안정적" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">증강 비율에 따른 성능 — 1:1이 가장 안정적</div></div></div>

<h3 id="step-7"><span class="pf-num">7</span> 검증과 사람 상한</h3>

<div class="pf-q"><h4>고민</h4><ul><li>QWK 0.43은 좋은 점수일까, 나쁜 점수일까? 사람 채점자끼리는 서로 얼마나 일치할까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>향상이 우연이 아닌지 통계 검정으로 확인했습니다(paired one-sided t-test, Holm–Bonferroni 보정, Wilcoxon으로 재확인). CHEF, RMI, 주제 전처리는 각각 보정 후에도 유의했습니다. 셋을 합친 효과는 경향으로만 해석했습니다.</li><li>채점자 3명의 원점수를 복원해, 한 명의 점수와 나머지 두 명의 평균을 비교하는 방식으로 사람의 일치 수준(상한)을 쟀습니다. 상한은 <b>0.523</b>이고, 최고 모델은 그 <b>83%</b>에 해당합니다.</li><li>항목별 성능 순서는 사람과 모델이 비슷했습니다(Spearman 상관 0.82).</li></ul></div>

<table class="tbl"><thead><tr><th>비교</th><th>Δ FCS</th><th>Holm p</th></tr></thead><tbody><tr><td>CHEF vs Baseline</td><td>+0.0075</td><td>0.0177 *</td></tr><tr><td>RMI vs Baseline</td><td>+0.0048</td><td>0.0319 *</td></tr><tr><td>Topic vs Baseline</td><td>+0.0068</td><td>0.0041 *</td></tr><tr><td>CHEF+Topic vs Topic</td><td>+0.0048</td><td>0.0895</td></tr></tbody></table>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>FCS QWK · CHEF 1:1 + Topic</td><td class="pv">0.4243</td><td class="rs">0.4360</td><td class="nt"></td></tr><tr><td>평균 QWK</td><td class="pv">0.5690</td><td class="rs">0.5809</td><td class="nt"></td></tr><tr><td>독창성 QWK · CHEF</td><td class="pv">0.1428</td><td class="rs">0.1786</td><td class="nt"></td></tr></tbody></table>
