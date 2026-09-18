# ghko99.github.io

고강희 포트폴리오. [al-folio](https://github.com/alshedivat/al-folio) 테마(Jekyll) 기반이며 GitHub Actions가 `gh-pages` 브랜치로 빌드·배포합니다.

- 내용: `_pages/`(소개·이력·타임라인), `_projects/`(논문·프로젝트 상세), `_bibliography/papers.bib`, `_news/`
- 채팅 위젯: `_includes/chat.liquid` → Cloudflare Worker(`chat-worker/`)
- 옛 단일 파일 사이트: `chat-worker/legacy/index.html` (챗봇 색인 원본 데이터)
