# Firebase 구글 로그인 설정 가이드

## 1단계: Firebase Console에서 Authentication 활성화

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. 프로젝트 선택 (또는 새 프로젝트 생성)
3. 왼쪽 메뉴에서 **"Authentication"** 클릭
4. **"시작하기"** 버튼 클릭 (처음 사용하는 경우)

## 2단계: Google 로그인 제공업체 활성화

1. Authentication 페이지에서 **"Sign-in method"** (또는 "로그인 방법") 탭 클릭
2. 제공업체 목록에서 **"Google"** 클릭
3. **"사용 설정"** 토글을 **켜기**로 변경
4. **프로젝트 지원 이메일** 선택 (기본값 사용 가능)
5. **"저장"** 버튼 클릭

## 3단계: 승인된 리디렉션 URI 설정 (필수)

Google OAuth를 사용하려면 승인된 리디렉션 URI를 설정해야 합니다.

### 방법 1: Firebase Console에서 자동 설정 (권장)

Firebase Console에서 Google 로그인을 활성화하면 자동으로 설정됩니다. 하지만 개발 환경에서는 추가 설정이 필요할 수 있습니다.

### 방법 2: Google Cloud Console에서 수동 설정

1. Firebase Console에서 **프로젝트 설정** (⚙️ 아이콘) 클릭
2. **"통합"** 탭 클릭
3. **"Google"** 섹션에서 **"Google Cloud Console에서 관리"** 클릭
4. Google Cloud Console이 열리면:
   - 왼쪽 메뉴에서 **"API 및 서비스"** > **"사용자 인증 정보"** 클릭
   - OAuth 2.0 클라이언트 ID를 찾아 클릭
   - **"승인된 리디렉션 URI"** 섹션에 다음 추가:
     ```
     http://localhost:3000
     http://localhost:3000/user
     http://localhost:3000/admin
     ```
   - 프로덕션 도메인도 추가 (배포 시):
     ```
     https://your-domain.com
     https://your-domain.com/user
     https://your-domain.com/admin
     ```
5. **"저장"** 클릭

## 4단계: OAuth 동의 화면 설정 (처음 사용하는 경우)

1. Google Cloud Console에서 **"OAuth 동의 화면"** 클릭
2. **"외부"** 선택 후 **"만들기"** 클릭
3. 필수 정보 입력:
   - **앱 이름**: ROBO Cloud (또는 원하는 이름)
   - **사용자 지원 이메일**: 선택
   - **앱 로고**: 선택사항
   - **개발자 연락처 정보**: 이메일 주소
4. **"저장 후 계속"** 클릭
5. **"범위"** 단계에서 기본 범위 사용 (이메일, 프로필 등)
6. **"저장 후 계속"** 클릭
7. **"테스트 사용자"** 단계에서 테스트할 이메일 추가 (선택사항)
8. **"저장 후 계속"** 클릭
9. **"요약"** 단계에서 **"대시보드로 돌아가기"** 클릭

## 5단계: 환경 변수 확인

`.env.local` 파일에 Firebase 설정이 올바르게 입력되어 있는지 확인:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 6단계: 개발 서버 재시작

환경 변수를 변경했다면 개발 서버를 재시작하세요:

```bash
npm run dev
```

## 문제 해결

### "popup_closed_by_user" 에러
- 사용자가 팝업을 닫았을 때 발생하는 정상적인 동작입니다.
- 다시 로그인을 시도하면 됩니다.

### "auth/unauthorized-domain" 에러
- Firebase Console > Authentication > 설정 > 승인된 도메인에 현재 도메인을 추가해야 합니다.
- 개발 환경: `localhost`는 자동으로 추가되어 있습니다.
- 프로덕션: 배포 도메인을 수동으로 추가해야 합니다.

### "auth/operation-not-allowed" 에러
- Firebase Console에서 Google 로그인 제공업체가 활성화되지 않았습니다.
- 2단계를 다시 확인하세요.

### 로그인 팝업이 열리지 않음
- 브라우저 팝업 차단 설정을 확인하세요.
- HTTPS를 사용하는지 확인하세요 (프로덕션).

## 테스트

1. 브라우저에서 `http://localhost:3000/user` 접속
2. "구글 로그인" 버튼 클릭
3. Google 계정 선택 및 권한 승인
4. 로그인 성공 시 `/user/tablets` 페이지로 리디렉션됨

