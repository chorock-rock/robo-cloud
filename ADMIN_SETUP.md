# 운영자 권한 설정 가이드

운영자 페이지(`/admin`)에 접근하려면 Firestore에 운영자 권한을 등록해야 합니다.

## 운영자 추가 방법

### 방법 1: Firebase Console에서 직접 추가 (권장)

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **"Firestore Database"** 클릭
4. **"컬렉션 시작"** 또는 기존 컬렉션 선택
5. 컬렉션 ID에 **`admins`** 입력
6. 문서 ID는 자동 생성 또는 수동 입력
7. 필드 추가:
   - 필드: `email` (문자열)
   - 값: 운영자 이메일 주소 (예: `admin@example.com`)
8. **"저장"** 클릭

### 방법 2: 코드로 운영자 추가

운영자 페이지에 임시로 운영자 추가 기능을 추가하거나, 별도의 스크립트를 실행할 수 있습니다.

## 운영자 권한 확인

운영자 페이지에 접근하면:
1. 구글 로그인
2. Firestore의 `admins` 컬렉션에서 이메일 확인
3. 일치하는 이메일이 있으면 운영자 권한 부여
4. 없으면 "접근 권한 없음" 메시지 표시

## 보안 고려사항

- 운영자 이메일은 정확하게 입력해야 합니다 (대소문자 구분)
- 운영자 목록은 Firestore 보안 규칙으로 보호하는 것을 권장합니다
- 프로덕션 환경에서는 Firestore 보안 규칙을 설정하여 `admins` 컬렉션을 읽기 전용으로 제한하세요

## Firestore 보안 규칙 예시

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 운영자 컬렉션은 인증된 사용자만 읽기 가능
    match /admins/{document} {
      allow read: if request.auth != null;
      allow write: if false; // 쓰기는 Firebase Console에서만
    }
    
    // 기타 컬렉션 규칙...
  }
}
```

## 운영자 제거

Firebase Console에서 `admins` 컬렉션의 해당 문서를 삭제하면 됩니다.





