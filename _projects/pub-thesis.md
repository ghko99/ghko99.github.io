---
layout: page
title: "생성형 대규모 언어모델 기반 한국어 자동 에세이 채점 성능 개선 연구"
description: "WNTL, SAL, ED, SC를 하나의 프레임워크로 정리했습니다. 8개 루브릭 모두 유의했고 베이스라인 대비 10.9% 향상했습니다."
img: assets/img/pf/cov_thesis.jpg
importance: 87
category: 논문
github: https://github.com/ghko99/aes-llm-training
permalink: /projects/pub-thesis/
---

<div class="pf-meta"><span class="pf-kind">논문 · 학위논문</span> <b>인하대학교 대학원 전기컴퓨터공학과(인공지능전공) 공학석사학위 논문</b> · 2026.08<br>고강희 · 지도교수 김도국<br>AI Hub 서술형 글쓰기 평가 40,006편 (학습 32,006 / 검증 4,000 / 테스트 4,000) · 8개 루브릭 1~9점 · A100</div>
<p class="pf-links"><a class="btn btn-sm z-depth-0" href="https://drive.google.com/file/d/11xr9pjBDVv-bOcM8CQwRZ_r5mi5ELk2h/view" target="_blank" rel="noopener">논문 원문</a> <a class="btn btn-sm z-depth-0" href="https://drive.google.com/file/d/1Harda2-sPUtYZpWIlU2FIzxYDIdnQizQ/view" target="_blank" rel="noopener">디펜스 발표자료</a> <a class="btn btn-sm z-depth-0" href="https://github.com/ghko99/aes-llm-training" target="_blank" rel="noopener">GitHub · 학습</a> <a class="btn btn-sm z-depth-0" href="https://github.com/ghko99/essay_scoring_llm" target="_blank" rel="noopener">GitHub · 배포 패키지</a></p>
<p class="pf-tags"><span>Llama 3.1-8B-Instruct</span> <span>QLoRA</span> <span>WNTL</span> <span>SAL</span> <span>Expected-value Decoding</span> <span>Self-Consistency</span> <span>paired bootstrap</span></p>
## 개요

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/s0_system.jpg" title="그림 1 — 제안하는 생성형 LLM 기반 자동 에세이 채점 시스템" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">그림 1 — 제안하는 생성형 LLM 기반 자동 에세이 채점 시스템</div></div></div>

<div class="pf-intro"><p>판별 모델은 점수만 내고, 생성형 LLM은 점수와 피드백을 함께 내지만 정확도와 재현성이 낮습니다. 이 논문의 목표는 <b>단일 생성형 모델</b>로 판별 베이스라인 수준의 정확도와 교육적 피드백을 동시에 달성하는 것이었습니다. 학습에 두 가지 보조 손실(WNTL, SAL)을, 추론에 두 가지 디코딩 전략(ED, SC)을 더하고 paired bootstrap으로 검증했습니다.</p></div>

## 문제 해결 과정

<ol class="pf-steps"><li><a href="#step-1">데이터</a></li><li><a href="#step-2">모델과 학습 설정</a></li><li><a href="#step-3">WNTL</a></li><li><a href="#step-4">SAL</a></li><li><a href="#step-5">실험 1 · 손실 조합</a></li><li><a href="#step-6">실험 2 · 추론 전략</a></li><li><a href="#step-7">통계 검증과 결과</a></li></ol>

<h3 id="step-1"><span class="pf-num">1</span> 데이터 <small>40,006편 · 8 루브릭</small></h3>

<div class="pf-q"><h4>고민</h4><ul><li>데이터가 중간 점수에 몰려 있습니다. 드문 점수대(1~3점, 8~9점)를 어떻게 맞힐 수 있을까?</li><li>사람 채점자끼리도 잘 맞지 않는 루브릭에서 모델의 성능을 어디까지 기대해야 할까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>전문 채점자 2명이 각 1~5점으로 매긴 점수를 합하고 1을 빼서 1~9점 레이블로 만들었습니다. 점수와 전문가 피드백을 모두 학습 목표로 삼았습니다.</li><li>문장의 연결성(0.505)과 어휘의 적절성(0.484)은 채점자끼리의 일치도 자체가 낮은 항목입니다. 이 수치가 모델 성능의 현실적인 상한을 해석하는 기준이 됩니다.</li></ul></div>

