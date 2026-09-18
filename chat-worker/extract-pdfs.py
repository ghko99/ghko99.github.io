# 논문 PDF → papers/<id>.pdf (사이트 배포용) + papers/<id>.json (페이지 텍스트, 색인·챗봇 read_paper용)
# 사용: python3 chat-worker/extract-pdfs.py   (저장소 루트에서)
import fitz, json, re, os
PAPERS = {  # 심사 중인 논문(pub-kaes)은 게시하지 않는다. 프로젝트 id: (원본, 사용할 페이지 범위 1-based inclusive 또는 None=전체)
    "pub-ukta":  ("실적들/ukta/3672608.3707957.pdf", None),
    "pub-feak":  ("실적들/feak/3748522.3780021.pdf", None),
    "pub-hclt":  ("실적들/hclt/에세이 자동 평가 모델 성능 향상을 위한 데이터 증강과 전처리.pdf", None),
    "pub-kcc":   ("실적들/kcc/데이터 증강을 이용한 KoBERT기반 에세이 자동평가 성능 향상.pdf", None),
    "pub-tkips": ("실적들/kci/KCI_FI003339100.pdf", None),
}
def clean(t):
    t = t.replace("For Peer Review", "")
    t = re.sub(r"Page \d+ of \d+\s+Cambridge University Press\s+Natural Language Processing", "", t)
    t = re.sub(r"[ \t]+", " ", t); t = re.sub(r"\n{3,}", "\n\n", t)
    return t.strip()
os.makedirs("papers", exist_ok=True)
for pid, (src, rng) in PAPERS.items():
    d = fitz.open(src)
    lo, hi = (1, len(d)) if rng is None else rng
    out = fitz.open()
    out.insert_pdf(d, from_page=lo - 1, to_page=hi - 1)
    out.save(f"papers/{pid}.pdf", garbage=4, deflate=True)
    pages = []
    for i in range(lo - 1, hi):
        t = clean(d[i].get_text())
        if len(t) < 200: continue  # 그림만 있는 쪽
        pages.append({"n": i - lo + 2, "text": t})  # n = 잘라낸 PDF 안에서의 쪽 번호
    json.dump({"id": pid, "pages": pages}, open(f"papers/{pid}.json", "w", encoding="utf-8"), ensure_ascii=False)
    print(f"{pid:10} {hi-lo+1:3}p → {len(pages):3} text pages, {sum(len(p['text']) for p in pages):7,} chars, {os.path.getsize(f'papers/{pid}.pdf')//1024} KB")
