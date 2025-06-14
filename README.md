# 🚀 Math Quiz Bank 인수인계 문서

---

## 1. 프로젝트 개요

- **프로젝트명**: Math Quiz Bank
- **설명**: Next.js와 TypeScript 기반으로 다양한 수학 퀴즈(표 채우기, 객관식, 빈칸 채우기)를 생성·관리하고, MathLive와 Desmos를 활용한 수식 입력 및 그래프 설명 기능을 제공하는 웹 애플리케이션입니다.
- **주요 기능**:
  - 표 셀 채우기(Table Fill Cells)
  - 객관식(MCQ Single Choice)
  - 빈칸 채우기(Fill in the Blank)
  - 수식(LaTeX) 입력 및 KaTeX 미리보기
  - Desmos 기반 설명용 그래프 삽입 및 렌더링
  - 세션 스토리지(sessionStorage)를 활용한 문제 저장·관리 및 데모(Test) 기능

## 2. 주요 라이브러리 설명

| 라이브러리                 | 용도                                                                       |
| -------------------------- | -------------------------------------------------------------------------- |
| Next.js                    | React 기반 SSR/SSG 프레임워크(앱 라우팅, 파일 기반 라우팅 등)              |
| TypeScript                 | 정적 타입 검사로 안정성 및 개발 생산성 향상                                |
| MathLive                   | 브라우저 내 수식(LaTeX) 입력을 위한 커스텀 `<math-field>` 컴포넌트         |
| Desmos                     | 설명용 그래프 렌더링(Graphing, Geometry, Scientific, FourFunction)         |
| React Query                | API 통신 및 데이터 캐싱(※ 현재 구현에 직접 도입되어 있지 않으나 확장 지점) |
| react-katex & KaTeX        | LaTeX 수식을 HTML로 렌더링                                                 |
| Tailwind CSS               | 유틸리티 클래스 기반 스타일링                                              |
| Prisma (@prisma/client)    | ORM(백엔드 DB 연동 준비용, 현재 코드에서는 DB 레이어 미구현)               |
| chart.js & react-chartjs-2 | 차트 렌더링(설정 파일 존재하지만 직접 사용되지 않음)                       |
| react-konva                | Canvas 기반 드로잉 라이브러리(설정 파일 존재하지만 직접 사용되지 않음)     |

## 3. 페이지 구조

```text
app/
├─ page.tsx             # 문제 목록(메인) 페이지
├─ create/
│   └─ page.tsx         # 문제 생성 마법사 페이지
│   └─ _components/     # 문제 생성용 에디터 컴포넌트 집합
├─ demo/
│   └─ page.tsx         # 문제 풀기 데모 페이지
│   └─ _components/     # 데모 실행 및 풀이 뷰 컴포넌트 집합
├─ components/
│   ├─ Navbar.tsx       # 공통 네비게이션 바
│   ├─ DesmosGraphView.tsx  # Desmos 그래프 뷰 컴포넌트
│   └─ problem-displays/    # 문제 미리보기(Preview) 컴포넌트
├─ _utils/
│   ├─ parseMixedText.tsx   # 텍스트+LaTeX 파싱 유틸
│   ├─ extractDesmosID.ts   # Desmos URL ID 추출 유틸
│   └─ formulaLibrary.ts    # 수식 라이브러리 예시
├─ globals.css          # 전역 스타일(Tailwind CSS)
├─ layout.tsx           # 공통 레이아웃 및 Navbar 포함
└─ next.config.ts       # Next.js 설정
```

## 4. 주요 컴포넌트 역할

- **Navbar**: 상단 네비게이션 메뉴(문제 목록 / 생성 / 데모)
- **TableEditor**: 표 형태 문제 생성·편집 UI
- **MCQEditor**: 객관식 문제(보기, 정답) 생성·편집 UI
- **FillBlankEditor**: 빈칸 채우기 문제(텍스트/수식/그래프) 생성·편집 UI
- **DesmosGraphView**: Desmos API를 로드하여 그래프 상태(state)를 렌더링
- **parseMixedText**: `$...$`로 감싼 LaTeX 및 일반 텍스트를 KaTeX로 변환하여 렌더링
- **formulaLibrary**: 자주 쓰이는 수학 수식 템플릿 목록
- **TableProblemView / MCQProblemView / BlankProblemView**: 문제 목록 페이지에서 각 문제 유형별 미리보기 및 삭제 처리
- **QuestionPreview**: 세션 스토리지에 저장된 문제를 테스트 형태로 풀어보는 예비 Preview 뷰
- **DemoRunner**: 문제 풀기 데모 로직(문제 순회, 정답 체크, 결과 요약)
- **BlankProblemSolveView / MCQProblemSolveView / TableProblemSolveView**: 데모 페이지 내 실제 문제 풀이 UI 및 사용자 입력 처리

## 5. 설치 및 실행 방법

### 요구사항

- Node.js v14 이상
- npm 또는 yarn

### 설치

```bash
git clone https://github.com/gulin01/math-quiz-bank.git
cd math-quiz-bank
npm install
# 또는 yarn install
```

### 개발 서버 실행

```bash
npm run dev
# 또는 yarn dev

# 브라우저에서 http://localhost:3000 접속
```

### 빌드 및 프로덕션

```bash
npm run build
npm start
# 또는 yarn build && yarn start
```

---

※ 추가 문의 사항이나 미반영된 요구사항은 `README.md` 및 소스코드를 참조해주세요.
