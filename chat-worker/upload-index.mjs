// dist/chunks.jsonl 을 워커의 /__index 로 올려 Vectorize 색인을 갱신한다.
// 토큰: 환경변수 INDEX_TOKEN 또는 .index-token 파일 (워커 시크릿 DEBUG_TOKEN과 같은 값).
// 이전 매니페스트(index-manifest.json)에 있고 이번에 없는 id는 지운다.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
const ENDPOINT = (process.env.CHAT_ENDPOINT || "https://goganghee-chat.goganghee.workers.dev") + "/__index";
const token = process.env.INDEX_TOKEN || readFileSync(new URL("./.index-token", import.meta.url), "utf8").trim();
const file = process.argv[2] || "dist/chunks.jsonl";
const chunks = readFileSync(file, "utf8").split("\n").filter(Boolean).map(l => JSON.parse(l));
const prev = existsSync("index-manifest.json") ? JSON.parse(readFileSync("index-manifest.json", "utf8")) : [];
const now = new Set(chunks.map(c => c.id));
const stale = prev.filter(id => !now.has(id));
// 기본은 증분 업로드: 청크 id가 내용 해시이므로 매니페스트에 없는 id만 새로 임베딩한다.
// (Workers AI 무료 한도가 하루 1만 뉴런이라 전체 재업로드를 반복하면 한도를 소진한다.) 전체 재업로드는 --all.
const all = process.argv.includes("--all");
const prevSet = new Set(prev);
const todo = all ? chunks : chunks.filter(c => !prevSet.has(c.id));
console.log(`청크 ${chunks.length}개 중 새로 올릴 것 ${todo.length}개, 지울 것 ${stale.length}개`);

async function call(body) {
  const r = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return r.json();
}
const B = 120; let done = 0;
for (let i = 0; i < todo.length; i += B) {
  const batch = todo.slice(i, i + B);
  for (let attempt = 1; ; attempt++) {
    try { await call({ upsert: batch }); break; }
    catch (e) { if (attempt >= 3) throw e; console.error("retry", attempt, e.message); await new Promise(r => setTimeout(r, 2000 * attempt)); }
  }
  done += batch.length; process.stdout.write(`\r올린 청크 ${done}/${todo.length}`);
  writeFileSync("index-manifest.json", JSON.stringify([...new Set([...prev, ...todo.slice(0, done).map(c => c.id)])]));
}
console.log();
if (stale.length) { await call({ deleteIds: stale }); console.log("지운 청크", stale.length); }
writeFileSync("index-manifest.json", JSON.stringify([...now]));
console.log("완료. 색인 크기", now.size);
