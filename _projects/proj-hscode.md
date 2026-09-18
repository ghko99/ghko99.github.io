---
layout: page
title: "디지털 포워딩 기업 매칭 앱 InhaTrade"
description: "11,000개 HSCODE를 Sentence-Transformers 유사도로 추천했습니다. 정확도 82%, DeepL로 4개 언어를 지원했습니다."
img: assets/img/pf/h0_hero.jpg
importance: 97
category: 프로젝트
github: https://github.com/ghko99/Hscode
permalink: /projects/proj-hscode/
---

<div class="pf-meta"><span class="pf-kind">프로젝트</span> <b>2023.09 – 12</b> · 3인 Capstone · AI/ML · 다국어 담당 · 추천 정확도 82% · 4개 언어<br>인하대학교 SW중심대학사업단 캡스톤 · 김창우(Frontend) · 정여진(Backend) · 고강희(AI/ML, 다국어)</div>
<p class="pf-sub">HSCODE 자동 추천 시스템</p>
<p class="pf-links"><a class="btn btn-sm z-depth-0" href="https://github.com/ghko99/Hscode" target="_blank" rel="noopener">GitHub · Hscode</a> <a class="btn btn-sm z-depth-0" href="https://github.com/InhaTrade" target="_blank" rel="noopener">InhaTrade</a></p>
<p class="pf-tags"><span>Sentence-Transformers all-MiniLM-L6-v2</span> <span>Cosine Similarity</span> <span>Selenium</span> <span>DeepL API</span> <span>Django REST</span></p>
## 개요

<div class="row"><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/h0_hero.jpg" title="InhaTrade 앱" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">InhaTrade 앱</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/h_app.jpg" title="HSCODE 추천 화면" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">HSCODE 추천 화면</div></div></div>

<div class="pf-intro"><p>수출 기업과 포워딩 기업을 연결하는 모바일 매칭 플랫폼입니다. 통관을 위해 <b>11,000개가 넘는 HSCODE</b> 중 알맞은 코드를 찾는 번거로운 작업을 AI 추천으로 줄이고, DeepL로 4개 언어를 지원했습니다.</p></div>

## 문제 해결 과정

<ol class="pf-steps"><li><a href="#step-1">기존 접근 검토</a></li><li><a href="#step-2">BERT 분류 시도</a></li><li><a href="#step-3">하이브리드 검토</a></li><li><a href="#step-4">최종 · 임베딩 추천</a></li><li><a href="#step-5">데이터와 시스템</a></li><li><a href="#step-6">성능</a></li><li><a href="#step-7">다국어 지원</a></li><li><a href="#step-8">회고</a></li></ol>

<h3 id="step-1"><span class="pf-num">1</span> 기존 접근 검토</h3>

<div class="pf-q"><h4>고민</h4><ul><li>문자열 검색으로는 비슷한 품목을 추천할 수 없습니다. 기존 연구는 무엇을 놓치고 있을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>KCC 2019 논문의 Word2vec, TF-IDF, 코사인 유사도 방식을 분석했습니다.</li><li>관세청의 정의 데이터만 사용해 실제 품목 분류 사례가 반영되지 않는다는 한계를 확인했습니다.</li></ul></div>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0" style="max-width:420px;margin:0 auto">{% include figure.liquid loading="lazy" path="assets/img/pf/h1_prior.png" title="기존 연구의 HS코드 추출 과정 (KCC 2019) — 형태소 분석 → 단어 임베딩 → TF-IDF → 코사인 유사도" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">기존 연구의 HS코드 추출 과정 (KCC 2019) — 형태소 분석 → 단어 임베딩 → TF-IDF → 코사인 유사도</div></div></div>

<h3 id="step-2"><span class="pf-num">2</span> BERT 분류 시도</h3>

<div class="pf-q"><h4>고민</h4><ul><li>11,000개 HSCODE를 정답 라벨로 하는 분류 모델을 학습할 수 있을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>라벨이 너무 많아 학습이 어려웠습니다.</li><li>HCLT 2022의 단계별 분류(류 → 호 → 소호)도 검토했지만, BERT 세 개를 차례로 실행해야 해서 자원이 지나치게 많이 들었습니다.</li></ul></div>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/h2_bert.jpg" title="BERT 기반 Classification" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">BERT 기반 Classification</div></div></div>

<h3 id="step-3"><span class="pf-num">3</span> 하이브리드 검토</h3>