<div class="row"><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/s2_rubric.jpg" title="표 1 — 루브릭별 평가 기준" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">표 1 — 루브릭별 평가 기준</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/s3_dist1.jpg" title="그림 2 — 루브릭별 레이블 분포" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">그림 2 — 루브릭별 레이블 분포</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/s3_dist2.jpg" title="그림 2 (계속)" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">그림 2 (계속)</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/s4_irr.jpg" title="그림 3 — 루브릭별 채점자 간 일치도" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">그림 3 — 루브릭별 채점자 간 일치도</div></div></div>

<h3 id="step-2"><span class="pf-num">2</span> 모델과 학습 설정</h3>

<div class="pf-a"><h4>내용</h4><ul><li>Llama 3.1-8B-Instruct에 QLoRA(4비트 양자화 + LoRA, NF4, double quantization)를 적용했습니다. LoRA r=16, α=32, dropout 0.05, 대상 모듈 q_proj와 v_proj입니다.</li><li>시퀀스 길이 2,048, 유효 배치 32, 학습률 3×10⁻⁴, AdamW, BF16, 최대 10 epoch, 3 epoch 개선이 없으면 중단, seed 42, A100에서 학습했습니다.</li></ul></div>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/s5_hparam.jpg" title="표 2 — 학습·추론 하이퍼파라미터" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">표 2 — 학습·추론 하이퍼파라미터</div></div></div>

<h3 id="step-3"><span class="pf-num">3</span> WNTL <small>가중 숫자 토큰 손실</small></h3>

<div class="pf-q"><h4>고민</h4><ul><li>기본 손실(CE)은 점수 토큰을 서로 무관한 범주로 봅니다. 여기에 순서와 거리를 어떻게 심을 수 있을까? 드문 점수대는 어떻게 보강할까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>점수 토큰 위치의 확률 분포로 기대 점수를 구하고, 정답과의 차이(MSE)를 CE에 더했습니다.</li><li>드문 점수일수록 큰 가중치를 주는 클래스 가중치(0.7~2.5로 제한)를 결합해, 드문 점수대의 오차를 집중적으로 줄였습니다.</li></ul></div>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>Average QWK · CE만 적용한 경우와 WNTL</td><td class="pv">0.5041</td><td class="rs">0.5956</td><td class="nt"></td></tr></tbody></table>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/s1_algo.jpg" title="Algorithm 1 — WNTL·SAL 학습 알고리즘" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">Algorithm 1 — WNTL·SAL 학습 알고리즘</div></div></div>

<h3 id="step-4"><span class="pf-num">4</span> SAL <small>피드백 의미 정렬</small></h3>

<div class="pf-q"><h4>고민</h4><ul><li>피드백이 정답 문장의 겉모습만 따라 하며 학습되는 것을 어떻게 막을까? 세 손실의 크기가 다른데 가중치를 일일이 맞춰야 할까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>피드백 토큰 위치에서 상위 k개 예측 확률로 가중한 의미 벡터와 정답의 의미 벡터가 가까워지도록(코사인 유사도 최대화) 학습했습니다.</li><li>전체 손실은 0.5 · (L_CE + λ (L_WNTL + L_SAL))입니다. λ는 CE와 보조 손실의 비율로 매 학습 단계마다 자동으로 계산되므로, 따로 하이퍼파라미터를 찾을 필요가 없습니다.</li></ul></div>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>Average QWK · NTL과 NTL+SAL</td><td class="pv">0.5800</td><td class="rs">0.5976</td><td class="nt"></td></tr></tbody></table>

<h3 id="step-5"><span class="pf-num">5</span> 실험 1 · 손실 조합</h3>

<div class="pf-a"><h4>내용</h4><ul><li>CE만 쓴 모델(0.5041)은 판별 기준 모델(0.5655)보다 낮았습니다. 생성형 구조라고 해서 저절로 유리하지는 않다는 뜻입니다.</li><li>SAL+WNTL은 평균 <b>0.6117</b>, Overall <b>0.7151</b>로 기준 모델을 모두 넘었습니다.</li><li>개선폭은 문장의 연결성(+96.4%)과 어휘의 적절성(+48.6%)에서 가장 컸습니다. 채점자끼리 일치도가 가장 낮았던 바로 그 루브릭들입니다.</li><li>WNTL은 극단 점수 구간의 오차(MAE)를 줄였고, 예측 점수의 분포가 정답 분포와 비슷한 모양으로 돌아왔습니다.</li></ul></div>

