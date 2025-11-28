# ROBO Cloud

태블릿 기기제어 기능 제공 서비스

## 개요

ROBO Cloud는 태블릿의 기기제어 기능을 제공하는 서비스입니다. 사용자와 운영자를 위한 플랫폼으로, Firebase를 백엔드로 사용하며, 흑백 세련된 디자인으로 구성되어 있습니다.

## 주요 기능

### 사용자 기능
- 구글 로그인
- 내 태블릿 관리 페이지
  - MAC Address
  - 테이블 번호
  - 와이파이 강도
  - 배터리 총량
  - 버전 정보
  - IP 주소
  - 펌웨어 빌드 번호
  - On/Off 스위치

### 운영자 기능
- 가입한 사용자 목록 조회
- MAC Address 등록 (등록 시간 포함)

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **백엔드**: Firebase (Authentication, Firestore)
- **인증**: Firebase Google Auth

## 설치

1. 저장소 클론
```bash
git clone <repository-url>
cd robo-cloud
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
프로젝트 루트에 `.env.local` 파일을 생성하고 Firebase 설정 정보를 입력하세요:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Firebase 설정 가져오는 방법:**
1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. 프로젝트 생성 또는 기존 프로젝트 선택
3. 프로젝트 설정(⚙️) > 일반 탭으로 이동
4. "내 앱" 섹션에서 웹 앱 추가(</> 아이콘 클릭)
5. 앱 닉네임 입력 후 등록
6. 표시되는 `firebaseConfig` 객체에서 값들을 복사하여 `.env.local`에 입력

**구글 로그인 설정:**
자세한 설정 방법은 [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) 파일을 참고하세요.
간단히 요약하면:
1. Firebase Console > Authentication > Sign-in method
2. Google 제공업체 활성화
3. 개발 서버 재시작

## 실행

개발 서버 실행:
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
robo-cloud/
├── app/
│   ├── user/              # 사용자 페이지
│   │   ├── page.tsx       # 로그인 페이지
│   │   └── tablets/       # 내 태블릿 페이지
│   ├── admin/             # 운영자 페이지
│   │   └── page.tsx       # 사용자 관리 및 MAC Address 등록
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 메인 랜딩 페이지
│   └── globals.css        # 전역 스타일
├── lib/
│   └── firebase.ts        # Firebase 설정
└── package.json
```

## 라우팅

- `/` - 메인 랜딩 페이지
- `/user` - 사용자 로그인 페이지
- `/user/tablets` - 내 태블릿 관리 페이지
- `/admin` - 운영자 관리 페이지 (직접 URL 입력으로 접근, 운영자 권한 필요)

**운영자 권한 설정:**
운영자 페이지에 접근하려면 Firestore에 운영자 권한을 등록해야 합니다.
자세한 방법은 [ADMIN_SETUP.md](./ADMIN_SETUP.md) 파일을 참고하세요.

## Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성
2. Authentication에서 Google 로그인 활성화
3. Firestore Database 생성
4. 환경 변수에 Firebase 설정 정보 입력

## 라이선스

ISC

