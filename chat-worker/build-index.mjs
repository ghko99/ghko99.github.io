// RAG 색인 빌더 (v2)
//  1) index.html에서 논문·프로젝트를 읽어 프로젝트 레지스트리(src/registry.js)를 만든다 — 에이전트가 검색 범위를 고를 때 쓰는 목록.
//  2) 사이트 상세 내용(단계별 고민/해결/표/수치)을 청크로 만든다.
//  3) 연결된 저장소의 파일마다 LLM 요약을 붙여(워커 /__index summarize, 캐시: dist/summaries.json) 청크로 만든다.
//     요약이 한국어 질문과 영어 코드 사이의 다리 역할을 하므로 동의어 표가 필요 없다.
// 사용: node build-index.mjs <repos-dir>   → dist/chunks.jsonl, src/registry.js
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from "node:fs";
import { join, relative, extname, basename } from "node:path";
import { createHash } from "node:crypto";

const REPOS_DIR = process.argv[2] || "../../repos";
const OUT = "dist/chunks.jsonl";
const OWNER = "ghko99";
const ENDPOINT = (process.env.CHAT_ENDPOINT || "https://goganghee-chat.goganghee.workers.dev") + "/__index";
const TOKEN = process.env.INDEX_TOKEN || readFileSync(new URL("./.index-token", import.meta.url), "utf8").trim();
const MAX_CHUNK = 1500, CODE_WIN = 60, CODE_STEP = 48;

// 저장소 → 프로젝트 연결. 유일한 수동 설정. 프로젝트 id는 index.html의 PUBS/PROJECTS id(pub-*, proj-*).
const REPO_PROJECT = {
  "Korean-Text-Data-Augmentation": ["pub-kaes", "pub-hclt", "proj-aihub"],
  "aes_data_augment": ["pub-kcc"],
  "lora-self-consistency-aes": ["pub-tkips"],
  "aes-ukta-exp": ["pub-ukta", "proj-ukta-proj"],
  "essay-agent": ["pub-thesis", "proj-geulgyeol"],
  "aes-llm-training": ["pub-thesis"],
  "essay_scoring_llm": ["pub-thesis", "proj-geulgyeol"],
  "kanana-wntl-14all-strategy-comparison": ["pub-thesis"],
  "aichipcon_AIF_sLLM": ["proj-lh"],
  "Hscode": ["proj-hscode"],
  "cosmetics-oem-erp-prototype": ["proj-oem"],
};

