import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import Detail from './pages/Detail'
import Chat from './components/Chat'
import Nav from './components/Nav'

/** 예전 주소(#pub-thesis, #cv 등)로 들어온 링크를 새 주소로 보낸다 — 챗봇 참고 링크가 이 형식을 쓴다 */
function Legacy() {
  const { legacy = '' } = useParams()
  const m = legacy.match(/^(pub|proj)-(.+)$/)
  if (m) return <Navigate to={`/p/${m[1]}/${m[2]}`} replace />
  if (legacy === 'cv' || legacy === 'timeline') return <Navigate to={`/?s=${legacy}`} replace />
  return <Navigate to="/" replace />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/p/:kind/:id" element={<Detail />} />
        <Route path="/:legacy" element={<Legacy />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Chat />
    </HashRouter>
  </StrictMode>,
)
