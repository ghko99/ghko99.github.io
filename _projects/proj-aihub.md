---
layout: page
title: "20억 어절 말뭉치 · LLaMA 기반 13B/33B/65B 공개"
description: "20억 어절 말뭉치 과제에서 일상어 8.6억 어절의 증강과 품질 검증을 맡았습니다."
img: assets/img/pf/a1_left.jpg
importance: 98
category: 프로젝트
github: https://github.com/ghko99/Korean-Text-Data-Augmentation
permalink: /projects/proj-aihub/
---

<div class="pf-meta"><span class="pf-kind">프로젝트</span> <b>2023.07 – 12</b> · 컨소시엄 · 인하대 산학협력단 · 데이터 증강 파이프라인 담당 · AI-Hub 데이터 개방<br>2023 인공지능 학습용 데이터 구축 지원 사업 · DGIST(주관) · 유니바 · 빅웨이브에이아이 · 인하대(일상어 8.6억 어절)</div>
<p class="pf-sub">한국어 성능이 개선된 초거대 AI 언어모델 데이터 구축</p>
<p class="pf-links"><a class="btn btn-sm z-depth-0" href="https://aihub.or.kr/aihubdata/data/view.do?dataSetSn=71748" target="_blank" rel="noopener">AI-Hub</a> <a class="btn btn-sm z-depth-0" href="https://github.com/ghko99/Korean-Text-Data-Augmentation" target="_blank" rel="noopener">GitHub</a> <a class="btn btn-sm z-depth-0" href="https://www.imaeil.com/page/view/2023090511035624997" target="_blank" rel="noopener">기사</a> <a class="btn btn-sm z-depth-0" href="https://youtu.be/1UDKG9dq8Rw" target="_blank" rel="noopener">교육 영상</a></p>
<p class="pf-tags"><span>T5</span> <span>klue/bert-base</span> <span>KoElectra</span> <span>KR-SBERT</span> <span>Selenium</span> <span>py-hanspell</span></p>
## 개요

<div class="row"><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/a1_left.jpg" title="과제 개요" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">과제 개요</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/a2_right.jpg" title="AI-Hub 공개 데이터" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">AI-Hub 공개 데이터</div></div></div>

<div class="pf-intro"><p>기존에 공개된 한국어 데이터는 뉴스와 댓글에 치우쳐 있었고, 고성능 모델과 데이터는 비공개인 경우가 많았습니다. 전문어 57%와 일상어 43%로 이루어진 <b>20억 어절</b> 말뭉치를 구축하고 LLaMA 기반 13B, 33B, 65B 모델을 공개하는 과제에서, 인하대학교 파트인 <b>일상어 8.6억 어절</b>의 수집, 증강, 품질 검증을 맡았습니다.</p></div>

## 문제 해결 과정

<ol class="pf-steps"><li><a href="#step-1">역번역 파이프라인</a></li><li><a href="#step-2">MLM과 T5 증강</a></li><li><a href="#step-3">품질 검증 자동화</a></li><li><a href="#step-4">성과</a></li></ol>

<h3 id="step-1"><span class="pf-num">1</span> 역번역 파이프라인</h3>

<div class="pf-q"><h4>고민</h4><ul><li>8.6억 어절을 상용 번역 API로 왕복 번역하면 수만 달러가 듭니다. 무료 라이브러리는 품질이 낮고 웹 자동화는 불안정합니다.</li><li>비용, 품질, 안정성을 동시에 잡을 방법이 있을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>상용 API의 예상 비용을 계산해 사용할 수 없다는 결론을 내렸습니다.</li><li>무료 라이브러리(py-googletrans)는 실제 데이터로 확인한 결과 원문의 뜻이 많이 훼손되어 제외했습니다.</li><li>파파고를 웹 자동화(Selenium)한 시제품은 품질은 좋았으나 대규모 처리에서 불안정했습니다.</li><li>한국어→영어는 고품질 유료 API로, 영어→한국어는 HuggingFace 번역 모델로 처리하는 혼합 전략을 제시했습니다.</li></ul></div>

<h3 id="step-2"><span class="pf-num">2</span> MLM과 T5 증강</h3>

<div class="pf-q"><h4>고민</h4><ul><li>klue/bert-base를 추가 학습하는 MLM 방식은 1 epoch에 3시간 30분이 걸립니다. 대규모 데이터에도 쓸 수 있는 증강은 어떻게 만들까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>추가 학습 대신 대규모 사전학습 언어모델을 그대로 쓰고, 자연스러운 문장이 나오도록 후보 단어를 고르는 코드를 개선해 속도를 크게 줄였습니다.</li><li>T5 모델을 묶음(배치) 단위로 처리하는 코드를 만들어 GitHub에 공개했습니다.</li><li>전문어 8,483만 어절을 약 9.5시간에 증강해 대규모 처리 성능과 품질을 확인했습니다.</li></ul></div>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>T5 · 8,400만 어절 처리 시간</td><td class="pv">—</td><td class="rs">9.5시간</td><td class="nt"></td></tr><tr><td>MLM · 6,700만 어절 처리 시간</td><td class="pv">—</td><td class="rs">12시간</td><td class="nt"></td></tr></tbody></table>

<h3 id="step-3"><span class="pf-num">3</span> 품질 검증 자동화</h3>

<div class="pf-q"><h4>고민</h4><ul><li>MLM 결과 일부에 띄어쓰기와 문법 오류가 생깁니다. 네이버 맞춤법 검사기는 공식 API가 없고 py-hanspell은 오류로 쓸 수 없습니다.</li><li>증강 결과가 원본과 거의 같은 경우는 어떻게 골라낼까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>MLM으로 1차 증강 → 맞춤법 검사기로 오류 문장 걸러내기 → T5로 교정, 이렇게 3단계 파이프라인을 설계했습니다.</li><li>네이버 맞춤법 검사기 웹 페이지를 Selenium으로 직접 자동화했습니다. 정상 문장을 MLM으로 증강하면 10~15%는 교정이 필요했습니다.</li><li>문장 유사도(KR-SBERT)로 뜻이 중복되는 데이터를 제거했습니다. 이 과정에서 유사도가 1.0인 데이터 446건을 발견해, 앞 단계인 문장 분리(kiwi)의 오류를 거꾸로 찾아냈습니다.</li></ul></div>

<h3 id="step-4"><span class="pf-num">4</span> 성과</h3>

<div class="pf-a"><h4>내용</h4><ul><li>역번역, MLM, T5 증강 파이프라인을 설계하고 성능을 검증했습니다.</li><li>문장 유사도와 맞춤법 검사를 결합한 품질 자동 검증 절차를 만들었습니다.</li><li>인하대학교 몫인 <b>8.6억 어절</b> 일상어 데이터셋 구축에 핵심적으로 기여했고, 최종 20억 어절 말뭉치는 AI-Hub에 공개되었습니다.</li></ul></div>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>일상어 데이터 · 인하대 담당</td><td class="pv">—</td><td class="rs">8.6억 어절</td><td class="nt"></td></tr></tbody></table>
