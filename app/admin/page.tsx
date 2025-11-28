'use client';

import { useEffect, useState } from 'react';

// 동적 렌더링 강제 (prerender 방지)
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import { useAuthState, useSignInWithGoogle, useSignOut } from 'react-firebase-hooks/auth';
import { collection, getDocs, addDoc, query, orderBy, doc, setDoc, where } from 'firebase/firestore';
import Image from 'next/image';
import { auth, db } from '@/lib/firebase';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const [signOut] = useSignOut(auth);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [macAddress, setMacAddress] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // 운영자 권한 확인
  useEffect(() => {
    if (user) {
      checkAdminAccess();
    } else {
      setIsAuthorized(null);
    }
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      setIsAuthorized(false);
      return;
    }

    try {
      // Firestore에서 운영자 권한 확인
      const adminDoc = await getDocs(query(collection(db, 'admins'), where('email', '==', user.email)));
      
      if (!adminDoc.empty) {
        // 운영자 권한이 있음
        setIsAuthorized(true);
        loadUsers();
      } else {
        // 운영자 권한이 없음
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error('권한 확인 실패:', error);
      setIsAuthorized(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (result?.user) {
        // 사용자 정보를 Firestore에 저장
        await setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          displayName: result.user.displayName,
          createdAt: new Date(),
        }, { merge: true });
      }
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      // Firestore에서 사용자 정보를 가져옵니다
      // 실제로는 Firebase Admin SDK를 사용하거나 별도의 users 컬렉션을 관리해야 합니다
      // 여기서는 간단히 구현하기 위해 auth의 사용자 정보를 사용합니다
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const usersData: User[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        usersData.push({
          uid: doc.id,
          email: data.email || null,
          displayName: data.displayName || null,
        });
      });

      // users 컬렉션이 비어있을 경우 현재 사용자 추가
      if (usersData.length === 0 && user) {
        usersData.push({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
      }

      setUsers(usersData);
    } catch (error) {
      console.error('사용자 로드 실패:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubmitMacAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!macAddress.trim() || !selectedUserId) {
      alert('MAC Address와 사용자를 선택해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'macAddresses'), {
        userId: selectedUserId,
        macAddress: macAddress.trim(),
        registeredAt: new Date(),
        registeredBy: user?.uid,
      });

      // 태블릿 정보도 업데이트
      await addDoc(collection(db, 'tablets'), {
        userId: selectedUserId,
        macAddress: macAddress.trim(),
        createdAt: new Date(),
      });

      alert('MAC Address가 등록되었습니다.');
      setMacAddress('');
      setSelectedUserId('');
    } catch (error) {
      console.error('MAC Address 등록 실패:', error);
      alert('등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || isAuthorized === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-4xl font-bold mb-8">ROBO Cloud 운영자</h1>
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

  // 운영자 권한이 없는 경우
  if (!isAuthorized) {
    return (
      <div className="min-h-screen text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-4xl font-bold mb-8">접근 권한 없음</h1>
            <p className="text-blue-200 mb-8">
              운영자 권한이 없습니다. 관리자에게 문의하세요.
            </p>
            <button
              onClick={handleSignOut}
              className="px-6 py-3 border border-blue-500/50 rounded-lg hover:bg-blue-950/30 transition-colors text-white"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    );
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
              onClick={handleSignOut}
              className="px-4 py-2 border border-black rounded hover:bg-gray-100 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">MAC Address 등록</h2>
            <form onSubmit={handleSubmitMacAddress} className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">사용자 선택</label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-4 py-2 border border-blue-500/50 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#0a0e27]/50 text-white"
                  required
                >
                  <option value="">사용자를 선택하세요</option>
                  {users.map((u) => (
                    <option key={u.uid} value={u.uid}>
                      {u.displayName || u.email || u.uid}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium">MAC Address</label>
                <input
                  type="text"
                  value={macAddress}
                  onChange={(e) => setMacAddress(e.target.value)}
                  placeholder="예: AA:BB:CC:DD:EE:FF"
                  className="w-full px-4 py-2 border border-blue-500/50 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#0a0e27]/50 text-white"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 gradient-button text-white rounded transition-colors disabled:opacity-50"
              >
                {submitting ? '등록 중...' : '등록'}
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">가입한 사용자 목록</h2>
            {loadingUsers ? (
              <div className="text-center py-8 text-blue-300">로딩 중...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-blue-500/30">
                      <th className="text-left py-3 px-4 font-semibold">이메일</th>
                      <th className="text-left py-3 px-4 font-semibold">이름</th>
                      <th className="text-left py-3 px-4 font-semibold">UID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.uid} className="border-b border-blue-500/20 hover:bg-blue-950/20">
                        <td className="py-3 px-4">{u.email || '-'}</td>
                        <td className="py-3 px-4">{u.displayName || '-'}</td>
                        <td className="py-3 px-4 font-mono text-sm">{u.uid}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="text-center py-12 text-blue-300">
                    등록된 사용자가 없습니다.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

