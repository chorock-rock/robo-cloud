'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { doc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import { auth, db } from '@/lib/firebase';

export default function Home() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (result?.user) {
        // 사용자 정보를 Firestore에 저장 (비동기로 처리)
        setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          displayName: result.user.displayName,
          createdAt: new Date(),
        }, { merge: true }).catch((error) => {
          console.error('사용자 정보 저장 실패:', error);
        });
      }
      router.push('/user/tablets');
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* 우주 배경 효과 */}
      <div className="pulse-bg"></div>
      <div className="stars">
        {Array.from({ length: 50 }).map((_, i) => (
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
      
      {/* TopBar */}
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
            <div className="flex items-center gap-6">
              {!user && !loading && (
                <button
                  onClick={handleGoogleSignIn}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  구글 로그인
                </button>
              )}
              {user && (
                <a
                  href="/user/tablets"
                  className="text-black hover:opacity-70 transition-opacity font-medium"
                >
                  내 태블릿
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-7xl font-bold mb-6 tracking-tight gradient-text">
            태블릿 기기제어 서비스
          </h1>
          <p className="text-2xl text-blue-200 mb-12 leading-relaxed">
            ROBO Cloud로 모든 태블릿을 원격에서 제어하고 관리하세요
          </p>
          {!user && !loading && (
            <button
              onClick={handleGoogleSignIn}
              className="px-10 py-4 text-white text-lg rounded-lg gradient-button pulse-glow"
            >
              무료로 시작하기
            </button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            강력한 기능들
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center pulse-ring cosmic-icon">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">실시간 모니터링</h3>
              <p className="text-blue-200">
                모든 태블릿의 상태를 실시간으로 확인하고 모니터링하세요
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center pulse-ring cosmic-icon" style={{ animationDelay: '0.5s' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">기기 제어</h3>
              <p className="text-blue-200">
                태블릿의 전원, 설정 등을 원격에서 제어할 수 있습니다
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center pulse-ring cosmic-icon" style={{ animationDelay: '1s' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">기기 정보</h3>
              <p className="text-blue-200">
                MAC 주소, 배터리, 와이파이 강도 등 상세한 기기 정보를 확인하세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-950/30 py-20 relative z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-white">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl text-blue-200 mb-8">
              구글 계정만 있으면 바로 사용할 수 있습니다
            </p>
            {!user && !loading && (
              <button
                onClick={handleGoogleSignIn}
                className="px-10 py-4 text-white text-lg rounded-lg gradient-button pulse-glow"
              >
                무료로 시작하기
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/30 py-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center text-blue-300">
            <p>&copy; 2024 ROBO Cloud. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
