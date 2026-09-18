# 옛 단일 파일 사이트(chat-worker/legacy/index.html)의 데이터를 al-folio 콘텐츠로 변환한다.
# 사용: node ...(sitedata.json 덤프) 후  python3 chat-worker/legacy/gen-alfolio.py /tmp/claude-1000/sitedata.json
import json,sys,os,re,base64,html,shutil
D=json.load(open(sys.argv[1]))
PUBS,PROJECTS,EVENTS,IMG=D['PUBS'],D['PROJECTS'],D['EVENTS'],D['IMG']
os.makedirs('assets/img/pf',exist_ok=True); os.makedirs('assets/img/publication_preview',exist_ok=True)
os.makedirs('_projects',exist_ok=True); os.makedirs('_news',exist_ok=True); os.makedirs('assets/pdf',exist_ok=True)

def save_img(key,data):
    m=re.match(r'data:image/(\w+);base64,(.*)',data,re.S); ext={'jpeg':'jpg','jpg':'jpg','png':'png','gif':'gif','webp':'webp'}[m.group(1)]
    p=f'assets/img/pf/{key}.{ext}'
    if not os.path.exists(p): open(p,'wb').write(base64.b64decode(m.group(2)))
    return p
paths={k:save_img(k,v) for k,v in IMG.items() if k not in ('profile','avatar')}
# 프로필·아바타
for k,name in (('profile','prof_pic.jpg'),('avatar','avatar.jpg')):
    if k in IMG:
        m=re.match(r'data:image/\w+;base64,(.*)',IMG[k],re.S); open('assets/img/'+name,'wb').write(base64.b64decode(m.group(1)))
def esc(s): return html.escape(str(s or ''),quote=False)

def figs(imgs,wide=False):
    if not imgs: return ''
    out=[]
    for im in imgs:
        p=paths.get(im['k']); 
        if not p: continue
        col='col-sm-12' if (im.get('w') or len(imgs)==1) else ('col-sm-6' if len(imgs)>1 else 'col-sm-12')
        style=' style="max-width:420px;margin:0 auto"' if im.get('sm') else ''
        out.append(f'<div class="{col} mt-3 mt-md-0"{style}>{{% include figure.liquid loading="lazy" path="{p}" title="{esc(im.get("c",""))}" class="img-fluid rounded z-depth-1" zoomable=true %}}'+(f'<div class="caption">{esc(im.get("c",""))}</div>' if im.get('c') else '')+'</div>')
    return '<div class="row">'+''.join(out)+'</div>\n'

def stats(nums):
    rows=''.join(f'<tr><td>{esc(n["l"])}</td><td class="pv">{esc(n.get("b") or "—")}</td><td class="rs">{esc(n["a"])}</td><td class="nt">{esc(n.get("note",""))}</td></tr>' for n in nums)
    return f'<table class="stats"><thead><tr><th>지표</th><th>이전</th><th>결과</th><th>비고</th></tr></thead><tbody>{rows}</tbody></table>\n'
def table(t):
    head=''.join(f'<th>{esc(c)}</th>' for c in t[0]); body=''.join('<tr>'+''.join(f'<td>{esc(c)}</td>' for c in r)+'</tr>' for r in t[1:])
    return f'<table class="tbl"><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>\n'

