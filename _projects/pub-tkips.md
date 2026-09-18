---
layout: page
title: "다중 목적 학습과 Self-Consistency를 활용한 생성형 LLM의 자동 에세이 채점 성능 최적화"
description: "LLM 하나가 점수와 피드백을 함께 생성합니다. NTL, SAL, Self-Consistency로 QWK를 0.520에서 0.626으로 올렸습니다."
img: assets/img/pf/cov_tkips.jpg
importance: 88
category: 논문
github: https://github.com/ghko99/lora-self-consistency-aes
permalink: /projects/pub-tkips/
---

<div class="pf-meta"><span class="pf-kind">논문 · 게재</span> <b>정보처리학회논문지 (TKIPS) 15(5), 437–441</b> · 2026.05 · 1저자<br>고강희, 김도국<br>AI Hub 서술형 글쓰기 평가 데이터셋 40,006편 · 8개 루브릭 · 회귀 헤드 없이 단일 LLM</div>
<p class="pf-links"><a class="btn btn-sm z-depth-0" href="https://doi.org/10.3745/TKIPS.2026.15.5.437" target="_blank" rel="noopener">DOI</a> <a class="btn btn-sm z-depth-0" href="https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003339100" target="_blank" rel="noopener">KCI</a> <a class="btn btn-sm z-depth-0" href="https://github.com/ghko99/lora-self-consistency-aes" target="_blank" rel="noopener">GitHub</a> <a class="btn btn-sm z-depth-0" href="/assets/pdf/pub-tkips.pdf" target="_blank">논문 PDF</a></p>
<p class="pf-tags"><span>Llama 3.1-8B</span> <span>LoRA</span> <span>Number Token Loss</span> <span>Semantic Alignment Loss</span> <span>Self-Consistency</span></p>
## 개요

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/t0_framework.jpg" title="왼쪽은 CE·NTL·SAL 다중 목적 학습, 오른쪽은 여러 번 생성한 점수를 평균하는 Self-Consistency 추론" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">왼쪽은 CE·NTL·SAL 다중 목적 학습, 오른쪽은 여러 번 생성한 점수를 평균하는 Self-Consistency 추론</div></div></div>

<div class="pf-intro"><p>기존 채점 모델은 점수는 잘 맞히지만 피드백을 만들지 못하고, 생성형 LLM은 점수를 <b>텍스트 토큰</b>으로 다루기 때문에 점수 사이의 순서와 거리를 배우지 못하며 실행할 때마다 결과가 달라집니다. 이 연구는 하나의 LLM이 루브릭별 점수와 피드백을 함께 생성하도록 하되, 학습에는 세 가지 손실을, 추론에는 Self-Consistency를 결합해 두 문제를 동시에 다뤘습니다.</p></div>

## 문제 해결 과정

<ol class="pf-steps"><li><a href="#step-1">점수와 피드백의 통합 생성</a></li><li><a href="#step-2">Number Token Loss</a></li><li><a href="#step-3">Semantic Alignment Loss</a></li><li><a href="#step-4">Self-Consistency</a></li><li><a href="#step-5">결과</a></li></ol>

<h3 id="step-1"><span class="pf-num">1</span> 점수와 피드백의 통합 생성</h3>

<div class="pf-q"><h4>고민</h4><ul><li>점수만 내는 판별 모델은 그 점수의 근거를 말하지 못합니다. 점수와 피드백을 한 모델이 함께 낼 수는 없을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>Llama 3.1-8B를 LoRA(일부 가중치만 추가 학습하는 방식)로 미세조정했습니다. 입력은 에세이와 채점 기준(루브릭), 출력은 8개 루브릭의 점수와 각 루브릭에 대한 피드백입니다.</li><li>점수를 먼저 생성하고 피드백을 이어서 생성하게 해서, 피드백이 점수와 어긋나지 않도록 했습니다.</li></ul></div>

