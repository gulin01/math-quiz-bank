# Math Quiz Bank

**Math Quiz Bank**는 다양한 수학 퀴즈를 생성하고 관리할 수 있는 웹 애플리케이션입니다. Next.js와 TypeScript 기반으로 개발되어, 교육자와 학습자가 쉽게 사용할 수 있는 직관적인 퀴즈 플랫폼을 제공합니다.

## 주요 기능

- ✅ **퀴즈 생성 기능**: 난이도와 주제를 선택하여 맞춤형 수학 퀴즈를 생성할 수 있습니다.
- ✅ **간편한 UI/UX**: 사용자가 쉽게 접근하고 퀴즈를 풀 수 있도록 직관적인 인터페이스 제공
- ✅ **반응형 디자인**: 데스크탑과 모바일 환경 모두에 최적화
- ✅ **고속 성능**: Next.js 기반의 최적화된 성능 제공

## 기술 스택

- **프레임워크**: [Next.js](https://nextjs.org/)
- **언어**: TypeScript
- **스타일링**: CSS
- **폰트 최적화**: [next/font](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts), Vercel의 Geist 사용

## 시작하기

### 설치 전 요구사항

- Node.js (버전 14 이상)
- npm 또는 yarn

### 설치 방법

1. **레포지토리 클론**:

   ```bash
   git clone https://github.com/gulin01/math-quiz-bank.git
   cd math-quiz-bank
   의존성 설치:
   ```

npm 사용 시:

bash
Copy
Edit
npm install
yarn 사용 시:

bash
Copy
Edit
yarn install
개발 서버 실행
bash
Copy
Edit
npm run dev
또는

bash
Copy
Edit
yarn dev
브라우저에서 http://localhost:3000 접속하여 실행 중인 앱을 확인할 수 있습니다.

프로젝트 구조
ruby
Copy
Edit
math-quiz-bank/
├── app/ # 주요 페이지 및 컴포넌트
├── public/ # 이미지, 폰트 등의 정적 파일
├── .gitignore # Git에서 제외할 파일 목록
├── README.md # 프로젝트 설명 파일
├── next.config.ts # Next.js 설정 파일
├── package.json # 프로젝트 정보 및 스크립트
├── tsconfig.json # TypeScript 설정
├── postcss.config.mjs # PostCSS 설정
배포
프로덕션 배포는 Vercel을 사용하는 것이 권장됩니다. Next.js와 완벽히 연동되며 간편한 CI/CD 환경을 제공합니다.

기여하기
이 프로젝트는 오픈소스로 누구나 기여할 수 있습니다. 포크 후 수정 사항을 반영한 후 Pull Request를 보내주세요!

라이선스
이 프로젝트는 MIT 라이선스에 따라 제공됩니다.

yaml
Copy
Edit

---

필요에 따라 문구를 수정하거나 팀에 맞게 커스터마이징할 수 있습니다. 추가로 `CONTRIBUTING.md`, `LICENSE`, 또는 다국어 지원
