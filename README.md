# Vanilla Todo Web UI

순수 HTML/CSS/JavaScript(ESM)로 구현한 Todo 앱입니다.

## 실행 방법

```bash
python3 -m http.server 4173
# 브라우저에서 http://127.0.0.1:4173/todo.html 접속
```

## 필수 기능 반영

- Todo 리스트 노출
- Todo 입력 및 새로운 Todo 추가
- Todo 완료 토글
- Todo 삭제

## 추가 구현 사항

- `localStorage` 기반 데이터 영속화
- 필터(전체/진행중/완료)와 완료 항목 일괄 삭제
- 남은 할 일 카운트 및 완료삭제 버튼 비활성화 처리
- 빈 상태에서 추천 TODO 원클릭 추가
- 이벤트 위임(`click`, `change`) 기반 효율적인 이벤트 처리
- 툴바 키보드 내비게이션(`ArrowLeft/ArrowRight/Home/End`) 지원
- 단일 책임 원칙 기반 ESM 모듈 분리

## 테스트

```bash
node --check src/app.js
node --check src/dom.js
node --check src/state.js
node --check src/storage.js
node --check src/utils.js
node --test tests/state-utils.test.js
```

## 디렉토리 구조

```text
todo.html
todo.css
src/
  app.js       # 이벤트 연결, 화면 갱신 orchestration
  state.js     # 상태 관리(store)
  dom.js       # DOM 렌더링 책임
  storage.js   # localStorage 입출력
  utils.js     # 문자열/중복 체크 유틸
tests/
  state-utils.test.js
```
