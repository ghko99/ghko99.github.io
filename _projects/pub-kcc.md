---
layout: page
title: "데이터 증강을 이용한 KoBERT 기반 에세이 자동 평가 성능 향상"
description: "학부연구생 시절의 첫 논문입니다. 글의 Topic과 Type 정보를 넣는 증강으로 Kappa를 0.795에서 0.826으로 올렸습니다."
img: assets/img/pf/cov_kcc.jpg
importance: 99
category: 논문
github: https://github.com/ghko99/aes_data_augment
permalink: /projects/pub-kcc/
---

<div class="pf-meta"><span class="pf-kind">논문 · 게재</span> <b>2023 한국컴퓨터종합학술대회 (KCC 2023)</b> · 2023.06 · 1저자<br>고강희, 김도국<br>학부연구생 시절의 첫 논문 · AI-HUB 에세이 50,400편 · 11개 루브릭</div>
<p class="pf-links"><a class="btn btn-sm z-depth-0" href="https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11488531" target="_blank" rel="noopener">DBpia</a> <a class="btn btn-sm z-depth-0" href="https://github.com/ghko99/aes_data_augment" target="_blank" rel="noopener">GitHub</a> <a class="btn btn-sm z-depth-0" href="/assets/pdf/pub-kcc.pdf" target="_blank">논문 PDF</a></p>
<p class="pf-tags"><span>KoBERT + GRU</span> <span>LSTM + Word2Vec</span> <span>Topic/Type 삽입</span></p>
## 개요

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/kc0_overview.jpg" title="데이터 증강을 활용한 AES 모델 개요" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">데이터 증강을 활용한 AES 모델 개요</div></div></div>

<div class="pf-intro"><p>글의 Topic과 Type 정보를 데이터에 삽입하는 증강으로 KoBERT 채점기의 일치도를 한 단계 끌어올린 첫 연구입니다.</p></div>

## 문제 해결 과정

<ol class="pf-steps"><li><a href="#step-1">모델 선택</a></li><li><a href="#step-2">Topic과 Type 삽입</a></li><li><a href="#step-3">결과</a></li></ol>

<h3 id="step-1"><span class="pf-num">1</span> 모델 선택</h3>

<div class="pf-q"><h4>고민</h4><ul><li>KoBERT 기반과 LSTM 기반 중 어느 쪽을 출발점으로 삼아야 할까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>AI-Hub가 제공한 KoBERT + GRU와 LSTM + Word2Vec을 비교했습니다. 일치도(Kappa)가 0.7947 대 0.7870으로 KoBERT 기반이 높아 이쪽을 선택했습니다.</li></ul></div>

<h3 id="step-2"><span class="pf-num">2</span> Topic과 Type 삽입</h3>

<div class="pf-q"><h4>고민</h4><ul><li>어떤 정보를, 어느 위치에 넣어야 할까? 한국어 에세이의 41%가 10문장 이하인데, 너무 자주 넣으면 어떻게 될까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>넣는 정보는 세 가지입니다. Type 2(논술형, 수필형), Type 5(주장, 찬반, 대안, 설명, 글짓기), Topic 50(주제 50개).</li><li>넣는 간격은 1문장마다부터 5문장마다까지 다섯 가지입니다. 정보 3가지 × 간격 5가지, 총 15가지 조합을 비교했습니다.</li><li>"[학습과 여가활동] 저는 학습시간이 5시간…"과 같은 형태입니다.</li></ul></div>

<h3 id="step-3"><span class="pf-num">3</span> 결과</h3>

<div class="pf-a"><h4>내용</h4><ul><li>Topic 50을 매 문장마다 넣었을 때 QWK <b>0.8255</b>, Pearson 0.8357로 가장 높았습니다. 15가지 조합 모두 기준 모델을 넘었고 모두 0.8 이상이었습니다.</li><li>정보가 세분화될수록(Topic 50, Type 5, Type 2 순) 효과가 컸습니다. 일치도 등급이 Substantial에서 Almost Perfect로 한 단계 올랐습니다.</li></ul></div>

<table class="tbl"><thead><tr><th>설정</th><th>Kappa</th><th>Pearson</th></tr></thead><tbody><tr><td>Baseline 2 (LSTM)</td><td>0.7870</td><td>0.8062</td></tr><tr><td>Baseline 1 (KoBERT)</td><td>0.7947</td><td>0.8152</td></tr><tr><td>Type 2 · Line 5</td><td>0.8118</td><td>0.8174</td></tr><tr><td>Type 5 · Line 3</td><td>0.8144</td><td>0.8240</td></tr><tr><td>Topic 50 · Line 1</td><td>0.8255</td><td>0.8357</td></tr></tbody></table>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>Kappa</td><td class="pv">0.7947</td><td class="rs">0.8255</td><td class="nt"></td></tr></tbody></table>