<h3 id="step-2"><span class="pf-num">2</span> Number Token Loss</h3>

<div class="pf-q"><h4>고민</h4><ul><li>정답이 4점일 때, 3점으로 예측한 것과 9점으로 예측한 것을 같은 오류로 보는 손실 함수로 점수의 순서를 가르칠 수 있을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>모델이 각 숫자에 매긴 확률로 기대 점수를 구하고, 정답과의 차이를 손실에 더했습니다(Number Token Loss). 점수가 서로 무관한 글자가 아니라, 순서와 거리가 있는 수치로 학습됩니다.</li></ul></div>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>평균 QWK · CE만 적용한 경우와 NTL 추가</td><td class="pv">0.520</td><td class="rs">0.593</td><td class="nt"></td></tr></tbody></table>

<h3 id="step-3"><span class="pf-num">3</span> Semantic Alignment Loss</h3>

<div class="pf-q"><h4>고민</h4><ul><li>피드백이 정답 문장의 표현을 그대로 따라 하는 겉핥기 학습을 어떻게 막을 수 있을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>정답 피드백과 예측 피드백의 뜻이 가까울수록 손실이 작아지도록 정의했습니다(Semantic Alignment Loss, 의미 벡터의 코사인 유사도 사용). 정답을 베끼는 대신 루브릭의 뜻을 배우도록 유도합니다.</li><li>세 손실은 크기가 다르므로, 기본 손실(CE)의 크기에 맞춰 보조 손실의 가중치를 매 학습 단계마다 자동으로 조정했습니다. 가중치를 손으로 맞출 필요가 없습니다.</li></ul></div>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>평균 QWK · SAL 추가</td><td class="pv">0.593</td><td class="rs">0.611</td><td class="nt"></td></tr></tbody></table>

<h3 id="step-4"><span class="pf-num">4</span> Self-Consistency</h3>

<div class="pf-q"><h4>고민</h4><ul><li>같은 에세이를 넣어도 실행할 때마다 점수가 달라집니다. 이 변동을 어떻게 줄일까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>같은 에세이를 여러 번 채점하고 결과를 모았습니다. 가장 많이 나온 점수를 고르는 다수결보다 점수의 평균이 더 좋았습니다.</li><li>점수가 순서를 가진 수치이기 때문입니다.</li><li>채점 횟수를 늘리면 성능이 오르다가 일정 횟수 이후에는 상승폭이 줄어듭니다.</li></ul></div>

<table class="tbl"><thead><tr><th>추론 방식</th><th>평균 QWK</th></tr></thead><tbody><tr><td>Greedy Top-1</td><td>0.611</td></tr><tr><td>Greedy Weighted</td><td>0.614</td></tr><tr><td>Self-Consistency Vote</td><td>0.616</td></tr><tr><td>Self-Consistency Average</td><td>0.626</td></tr></tbody></table>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/t1_sc.jpg" title="샘플 수에 따른 QWK" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">샘플 수에 따른 QWK</div></div></div>

<h3 id="step-5"><span class="pf-num">5</span> 결과</h3>

<div class="pf-a"><h4>내용</h4><ul><li>기본 손실(CE)만 썼을 때 평균 QWK <b>0.520</b>이던 것이 NTL로 <b>0.593</b>, SAL로 <b>0.611</b>, Self-Consistency로 <b>0.626</b>까지 올랐습니다. 회귀 헤드 기반 기준 모델(0.581)을 넘었습니다.</li><li>별도의 회귀 헤드 없이 LLM 하나로 점수와 피드백을 함께 얻었습니다.</li><li>피드백이 실제로 얼마나 유용한지에 대한 전문가·사용자 평가는 후속 과제로 남겼습니다.</li></ul></div>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>평균 QWK · 베이스라인과 최종</td><td class="pv">0.581</td><td class="rs">0.626</td><td class="nt"></td></tr></tbody></table>