<div class="row"><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/s6_models.jpg" title="표 3 — 비교 모델 6종" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">표 3 — 비교 모델 6종</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/s7_table1.jpg" title="표 4 — 손실 구성별 루브릭 QWK" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">표 4 — 손실 구성별 루브릭 QWK</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/s8_fig4.jpg" title="그림 4 — 루브릭별 QWK" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">그림 4 — 루브릭별 QWK</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/s9_fig5.jpg" title="그림 5 — CE 대비 개선율" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">그림 5 — CE 대비 개선율</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/s10_mae.jpg" title="그림 6 — 점수 구간별 MAE" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">그림 6 — 점수 구간별 MAE</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/s11_dist.jpg" title="그림 7 — 정답 분포와 예측 분포" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">그림 7 — 정답 분포와 예측 분포</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/s12_confusion.jpg" title="그림 8 — 어휘적절성 혼동 행렬" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">그림 8 — 어휘적절성 혼동 행렬</div></div></div>

<h3 id="step-6"><span class="pf-num">6</span> 실험 2 · 추론 전략</h3>

<div class="pf-q"><h4>고민</h4><ul><li>가장 확률이 높은 숫자 하나만 고르면 나머지 확률 정보가 버려집니다. 추가 학습 없이 이 정보를 살릴 수 있을까? 여러 번 채점한다면 몇 번이면 충분할까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>확률의 기대값으로 점수를 정하는 기대값 디코딩(ED)은 추가 학습과 추가 추론 없이 Top-1 대비 평균을 0.0066 올렸습니다.</li><li>31번 채점해 평균을 낸 SC-Avg가 평균 <b>0.6271</b>, Overall <b>0.7328</b>로 가장 높았습니다. 평균이 다수결보다 일관되게 좋았습니다.</li><li>채점 횟수는 10번 부근에서 수렴했습니다. 학습에서 얻은 개선과 추론에서 얻은 개선은 서로 겹치지 않고 더해졌습니다.</li></ul></div>

<div class="row"><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/s13_table3.jpg" title="표 5 — 추론 전략별 성능" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">표 5 — 추론 전략별 성능</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/s14_scm.jpg" title="그림 9 — 샘플 수 m에 따른 QWK" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">그림 9 — 샘플 수 m에 따른 QWK</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/s15_edsc.jpg" title="그림 10 — ED와 SC의 루브릭별 개선폭" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">그림 10 — ED와 SC의 루브릭별 개선폭</div></div></div>

<h3 id="step-7"><span class="pf-num">7</span> 통계 검증과 결과</h3>

<div class="pf-a"><h4>내용</h4><ul><li>모든 비교쌍과 루브릭을 paired bootstrap(10,000회)으로 검정했습니다. SC-Avg 대 기준 모델은 8개 루브릭 모두 유의했고(p &lt; 0.001), 효과는 채점자 일치도가 낮은 루브릭에 집중되었습니다.</li><li>한계도 분명합니다. WNTL을 NTL+SAL 위에 더한 효과는 Overall 기준 유의하지 않았고(p = 0.40), 그 기여는 점수 분포의 균형을 회복한 것으로 해석하는 것이 타당합니다.</li><li>피드백 품질은 평가하지 않았고, 여러 번 채점하는 SC는 응답이 느려집니다.</li></ul></div>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>Average QWK · 베이스라인과 최종 (+10.9%)</td><td class="pv">0.5655</td><td class="rs">0.6271</td><td class="nt"></td></tr><tr><td>Overall QWK</td><td class="pv">0.7049</td><td class="rs">0.7328</td><td class="nt"></td></tr><tr><td>문장의 연결성</td><td class="pv">0.3051</td><td class="rs">0.4098</td><td class="nt"></td></tr><tr><td>어휘의 적절성</td><td class="pv">0.3271</td><td class="rs">0.4311</td><td class="nt"></td></tr></tbody></table>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/s16_sig.jpg" title="그림 11 — 비교쌍별·루브릭별 ΔQWK와 유의성" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">그림 11 — 비교쌍별·루브릭별 ΔQWK와 유의성</div></div></div>
