// RAG 색인용 청크를 만든다: 사이트의 논문·프로젝트 상세 내용 + 프로젝트에 연결된 GitHub 저장소의 코드·문서.
// 사용: node build-index.mjs <repos-dir> [out.jsonl]   → 청크 JSONL 출력. 업로드는 upload-index.mjs.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, extname, basename } from "node:path";
import { createHash } from "node:crypto";

const REPOS_DIR = process.argv[2] || "../../repos";
const OUT = process.argv[3] || "dist/chunks.jsonl";
const OWNER = "ghko99";
const MAX_CHUNK = 1500;      // 글자 수. bge-m3 입력 한도 안에서 검색 정확도가 좋은 크기
const CODE_WIN = 60, CODE_STEP = 48; // 코드 파일: 60줄 창, 12줄 겹침

// ---------- 사이트 데이터 ----------
const page = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const js = page.match(/<script>([\s\S]*)<\/script>/)[1].replace(/^const IMG = .*$/m, "const IMG={};").split("/* ---------- detail")[0];
const stub = "const document={getElementById:()=>({innerHTML:\"\",querySelectorAll:()=>[]}),querySelectorAll:()=>[],addEventListener(){}};const IntersectionObserver=class{observe(){}unobserve(){}};const setTimeout=()=>{};const window={addEventListener(){}};const location={hash:\"\"};const history={};";
const { PUBS, PROJECTS } = new Function(stub + js + ";return {PUBS,PROJECTS};")();
const strip = s => String(s || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const chunks = [];
const id = (...k) => createHash("sha1").update(k.join("\u0000")).digest("hex").slice(0, 24);
// text: 모델에 보여줄 본문. emb: 임베딩에 쓸 문자열(없으면 text). 저장소 청크는 긴 설명 머리말이 검색을 흐리므로 경로+본문만 임베딩한다.
function add(text, meta, emb) {
  text = text.trim(); if (!text) return;
  const c = { id: id(meta.src, meta.url || "", meta.path || "", meta.l1 || 0, text.slice(0, 80)), text, meta };
  if (emb) c.emb = emb.trim();
  chunks.push(c);
}

for (const [kind, list] of [["pub", PUBS], ["proj", PROJECTS]]) {
  for (const p of list) {
    const title = p.t + (p.ko ? " / " + p.ko : "");
    const url = `https://ghko99.github.io/#${kind}-${p.id}`;
    const head = kind === "pub"
      ? `${p.venue}, ${p.y}, ${p.role || "학위논문"}, 저자 ${p.authors}, 상태 ${p.st}. ${p.meta || ""}`
      : `${p.y}, ${p.who}${p.res ? ", 성과: " + p.res : ""}. 기술: ${(p.tags || []).join(", ")}. ${p.meta || ""}`;
    const links = (p.links || []).map(l => l[0] + " " + l[1]).join(", ");
    add(`[${title}] ${head} 개요: ${strip(p.intro.html)}${links ? " 링크: " + links : ""}`, { src: "site", title, url });
    for (const n of p.nodes || []) {
      let t = `[${title}] 문제 해결 과정 — ${n.t}${n.s ? " (" + n.s + ")" : ""}. `;
      if (n.q) t += "고민: " + strip(n.q) + " ";
      if (n.a) t += "해결: " + strip(n.a) + " ";
      if (n.table) t += "표: " + n.table.map(r => r.join(" | ")).join(" / ") + " ";
      if (n.num) t += "수치: " + n.num.map(x => x.l + " " + (x.b ? x.b + "에서 " : "") + x.a).join(", ");
      add(t, { src: "site", title, url, step: n.t });
    }
  }
}
const siteCount = chunks.length;

// ---------- 저장소 ----------
// 논문·프로젝트에 실제로 연결된 저장소만. (build-context.mjs의 연결표와 같음)
const REPOS = {
  "Korean-Text-Data-Augmentation": "KAES 저널 논문 · HCLT 2023 · AI-Hub 데이터 구축",
  "aes_data_augment": "KCC 2023 논문",
  "lora-self-consistency-aes": "TKIPS 논문 (LoRA + Self-Consistency)",
  "aes-ukta-exp": "UKTA 논문 · U-KTA 과제",
  "essay-agent": "석사논문 · 글결(Geulgyeol) 서비스",
  "aes-llm-training": "석사논문 학습 코드",
  "essay_scoring_llm": "석사논문 채점 코드",
  "kanana-wntl-14all-strategy-comparison": "석사논문 실험 (Kanana WNTL 전략 비교)",
  "aichipcon_AIF_sLLM": "LH 청약 챗봇 · AI 반도체 기술인재 선발대회",
  "Hscode": "HSCODE 자동 추천",
  "cosmetics-oem-erp-prototype": "화장품 OEM ERP · Upflow",
};
const SKIP_DIR = /^(\.git|node_modules|__pycache__|\.venv|venv|env|dist|build|\.next|checkpoints?|outputs?|results?|logs?|wandb|runs|data|datasets?|\.idea|\.vscode|\.wrangler)$/i;
const TEXT_EXT = new Set([".py", ".md", ".ipynb", ".js", ".ts", ".tsx", ".jsx", ".sh", ".yaml", ".yml", ".toml", ".txt", ".jinja", ".html", ".cfg", ".ini", ".sql"]);
const SKIP_PATH = /(sentence_transformers|site-packages|third_party|vendor|korcat_core\/apps\/cohesion)\//i;
const SKIP_FILE = /(^\.env|\.lock$|-lock\.ya?ml$|package-lock\.json$|yarn\.lock$|\.min\.(js|css)$|^LICENSE|\.pyc$)/i;
const DATA_TXT = /\.(txt)$/i; // .txt는 requirements 같은 작은 것만

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name); const st = statSync(p);
    if (st.isDirectory()) { if (!SKIP_DIR.test(name)) walk(p, out); continue; }
    if (SKIP_FILE.test(name)) continue;
    const ext = extname(name).toLowerCase();
    if (!TEXT_EXT.has(ext) && !/^readme/i.test(name)) continue;
    if (st.size > 200 * 1024) continue;
    if (DATA_TXT.test(name) && st.size > 8 * 1024) continue;
    out.push(p);
  }
  return out;
}
function isDataLike(text) { // 데이터 덤프(긴 줄, 숫자·구분자 위주)는 뺀다
  const lines = text.split("\n");
  const long = lines.filter(l => l.length > 400).length;
  return long > lines.length * 0.3;
}
function byLines(text, win, step) {
  const lines = text.split("\n"); const out = [];
  for (let s = 0; s < lines.length; s += step) {
    let e = Math.min(lines.length, s + win);
    let body = lines.slice(s, e).join("\n");
    while (body.length > MAX_CHUNK * 2 && e - s > 8) { e = s + Math.floor((e - s) / 2); body = lines.slice(s, e).join("\n"); }
    out.push({ l1: s + 1, l2: e, body });
    if (e >= lines.length) break;
  }
  return out;
}
function byHeadings(text) { // 마크다운: 제목 단위로 나누고 길면 다시 자른다
  const parts = text.split(/\n(?=#{1,4} )/); const out = [];
  let l = 1;
  for (const part of parts) {
    const n = part.split("\n").length;
    if (part.length <= MAX_CHUNK) out.push({ l1: l, l2: l + n - 1, body: part });
    else for (const c of byLines(part, 40, 34)) out.push({ l1: l + c.l1 - 1, l2: l + c.l2 - 1, body: c.body });
    l += n;
  }
  return out;
}
function notebook(text) {
  let nb; try { nb = JSON.parse(text); } catch { return []; }
  const out = []; let i = 0;
  for (const c of nb.cells || []) {
    i++; const src = (Array.isArray(c.source) ? c.source.join("") : c.source || "").trim();
    if (!src) continue;
    const tag = c.cell_type === "markdown" ? "markdown" : "code";
    for (const ch of byLines(src, 50, 44)) out.push({ l1: i, l2: i, body: `# cell ${i} (${tag})\n${ch.body}`, cell: true });
  }
  return out;
}

let repoCount = 0;
for (const [repo, about] of Object.entries(REPOS)) {
  const dir = join(REPOS_DIR, repo);
  if (!existsSync(dir)) { console.error("missing repo:", repo); continue; }
  let branch = "main";
  try { branch = readFileSync(join(dir, ".git", "HEAD"), "utf8").trim().replace("ref: refs/heads/", ""); } catch {}
  for (const file of walk(dir)) {
    const rel = relative(dir, file).split("\\").join("/");
    if (SKIP_PATH.test(rel + "/")) continue;
    const text = readFileSync(file, "utf8");
    if (!text.trim() || isDataLike(text)) continue;
    const ext = extname(file).toLowerCase();
    const pieces = ext === ".ipynb" ? notebook(text) : ext === ".md" || /^readme/i.test(basename(file)) ? byHeadings(text) : byLines(text, CODE_WIN, CODE_STEP);
    for (const c of pieces) {
      const url = `https://github.com/${OWNER}/${repo}/blob/${branch}/${rel}` + (c.cell ? "" : `#L${c.l1}-L${c.l2}`);
      const header = `저장소 ${repo} (${about}) · 파일 ${rel}` + (c.cell ? ` · 셀 ${c.l1}` : ` · ${c.l1}–${c.l2}줄`);
      add(`${header}\n${c.body}`, { src: "repo", repo, path: rel, l1: c.l1, l2: c.l2, url }, `${repo}/${rel}\n${c.body}`);
      repoCount++;
    }
  }
}

// 중복 id 제거
const seen = new Set(); const uniq = chunks.filter(c => !seen.has(c.id) && seen.add(c.id));
writeFileSync(OUT, uniq.map(c => JSON.stringify(c)).join("\n") + "\n");
const bytes = uniq.reduce((a, c) => a + Buffer.byteLength(c.text), 0);
console.log(`site ${siteCount} + repo ${repoCount} = ${uniq.length} chunks, ${(bytes / 1024).toFixed(0)} KB → ${OUT}`);