<div class="pf-q"><h4>고민</h4><ul><li>BERT로 앞 2자리(류)만 분류하고, 그 안에서 유사도로 추천하면 어떨까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>BERT의 분류 정확도가 80% 수준에 그쳤습니다. 첫 분류가 틀리면 전체 추천이 틀리므로 이 방식은 채택하지 않았습니다.</li></ul></div>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/h3_hybrid.jpg" title="하이브리드 접근" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">하이브리드 접근</div></div></div>

<h3 id="step-4"><span class="pf-num">4</span> 최종 · 임베딩 추천</h3>

<div class="pf-a"><h4>내용</h4><ul><li>관세청 공식 정의와 실제 품목 분류 사례를 합쳐 데이터를 만들었습니다.</li><li>문장 임베딩 모델(Sentence-Transformers)로 유사도 검색에 맞는 성능을 확보했습니다. 모델은 단순하게 유지하면서 실무 사례를 반영합니다.</li></ul></div>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/h4_final.jpg" title="강화된 Embedding 기반 추천" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">강화된 Embedding 기반 추천</div></div></div>

<h3 id="step-5"><span class="pf-num">5</span> 데이터와 시스템</h3>

<div class="pf-a"><h4>내용</h4><ul><li>관세법령정보포털을 Selenium으로 수집해 HSCODE와 품명 쌍 <b>51,000개</b>를 구축했습니다.</li><li>품명을 all-MiniLM-L6-v2로 벡터화해 저장하고, 사용자 입력도 같은 방식으로 바꿔 코사인 유사도로 상위 10개를 추천합니다.</li><li>Django REST로 API를 제공했습니다.</li></ul></div>

<div class="row"><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/h5_data.jpg" title="데이터 수집과 전처리" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">데이터 수집과 전처리</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/h6_embed.jpg" title="Embedding 생성과 추천" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">Embedding 생성과 추천</div></div></div>

<h3 id="step-6"><span class="pf-num">6</span> 성능</h3>

<div class="pf-a"><h4>내용</h4><ul><li>정확도 <b>82%</b>(상위 10개 안에 정답 포함), 앞 4자리(호) 일치율 <b>91%</b>입니다.</li><li>평균 추론 시간은 1.5~2초로 요구사항인 3초 이내를 충족했습니다.</li><li>"Samsung galaxy tab"에는 8471호를 정확히 추천했고, "Drone"에는 장난감, 무인기, 항공기 등 관련성 높은 코드를 제시했습니다.</li></ul></div>

<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody><tr><td>Top-10 정확도</td><td class="pv">—</td><td class="rs">82%</td><td class="nt"></td></tr><tr><td>앞 4자리 일치율</td><td class="pv">—</td><td class="rs">91%</td><td class="nt"></td></tr></tbody></table>

<div class="row"><div class="col-sm-12 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/h7_eval.jpg" title="성능 평가" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">성능 평가</div></div></div>

<h3 id="step-7"><span class="pf-num">7</span> 다국어 지원</h3>

<div class="pf-q"><h4>고민</h4><ul><li>무역 서비스에서 다국어는 필수입니다. 기존 물류 서비스의 Google Translate 번역은 부자연스럽습니다.</li><li>프론트엔드와 효율적으로 연동하려면 어떤 구조가 좋을까?</li></ul></div>

<div class="pf-a"><h4>해결</h4><ul><li>2023년 8월 한국어 지원을 시작한 DeepL Pro를 채택해 한국어, 영어, 일본어, 중국어를 지원했습니다.</li><li>프론트엔드의 모든 문구가 ko.json 한 파일로 관리되는 구조를 파악했습니다.</li><li>DeepL API로 JSON을 JSON으로 자동 번역하는 도구를 만들어 en, ja, zh 파일을 생성하고 실시간 언어 전환을 구현했습니다.</li></ul></div>

<div class="row"><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/h8_deepl.jpg" title="번역 API 선택" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">번역 API 선택</div></div><div class="col-sm-6 mt-3 mt-md-0">{% include figure.liquid loading="lazy" path="assets/img/pf/h9_i18n.jpg" title="자동 번역 도구" class="img-fluid rounded z-depth-1" zoomable=true %}<div class="caption">자동 번역 도구</div></div></div>

<h3 id="step-8"><span class="pf-num">8</span> 회고</h3>

<div class="pf-a"><h4>내용</h4><ul><li>GPU 서버가 없어 클라우드 배포를 마치지 못했습니다. HSCODE 실시간 업데이트 자동화와 견적 수정·삭제 일부 기능도 미완성으로 남았습니다.</li><li>다음 과제로 도메인 특화 파인튜닝, HSCODE 변경 이력 추적, GPU 환경에서의 API 서비스화, 사용자 피드백 기반 추천 개선을 정리했습니다.</li></ul></div>
