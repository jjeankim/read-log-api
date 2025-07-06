# ✏️ Read Log API Server

사용자가 책을 읽고 독후감을 기록할 수 있는 ReadLog의 백엔드 API 서버입니다.
Express와 Prisma, PostgreSQL을 기반으로 RESTfull API를 제공합니다.

<br/>

## 🖥️ 배포 링크 (Render)

🔗 https://read-log.onrender.com

<br/>

## ⚙️ 기술 스택

**Back-End**

![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=black)
![Express](https://img.shields.io/badge/Express-888888?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Backend on Render](https://img.shields.io/badge/Backend_on-Render-0099FF?style=for-the-badge&logo=render&logoColor=white)

<br/>

## 🔨 사용 라이브러리 및 도구
![Dotenv](https://img.shields.io/badge/dotenv-000000?style=for-the-badge)
![CORS](https://img.shields.io/badge/cors-7D4698?style=for-the-badge)
![Nodemon](https://img.shields.io/badge/nodemon-76D04B?style=for-the-badge)
![cookie-parser](https://img.shields.io/badge/cookie--parser-FFB400?style=for-the-badge)
![jsonwebtoken](https://img.shields.io/badge/jsonwebtoken-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Multer](https://img.shields.io/badge/Multer-FF6B6B?style=for-the-badge)
![Swagger UI](https://img.shields.io/badge/Swagger_UI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![bcryptjs](https://img.shields.io/badge/bcryptjs-003B57?style=for-the-badge)
![Zod](https://img.shields.io/badge/Zod-5D3FD3?style=for-the-badge)
![yamljs](https://img.shields.io/badge/yamljs-F4C030?style=for-the-badge)
<br/>

## 📦 설치 및 실행

01 아래의 명령어로 의존성을 설치합니다.
```
npm install
```
02 아래의 명령어로 개발 서버를 실행합니다.
```
npm run dev
```

<br/>

## 📡 API 문서 요약
| 메서드      | 경로                      | 설명                   | 인증 여부 |
| -------- | ----------------------- | -------------------- | ----- |
| `POST`   | `/auth/register`          | 회원가입                 | ❌     |
| `POST`   | `/auth/login`           | 로그인 (JWT 발급)         | ❌     |
| `GET`    | `/users/me`             | 내 정보 조회              | ✅     |
| `PUT`    | `/users/me`             | 내 정보 수정              | ✅     |
| `POST`   | `/logs`                 | 로그 작성                | ✅     |
| `GET`    | `/logs`                 | 전체 공개 로그 목록 조회       | ❌     |
| `GET`    | `/logs/:logId`          | 특정 로그 조회 (공개/비공개 분기) | ❔ 옵셔널 |
| `PUT`    | `/logs/:logId`          | 로그 수정 (작성자만)         | ✅     |
| `DELETE` | `/logs/:logId`          | 로그 삭제 (작성자만)         | ✅     |
| `GET`    | `/logs/my-logs`         | 내가 작성한 로그 목록 조회   | ✅     |
| `POST`   | `/logs/:logId/comments` | 댓글 작성                  | ✅     |
| `GET`    | `/logs/:logId/comments` | 댓글 목록 조회             | ❌     |
| `PATCH`  | `/logs/:logId/comments` | 댓글 수정                  | ✅     |
| `DELETE` | `/logs/:logId/comments` | 댓글 삭제                  | ✅     |


<br />

## 🔐 환경 변수 (.env 예시)

프로젝트 루트에 .env 파일을 생성하고 아래와 같이 작성하세요. .env 파일은 gitignore에 추가해 버전 관리에서 제외하세요.
```
DIRECT_URL="postgresql://user:password@host:5432/postgres"
DATABASE_URL="postgresql://user:password@host:6543/postgres"
JWT_ACCESS_SECRET_key="your_access_token_secret"
JWT_REFRESH_SECRET_key="your_refresh_token_secret"

```

<br />

## 📁 프로젝트 구조 예시

```
📦read-log-api
├── 📁dist              # 빌드된 결과물 (TS → JS)
├── 📁node_modules      # 의존성 모듈
├── 📁prisma            # Prisma 스키마 및 마이그레이션
├── 📁public            # 업로드된 이미지 등 정적 파일
├── 📁src               # 소스 코드
│   ├── 📁controllers   # 라우트별 로직 처리
│   ├── 📁lib           # 유틸 함수 또는 외부 서비스 연동
│   ├── 📁middlewares   # 인증, 에러 핸들링 등의 미들웨어
│   ├── 📁routes        # Express 라우터 정의
│   ├── 📁scripts       # 초기 데이터 입력 등 유틸 스크립트
│   ├── 📁types         # 타입 정의 (Express 확장 등)
│   ├── 📁validators    # Zod 등으로 작성한 요청 데이터 검증 스키마
│   └── 📄app.ts        # Express 앱 초기화
├── 📄.env              # 환경 변수 설정
├── 📄.gitignore        # Git에 포함되지 않을 파일 지정
├── 📄package.json      # 프로젝트 설정 및 의존성
├── 📄package-lock.json # 의존성 잠금
├── 📄request.http      # API 테스트용 HTTP 요청 파일
├── 📄swagger.yaml      # Swagger API 문서 정의 (선택사항)
└── 📄tsconfig.json     # TypeScript 설정
```



## 🌐 CORS 설정

현재 백엔드에는 다음의 origin만 요청을 허용하도록 설정되어 있습니다. 필요 시 특정 origin만 허용하도록 수정할 수 있습니다.
```
- http://localhost:3000 (개발용)

```
