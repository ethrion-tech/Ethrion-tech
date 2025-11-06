# ETHRION v2.7 — Multilingual Patch (ko/en/ja)
업로드 방법:
1) ZIP을 풀고 나온 파일을 리포지토리 루트에 업로드(덮어쓰기 포함)
2) `index.html` 및 각 페이지에 언어 선택 셀렉터가 생김
3) 선택된 언어는 `localStorage`에 저장돼 재방문 시 유지

구성:
- `/i18n/ko.json`, `/i18n/en.json`, `/i18n/ja.json`
- `/lang.js`: i18n 로더
- `index.html`, `design.html`, `ops.html`, `archive.html`, `lab.html` (data-i18n 적용)
