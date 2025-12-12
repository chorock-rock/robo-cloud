# Vercel 배포 가이드

## 1. Vercel에 프로젝트 연결

### 방법 1: Vercel CLI 사용
```bash
# Vercel CLI 설치 (전역)
npm i -g vercel

# 프로젝트 디렉토리에서 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 방법 2: Vercel 웹 대시보드 사용
1. [Vercel](https://vercel.com)에 로그인
2. "Add New Project" 클릭
3. GitHub/GitLab/Bitbucket에서 저장소 선택
4. 프로젝트 설정 후 "Deploy" 클릭

## 2. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정해야 합니다:

### Firebase 환경 변수
프로젝트 설정 → Environment Variables에서 다음 변수들을 추가하세요:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 환경 변수 설정 방법
1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Environment Variables
3. 각 변수를 추가 (Production, Preview, Development 모두 선택 가능)
4. 저장 후 재배포

## 3. Firebase 설정 확인

### Firestore 보안 규칙
Firebase Console에서 Firestore 보안 규칙을 확인하세요:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 인증 확인
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 관리자 권한 확인 (필요한 경우)
    match /admin/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // 기타 컬렉션 규칙
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Firebase Authentication 설정
- Firebase Console → Authentication → Settings
- Authorized domains에 Vercel 도메인 추가
  - 예: `your-project.vercel.app`
  - 예: `your-custom-domain.com`

## 4. 빌드 설정

Vercel은 Next.js를 자동으로 감지하므로 추가 설정이 필요 없습니다.

### 빌드 명령어 (자동 감지)
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

## 5. 커스텀 도메인 설정 (선택사항)

1. Vercel 대시보드 → 프로젝트 → Settings → Domains
2. 도메인 추가
3. DNS 설정 (Vercel이 제공하는 레코드 사용)

## 6. 배포 확인

배포 후 다음을 확인하세요:
- [ ] 환경 변수가 올바르게 설정되었는지
- [ ] Firebase Authentication이 작동하는지
- [ ] Firestore 데이터가 로드되는지
- [ ] 모든 페이지가 정상적으로 렌더링되는지

## 7. 문제 해결

### 빌드 실패
- 환경 변수가 모두 설정되었는지 확인
- `npm run build`를 로컬에서 실행하여 오류 확인

### Firebase 연결 실패
- Firebase Console에서 Authorized domains 확인
- 환경 변수 값이 올바른지 확인

### 런타임 오류
- Vercel 대시보드 → 프로젝트 → Functions → Logs에서 로그 확인
- 브라우저 콘솔에서 오류 확인