// ---------- 1. 사이트 데이터 → 레지스트리 ----------
const page = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const js = page.match(/<script>([\s\S]*)<\/script>/)[1].replace(/^const IMG = .*$/m, "const IMG={};").split("/* ---------- detail")[0];
const stub = "const document={getElementById:()=>({innerHTML:\"\",querySelectorAll:()=>[]}),querySelectorAll:()=>[],addEventListener(){}};const IntersectionObserver=class{observe(){}unobserve(){}};const setTimeout=()=>{};const window={addEventListener(){}};const location={hash:\"\"};const history={};";
const { PUBS, PROJECTS } = new Function(stub + js + ";return {PUBS,PROJECTS};")();
const strip = s => String(s || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const firstSentence = s => { const m = strip(s).match(/^.{20,}?[.!?](\s|$)/); return (m ? m[0] : strip(s).slice(0, 160)).trim(); };

const registry = [];
for (const [kind, list] of [["pub", PUBS], ["proj", PROJECTS]]) {
  for (const p of list) {
    const id = `${kind}-${p.id}`;
    registry.push({
      id, kind, name: p.t, ko: p.ko || "", when: p.y || "", url: `https://ghko99.github.io/#${id}`,
      summary: firstSentence(p.intro.html),
      repos: Object.entries(REPO_PROJECT).filter(([, ids]) => ids.includes(id)).map(([r]) => r),
    });
  }
}
const known = new Set(registry.map(r => r.id));
for (const ids of Object.values(REPO_PROJECT)) for (const id of ids) if (!known.has(id)) throw new Error("REPO_PROJECT에 모르는 프로젝트 id: " + id);
const nameOf = Object.fromEntries(registry.map(r => [r.id, r.name]));

// ---------- 2. 사이트 청크 ----------
const chunks = [];
const id = (...k) => createHash("sha1").update(k.join("\u0000")).digest("hex").slice(0, 24);
function add(text, meta) {
  text = text.trim(); if (!text) return;
  chunks.push({ id: id(meta.src, meta.url || "", meta.path || "", meta.l1 || 0, text.slice(0, 80)), text, meta });
}
for (const [kind, list] of [["pub", PUBS], ["proj", PROJECTS]]) {
  for (const p of list) {
    const pid = `${kind}-${p.id}`, title = p.t + (p.ko ? " / " + p.ko : ""), url = `https://ghko99.github.io/#${pid}`;
    const head = kind === "pub"
      ? `${p.venue}, ${p.y}, ${p.role || "학위논문"}, 저자 ${p.authors}, 상태 ${p.st}. ${p.meta || ""}`
      : `${p.y}, ${p.who}${p.res ? ", 성과: " + p.res : ""}. 기술: ${(p.tags || []).join(", ")}. ${p.meta || ""}`;
    const links = (p.links || []).map(l => l[0] + " " + l[1]).join(", ");
    add(`[${title}] ${head} 개요: ${strip(p.intro.html)}${links ? " 링크: " + links : ""}`, { src: "site", project: pid, url });
    for (const n of p.nodes || []) {
      let t = `[${title}] 문제 해결 과정 — ${n.t}${n.s ? " (" + n.s + ")" : ""}. `;
      if (n.q) t += "고민: " + strip(n.q) + " ";
      if (n.a) t += "해결: " + strip(n.a) + " ";
      if (n.table) t += "표: " + n.table.map(r => r.join(" | ")).join(" / ") + " ";
      if (n.num) t += "수치: " + n.num.map(x => x.l + " " + (x.b ? x.b + "에서 " : "") + x.a).join(", ");
      add(t, { src: "site", project: pid, url, step: n.t });
    }
  }
}
const siteCount = chunks.length;

// ---------- 3. 저장소 파일 수집 ----------
const SKIP_DIR = /^(\.git|node_modules|__pycache__|\.venv|venv|env|dist|build|\.next|checkpoints?|outputs?|results?|logs?|wandb|runs|data|datasets?|\.idea|\.vscode|\.wrangler)$/i;
const SKIP_PATH = /(sentence_transformers|site-packages|third_party|vendor|korcat_core\/apps\/cohesion|components\/ui)\//i;
const TEXT_EXT = new Set([".py", ".md", ".ipynb", ".js", ".ts", ".tsx", ".jsx", ".sh", ".yaml", ".yml", ".toml", ".txt", ".jinja", ".html", ".cfg", ".ini", ".sql"]);
const SKIP_FILE = /(^\.env|\.lock$|-lock\.ya?ml$|package-lock\.json$|yarn\.lock$|\.min\.(js|css)$|^LICENSE|\.pyc$)/i;
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name); const st = statSync(p);
    if (st.isDirectory()) { if (!SKIP_DIR.test(name)) walk(p, out); continue; }
    if (SKIP_FILE.test(name)) continue;
    const ext = extname(name).toLowerCase();
    if (!TEXT_EXT.has(ext) && !/^readme/i.test(name)) continue;
    if (st.size > 200 * 1024 || (ext === ".txt" && st.size > 8 * 1024)) continue;
    out.push(p);
  }
  return out;
}
const isDataLike = text => { const ls = text.split("\n"); return ls.filter(l => l.length > 400).length > ls.length * 0.3; };
function notebookText(text) { // 노트북은 셀 소스만 (출력 제외)
  try { const nb = JSON.parse(text); return (nb.cells || []).map((c, i) => `# cell ${i + 1} (${c.cell_type})\n${(Array.isArray(c.source) ? c.source.join("") : c.source || "").trim()}`).filter(s => s.split("\n").length > 1).join("\n\n"); } catch { return ""; }
}
const files = [];
for (const [repo, pids] of Object.entries(REPO_PROJECT)) {
  const dir = join(REPOS_DIR, repo);
  if (!existsSync(dir)) { console.error("missing repo:", repo); continue; }
  let branch = "main"; try { branch = readFileSync(join(dir, ".git", "HEAD"), "utf8").trim().replace("ref: refs/heads/", ""); } catch {}
  for (const file of walk(dir)) {
    const rel = relative(dir, file).split("\\").join("/");
    if (SKIP_PATH.test(rel + "/")) continue;
    let text = readFileSync(file, "utf8");
    if (extname(file).toLowerCase() === ".ipynb") text = notebookText(text);
    if (!text.trim() || isDataLike(text)) continue;
    files.push({ repo, branch, path: rel, text, projects: pids, key: createHash("sha1").update(repo + "\0" + rel + "\0" + text).digest("hex").slice(0, 20) });
  }
}
const branchOf = Object.fromEntries(files.map(f => [f.repo, f.branch]));