def project_page(kind,it,order):
    pid=f'{kind}-{it["id"]}'
    title=it.get('ko') or it['t'] if kind=='proj' else it['t']
    sub=it['t'] if (kind=='proj' and it.get('ko')) else ''
    ev=next((e for e in EVENTS if e.get('k')==kind and e.get('id')==it['id']),None)
    desc=(ev['sum'] if ev else '')
    cover=paths.get(it.get('cover'),'')
    links=it.get('links') or []
    gh=next((u for n,u in links if 'github.com' in u),'')
    fm=['---','layout: page',f'title: "{title}"',f'description: "{desc.replace(chr(34),"")}"',f'img: {cover}',f'importance: {order}',f'category: {"논문" if kind=="pub" else "프로젝트"}']
    if gh: fm.append(f'github: {gh}')
    fm.append(f'permalink: /projects/{pid}/'); fm.append('---')
    b=[]
    if kind=='pub':
        b.append(f'<div class="pf-meta"><span class="pf-kind">논문{(" · "+esc(it["st"])) if it.get("st") else ""}</span> <b>{esc(it["venue"])}</b> · {esc(it["y"])}{(" · "+esc(it["role"])) if it.get("role") else ""}<br>{esc(it["authors"])}{("<br>"+esc(it["meta"])) if it.get("meta") else ""}</div>')
    else:
        b.append(f'<div class="pf-meta"><span class="pf-kind">프로젝트</span> <b>{esc(it["y"])}</b> · {esc(it["who"])}{(" · "+esc(it["res"])) if it.get("res") else ""}{("<br>"+esc(it["meta"])) if it.get("meta") else ""}</div>')
    if sub: b.append(f'<p class="pf-sub">{esc(sub)}</p>')
    if links:
        b.append('<p class="pf-links">'+' '.join(f'<a class="btn btn-sm z-depth-0" href="{u}" target="_blank" rel="noopener">{esc(n)}</a>' for n,u in links if not u.startswith('papers/'))+(f' <a class="btn btn-sm z-depth-0" href="/assets/pdf/{pid}.pdf" target="_blank">논문 PDF</a>' if any(u.startswith('papers/') for n,u in links) else '')+'</p>')
    if it.get('tags'): b.append('<p class="pf-tags">'+' '.join(f'<span>{esc(t)}</span>' for t in it['tags'])+'</p>')
    b.append('## 개요\n')
    b.append(figs(it['intro'].get('imgs')))
    b.append(f'<div class="pf-intro">{it["intro"]["html"]}</div>\n')
    b.append('## 문제 해결 과정\n')
    steps=it.get('nodes') or []
    b.append('<ol class="pf-steps">'+''.join(f'<li><a href="#step-{i+1}">{esc(n["t"])}</a></li>' for i,n in enumerate(steps))+'</ol>\n')
    for i,n in enumerate(steps):
        b.append(f'<h3 id="step-{i+1}"><span class="pf-num">{i+1}</span> {esc(n["t"])}{(" <small>"+esc(n["s"])+"</small>") if n.get("s") else ""}</h3>\n')
        if n.get('q'): b.append(f'<div class="pf-q"><h4>고민</h4>{n["q"]}</div>\n')
        if n.get('a'): b.append(f'<div class="pf-a"><h4>{"해결" if n.get("q") else "내용"}</h4>{n["a"]}</div>\n')
        if n.get('table'): b.append(table(n['table']))
        if n.get('num'): b.append(stats(n['num']))
        if n.get('imgs'): b.append(figs(n['imgs']))
    open(f'_projects/{pid}.md','w').write('\n'.join(fm)+'\n\n'+'\n'.join(b))
    return pid

order=0; ids=[]
for e in EVENTS:
    if not e.get('k'): continue
    order+=1
    it=next(x for x in (PUBS if e['k']=='pub' else PROJECTS) if x['id']==e['id'])
    ids.append(project_page(e['k'],it,100-order))  # 최신이 먼저 오도록 importance 역순

# ---- publication previews + pdf ----
for p in PUBS:
    if p.get('cover') and p['cover'] in paths: shutil.copy(paths[p['cover']],f'assets/img/publication_preview/pub-{p["id"]}.jpg')
    src=f'papers/pub-{p["id"]}.pdf'
    if os.path.exists(src): shutil.copy(src,f'assets/pdf/pub-{p["id"]}.pdf')

