import { useSyncExternalStore } from 'react'

export type Lang = 'ko' | 'en'
const subs = new Set<() => void>()
let lang: Lang = (() => {
  try { const v = localStorage.getItem('lang'); if (v === 'ko' || v === 'en') return v } catch { /* ignore */ }
  return typeof navigator !== 'undefined' && !navigator.language?.startsWith('ko') ? 'en' : 'ko'
})()

export const getLang = () => lang
export function setLang(v: Lang) {
  lang = v; document.documentElement.lang = v
  try { localStorage.setItem('lang', v) } catch { /* ignore */ }
  subs.forEach((f) => f())
}
export const useLang = () => useSyncExternalStore((f) => { subs.add(f); return () => { subs.delete(f) } }, () => lang, () => lang)
/** 한 줄짜리 문구는 키 파일 없이 양쪽을 그 자리에 적는다 */
export const T = (ko: string, en: string) => (lang === 'ko' ? ko : en)

export type Theme = 'light' | 'dark' | 'auto'
const tsubs = new Set<() => void>()
let theme: Theme = (() => { try { const v = localStorage.getItem('theme'); if (v === 'light' || v === 'dark') return v } catch { /* ignore */ } return 'auto' })()
export function setTheme(v: Theme) {
  theme = v
  if (v === 'auto') document.documentElement.removeAttribute('data-theme')
  else document.documentElement.setAttribute('data-theme', v)
  try { v === 'auto' ? localStorage.removeItem('theme') : localStorage.setItem('theme', v) } catch { /* ignore */ }
  tsubs.forEach((f) => f())
}
export const useTheme = () => useSyncExternalStore((f) => { tsubs.add(f); return () => { tsubs.delete(f) } }, () => theme, () => theme)
setTheme(theme); document.documentElement.lang = lang