// ---------- 4. 파일 요약 (LLM, 캐시) ----------
mkdirSync("dist", { recursive: true });
const cachePath = "dist/summaries.json";
const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, "utf8")) : {};
const todo = files.filter(f => !cache[f.key]);
console.log(`저장소 파일 ${files.length}개, 요약 필요 ${todo.length}개`);
async function call(body) {
  const r = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + TOKEN }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return r.json();
}
// 여러 파일을 한 호출에 묶는다 (호출당 약 14k자). 응답: [{key, summary, tags}]
let batch = [], size = 0, done = 0;
async function flush() {
  if (!batch.length) return;
  const items = batch.map(f => ({ key: f.key, repo: f.repo, path: f.path, project: f.projects.map(p => nameOf[p]).join(" / "), content: f.text.slice(0, 7000) }));
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await call({ summarize: items });
      for (const r of res.summaries || []) if (r.key && r.summary) cache[r.key] = { summary: r.summary, tags: r.tags || [] };
      break;
    } catch (e) { if (attempt >= 4) throw e; console.error("\nretry", attempt, e.message); await new Promise(r => setTimeout(r, 4000 * attempt)); }
  }
  done += batch.length; writeFileSync(cachePath, JSON.stringify(cache));
  process.stdout.write(`\r요약 ${done}/${todo.length}`);
  batch = []; size = 0;
}
for (const f of todo) {
  const len = Math.min(f.text.length, 7000);
  if (batch.length && size + len > 14000) await flush();
  batch.push(f); size += len;
}
await flush(); if (todo.length) console.log();

// ---------- 5. 저장소 청크 ----------
function byLines(text, win, step) {
  const lines = text.split("\n"); const out = [];
  for (let s = 0; s < lines.length; s += step) {
    let e = Math.min(lines.length, s + win); let body = lines.slice(s, e).join("\n");
    while (body.length > MAX_CHUNK * 2 && e - s > 8) { e = s + Math.floor((e - s) / 2); body = lines.slice(s, e).join("\n"); }
    out.push({ l1: s + 1, l2: e, body }); if (e >= lines.length) break;
  }
  return out;
}
function byHeadings(text) {
  const parts = text.split(/\n(?=#{1,4} )/); const out = []; let l = 1;
  for (const part of parts) {
    const n = part.split("\n").length;
    if (part.length <= MAX_CHUNK) out.push({ l1: l, l2: l + n - 1, body: part });
    else for (const c of byLines(part, 40, 34)) out.push({ l1: l + c.l1 - 1, l2: l + c.l2 - 1, body: c.body });
    l += n;
  }
  return out;
}
let repoCount = 0;
for (const f of files) {
  const sum = cache[f.key]?.summary || "";
  const pname = f.projects.map(p => nameOf[p]).join(" / ");
  const isMd = extname(f.path).toLowerCase() === ".md" || /^readme/i.test(basename(f.path));
  const pieces = isMd ? byHeadings(f.text) : byLines(f.text, CODE_WIN, CODE_STEP);
  for (const c of pieces) {
    const url = `https://github.com/${OWNER}/${f.repo}/blob/${f.branch}/${f.path}#L${c.l1}-L${c.l2}`;
    const text = `[${pname}] ${f.repo}/${f.path} (${c.l1}–${c.l2}줄)\n파일 요약: ${sum}\n---\n${c.body}`;
    add(text, { src: "repo", project: f.projects[0], repo: f.repo, path: f.path, l1: c.l1, l2: c.l2, url, summary: sum.slice(0, 300) });
    repoCount++;
  }
}

// ---------- 6. 출력 ----------
const seen = new Set(); const uniq = chunks.filter(c => !seen.has(c.id) && seen.add(c.id));
writeFileSync(OUT, uniq.map(c => JSON.stringify(c)).join("\n") + "\n");
const reg = registry.map(r => ({ ...r, repos: r.repos.map(name => ({ name, branch: branchOf[name] || "main" })) }));
writeFileSync(new URL("./src/registry.js", import.meta.url), "// build-index.mjs가 생성. 프로젝트 목록과 연결 저장소.\nexport const REGISTRY = " + JSON.stringify(reg, null, 1) + ";\n");
console.log(`site ${siteCount} + repo ${repoCount} = ${uniq.length} chunks → ${OUT}; registry ${reg.length} projects`);