# ---- bib ----
def bibauthors(a): return ' and '.join(x.strip().replace('*','').replace('†','') for x in a.split(','))
ENTRIES={
 'kaes':dict(kind='article',abbr='NLP (CUP)',journal='Natural Language Processing (Cambridge University Press)',year='2026',note='심사 중 (SCI(E), R1 수정본 제출)',selected='true'),
 'tkips':dict(kind='article',abbr='TKIPS',journal='정보처리학회논문지 (The Transactions of the Korea Information Processing Society)',volume='15',number='5',pages='437--441',year='2026',doi='10.3745/TKIPS.2026.15.5.437',selected='true'),
 'feak':dict(kind='inproceedings',abbr='ACM SAC',booktitle="Proceedings of the 41st ACM/SIGAPP Symposium on Applied Computing (SAC '26)",year='2026',doi='10.1145/3748522.3780021',selected='true'),
 'ukta':dict(kind='inproceedings',abbr='ACM SAC',booktitle="Proceedings of the 40th ACM/SIGAPP Symposium on Applied Computing (SAC '25)",year='2025',doi='10.1145/3672608.3707957',selected='true'),
 'hclt':dict(kind='inproceedings',abbr='HCLT',booktitle='제35회 한글 및 한국어 정보처리 학술대회 (HCLT 2023)',year='2023'),
 'kcc':dict(kind='inproceedings',abbr='KCC',booktitle='2023 한국컴퓨터종합학술대회 (KCC 2023)',year='2023'),
 'thesis':dict(kind='mastersthesis',abbr='M.S. Thesis',school='인하대학교 대학원 전기컴퓨터공학과 (인공지능전공)',year='2026',selected='true'),
}
bib=['---','---','']
for p in PUBS:
    m=ENTRIES[p['id']]; key=f'go{m["year"]}{p["id"]}'
    f=[f'@{m["kind"]}{{{key},', f'  abbr = {{{m["abbr"]}}},', f'  bibtex_show = {{true}},', f'  title = {{{p["t"]}}},', f'  author = {{{bibauthors(p["authors"]) if p.get("authors") else "Go, Ganghee"}}},', f'  year = {{{m["year"]}}},']
    for k in ('journal','booktitle','school','volume','number','pages','doi','note'):
        if m.get(k): f.append(f'  {k} = {{{m[k]}}},')
    if m.get('selected'): f.append('  selected = {true},')
    if os.path.exists(f'assets/pdf/pub-{p["id"]}.pdf'): f.append(f'  pdf = {{pub-{p["id"]}.pdf}},')
    if os.path.exists(f'assets/img/publication_preview/pub-{p["id"]}.jpg'): f.append(f'  preview = {{pub-{p["id"]}.jpg}},')
    gh=next((u for n,u in (p.get('links') or []) if 'github.com' in u),None)
    if gh: f.append(f'  code = {{{gh}}},')
    f.append(f'  website = {{/projects/pub-{p["id"]}/}},')
    f.append('}')
    bib.append('\n'.join(f)); bib.append('')
open('_bibliography/papers.bib','w').write('\n'.join(bib))

# ---- news (이정표 + 논문/프로젝트) ----
for fn in os.listdir('_news'): os.remove('_news/'+fn)
for i,e in enumerate(EVENTS):
    d=e['d']; date=f'{d[:4]}-{d[5:7]}-01'
    if e.get('ms'):
        body=e['ms']
    else:
        it=next(x for x in (PUBS if e['k']=='pub' else PROJECTS) if x['id']==e['id'])
        kind='논문' if e['k']=='pub' else '프로젝트'
        body=f'[{kind}] <a href="/projects/{e["k"]}-{it["id"]}/">{it.get("ko") or it["t"]}</a> — {e["sum"]}'
    open(f'_news/{date}-{i:02d}.md','w').write(f'---\nlayout: post\ndate: {date}\ninline: true\nrelated_posts: false\n---\n\n{body}\n')
print('projects',len(ids),'imgs',len(paths))
