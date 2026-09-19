import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import Detail from './pages/Detail'
import Chat from './components/Chat'
import Nav from './components/Nav'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/p/:kind/:id" element={<Detail />} />
      </Routes>
      <Chat />
    </HashRouter>
  </StrictMode>,
)
