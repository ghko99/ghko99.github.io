import raw from './site.json'
import type { Site, Item, Kind } from './types'

export const site = raw as unknown as Site
export const img = (k?: string) => (k ? site.IMG[k] : undefined)
export const byId = (k: Kind, id: string): Item | undefined => (k === 'pub' ? site.PUBS : site.PROJECTS).find((x) => x.id === id)
/** 타임라인 순서(오래된 것부터)의 [kind, item] 목록 — 상세 페이지의 이전/다음 이동에 쓴다 */
export const ORDER: [Kind, Item][] = site.EVENTS.filter((e) => e.k).map((e) => [e.k as Kind, byId(e.k as Kind, e.id!)!])
export const PROFILE = {
  name: '고강희', en: 'Ganghee Go', email: 'khko99@naver.com',
  github: 'https://github.com/ghko99', blog: 'https://velog.io/@khko99/posts', orcid: 'https://orcid.org/0009-0006-1027-105X',
}
