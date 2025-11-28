'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

/**
 * Firebase Auth 상태 변경 시 자동으로 Firestore users 컬렉션에 사용자 정보를 저장하는 컴포넌트
 */
export default function UserSync() {
  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') {
      return;
    }

    // Firebase Auth가 초기화되지 않았으면 리턴
    if (!auth || !db || typeof auth.onAuthStateChanged !== 'function') {
      return;
    }

    // 인증 상태 변경 리스너 등록
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // 사용자 정보를 Firestore users 컬렉션에 저장
          await setDoc(
            doc(db, 'users', user.uid),
            {
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              createdAt: new Date(),
              lastLoginAt: new Date(),
            },
            { merge: true } // 기존 문서가 있으면 병합, 없으면 생성
          );
          console.log('✅ 사용자 정보가 Firestore에 저장되었습니다:', user.email);
        } catch (error) {
          console.error('❌ 사용자 정보 저장 실패:', error);
        }
      }
    });

    // 컴포넌트 언마운트 시 리스너 해제
    return () => {
      unsubscribe();
    };
  }, []);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
}

