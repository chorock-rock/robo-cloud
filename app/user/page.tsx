'use client';

import { useEffect } from 'react';

// 동적 렌더링 강제 (prerender 방지)
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { doc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import { auth, db } from '@/lib/firebase';

export default function UserPage() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  useEffect(() => {
    if (!loading && user) {
      router.push('/user/tablets');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      // UserSync 컴포넌트가 자동으로 Firestore에 저장하므로 여기서는 로그인만 처리
      await signInWithGoogle();
      // 즉시 리디렉션
      router.push('/user/tablets');
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black">로딩 중...</div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* 우주 배경 효과 */}
      <div className="pulse-bg"></div>
      <div className="stars">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      <nav className="border-b border-blue-500/30 sticky top-0 bg-[#0a0e27]/80 backdrop-blur-md z-50 relative gradient-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Image
                src="/logo.png"
                alt="ROBO Cloud"
                width={200}
                height={60}
                className="h-12 w-auto"
                priority
              />
            </a>
            <button
              onClick={handleGoogleSignIn}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              구글 로그인
            </button>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8">ROBO Cloud</h1>
          <p className="text-blue-200 mb-8">
            구글 계정으로 로그인하여 시작하세요
          </p>
          <button
            onClick={handleGoogleSignIn}
              className="w-full px-6 py-3 gradient-button text-white rounded-lg transition-colors"
          >
            구글 로그인
          </button>
        </div>
      </div>
    </div>
  );
}

