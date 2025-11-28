import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 싱글톤 패턴으로 Firebase 인스턴스 관리
let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

function initializeFirebase() {
  if (typeof window === 'undefined') {
    return;
  }

  if (appInstance) {
    return;
  }

  if (!firebaseConfig.apiKey) {
    console.warn('⚠️ Firebase 설정이 없습니다. .env.local 파일을 생성하고 Firebase 설정을 추가해주세요.');
    return;
  }

  try {
    appInstance = getApps().length === 0 
      ? initializeApp(firebaseConfig) 
      : getApps()[0];
    authInstance = getAuth(appInstance);
    dbInstance = getFirestore(appInstance);
  } catch (error) {
    console.error('Firebase 초기화 실패:', error);
  }
}

// 클라이언트 사이드에서만 초기화
if (typeof window !== 'undefined') {
  initializeFirebase();
}

// export - 클라이언트 사이드에서만 실제 인스턴스 반환
// 'use client' 컴포넌트에서만 사용되므로 서버 사이드에서는 실행되지 않음
export const auth: Auth = (() => {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 더미 객체 (실제로는 사용되지 않음)
    return {} as Auth;
  }
  
  if (!authInstance) {
    initializeFirebase();
    if (!authInstance) {
      // 환경 변수가 없을 때는 더미 객체 반환 (에러 대신)
      // 실제 사용 시점에 에러가 발생하지만, 앱이 크래시되지 않음
      console.error('❌ Firebase Auth 초기화에 실패했습니다. .env.local 파일을 확인해주세요.');
      return {} as Auth;
    }
  }
  
  return authInstance;
})();

export const db: Firestore = (() => {
  if (typeof window === 'undefined') {
    return {} as Firestore;
  }
  
  if (!dbInstance) {
    initializeFirebase();
    if (!dbInstance) {
      console.error('❌ Firestore 초기화에 실패했습니다. .env.local 파일을 확인해주세요.');
      return {} as Firestore;
    }
  }
  
  return dbInstance;
})();

export const googleProvider = new GoogleAuthProvider();
