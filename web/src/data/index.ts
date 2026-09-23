import raw from './site.json'
import en from './en.json'
import { getLang } from '../i18n'
import type { Site, Item, Kind } from './types'

export const site = raw as unknown as Site
/** 영어 자료는 같은 모양의 부분 객체다. 배열은 순서가 같으므로 자리끼리 덮어쓴다 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function merge(ko: any, tr: any): any {
  if (tr === undefined || tr === null) return ko
  if (Array.isArray(ko)) return Array.isArray(tr) ? ko.map((v, i) => merge(v, tr[i])) : tr
  if (ko && typeof ko === 'object') { const o = { ...ko }; for (const k of Object.keys(tr)) o[k] = merge(ko[k], tr[k]); return o }
  return tr
}
const EN = en as Record<string, unknown>
export const img = (k?: string) => (k ? site.IMG[k] : undefined)
export const byId = (k: Kind, id: string): Item | undefined => {
  const it = (k === 'pub' ? site.PUBS : site.PROJECTS).find((x) => x.id === id)
  return it && getLang() === 'en' ? (merge(it, EN[`${k}-${id}`]) as Item) : it
}
/** 타임라인 이정표(사건) 문구의 영어판 — 날짜가 열쇠 */
export const eventText = (d: string, ko: string) => (getLang() === 'en' ? ((EN.events as Record<string, string>)?.[d] ?? ko) : ko)
/** 타임라인 순서(오래된 것부터)의 [kind, item] 목록 — 상세 페이지의 이전/다음 이동에 쓴다. 언어가 바뀌면 다시 만들어야 하므로 함수다 */
export const order = (): [Kind, Item][] => site.EVENTS.filter((e) => e.k).map((e) => [e.k as Kind, byId(e.k as Kind, e.id!)!])
export const PROFILE = {
  name: '고강희', en: 'Ganghee Go', email: 'khko99@naver.com',
  github: 'https://github.com/ghko99', blog: 'https://velog.io/@khko99/posts', orcid: 'https://orcid.org/0009-0006-1027-105X',
}
