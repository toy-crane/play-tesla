# Play Tesla - 테슬라 정보 모음 플랫폼

이 프로젝트는 Turborepo를 기반으로 한 모노레포 구조의 테슬라 정보 제공 플랫폼입니다.

## 프로젝트 구조

이 Turborepo는 다음과 같은 앱과 패키지를 포함하고 있습니다:

### 앱

- `web`: [Next.js](https://nextjs.org/)와 [Tailwind CSS](https://tailwindcss.com/)를 사용한 메인 웹 애플리케이션

### 패키지

- `ui`: `web` 애플리케이션에서 공유되는 React 컴포넌트 라이브러리
- `@repo/eslint-config`: 프로젝트 전체에서 사용되는 ESLint 설정
- `@repo/typescript-config`: 프로젝트 전체에서 사용되는 TypeScript 설정
- `@repo/transactional`: 이메일 템플릿 관리를 위한 패키지
- `@repo/google-indexer`: Google 검색 인덱싱을 위한 패키지

모든 패키지와 앱은 100% [TypeScript](https://www.typescriptlang.org/)로 작성되었습니다.

## 주요 기능

- 테슬라 차량 모델별 가격 정보 제공
- 테슬라 차량 가격 변동 추이 차트
- 지역별 전기차 보조금 정보 제공
- 차량 가격 변동 알림 서비스

## 기술 스택

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- Supabase

## 개발 시작하기

1. 저장소를 클론합니다.
2. 의존성을 설치합니다:
   ```
   pnpm install
   ```
3. 개발 서버를 실행합니다:
   ```
   pnpm dev
   ```

## 유틸리티

이 프로젝트는 다음과 같은 도구들이 설정되어 있습니다:

- [Tailwind CSS](https://tailwindcss.com/): 스타일링
- [TypeScript](https://www.typescriptlang.org/): 정적 타입 체크
- [ESLint](https://eslint.org/): 코드 린팅
- [Prettier](https://prettier.io): 코드 포맷팅

## 배포

이 프로젝트는 Vercel을 통해 배포됩니다. `main` 브랜치에 변경사항이 푸시되면 자동으로 배포가 진행됩니다.

## 기여하기

버그 리포트, 기능 제안, 풀 리퀘스트 등 모든 형태의 기여를 환영합니다. 기여하기 전에 프로젝트 관리자와 논의해 주세요.

## 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE)하에 제공됩니다.
