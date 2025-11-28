'use client';

// 동적 렌더링 강제 (prerender 방지)
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import { auth, db } from '@/lib/firebase';

interface Tablet {
  id: string;
  macAddress: string;
  tableNumber: string;
  wifiStrength: string;
  batteryLevel: string;
  version: string;
  ipAddress: string;
  firmwareBuild: string;
  isOn: boolean;
}

export default function TabletsPage() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const [tablets, setTablets] = useState<Tablet[]>([]);
  const [loadingTablets, setLoadingTablets] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/user');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadTablets();
    }
  }, [user]);

  const loadTablets = async () => {
    if (!user) return;

    // 먼저 더미 데이터를 표시하여 빠른 UI 반응
    const dummyData: Tablet[] = [
      {
        id: 'dummy1',
        macAddress: '',
        tableNumber: 'Table 01',
        wifiStrength: '75%',
        batteryLevel: '85%',
        version: 'v1.2.3',
        ipAddress: '192.168.1.100',
        firmwareBuild: 'FW-2024.11.28',
        isOn: true,
      },
      {
        id: 'dummy2',
        macAddress: '',
        tableNumber: 'Table 02',
        wifiStrength: '60%',
        batteryLevel: '92%',
        version: 'v1.2.3',
        ipAddress: '192.168.1.101',
        firmwareBuild: 'FW-2024.11.28',
        isOn: false,
      },
    ];
    setTablets(dummyData);
    setLoadingTablets(false);

    // 백그라운드에서 Firestore 데이터 로드
    try {
      const q = query(
        collection(db, 'tablets'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const tabletsData: Tablet[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tabletsData.push({
          id: doc.id,
          macAddress: data.macAddress || '',
          tableNumber: data.tableNumber || 'N/A',
          wifiStrength: data.wifiStrength || 'N/A',
          batteryLevel: data.batteryLevel || 'N/A',
          version: data.version || 'N/A',
          ipAddress: data.ipAddress || 'N/A',
          firmwareBuild: data.firmwareBuild || 'N/A',
          isOn: data.isOn || false,
        });
      });

      // Firestore에 데이터가 있으면 업데이트, 없으면 더미 데이터 유지
      if (tabletsData.length > 0) {
        setTablets(tabletsData);
      }
    } catch (error) {
      console.error('태블릿 로드 실패:', error);
      // 에러가 발생해도 더미 데이터는 유지
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/user');
  };

  // 인증 로딩만 확인 (태블릿 데이터는 백그라운드에서 로드)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
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
            <div className="flex items-center gap-6">
              <a
                href="/user/tablets"
                className="text-black font-semibold border-b-2 border-black pb-1"
              >
                내 태블릿
              </a>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 border border-blue-500/50 rounded hover:bg-blue-950/30 transition-colors text-white"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
                <tr className="border-b-2 border-blue-500/30">
                <th className="text-left py-3 px-4 font-semibold">MAC Address</th>
                <th className="text-left py-3 px-4 font-semibold">테이블 번호</th>
                <th className="text-left py-3 px-4 font-semibold">와이파이 강도</th>
                <th className="text-left py-3 px-4 font-semibold">배터리 총량</th>
                <th className="text-left py-3 px-4 font-semibold">버전</th>
                <th className="text-left py-3 px-4 font-semibold">IP 주소</th>
                <th className="text-left py-3 px-4 font-semibold">펌웨어 빌드</th>
                <th className="text-left py-3 px-4 font-semibold">On/Off</th>
              </tr>
            </thead>
            <tbody>
              {tablets.map((tablet) => (
                <tr key={tablet.id} className="border-b border-blue-500/20 hover:bg-blue-950/20">
                  <td className="py-3 px-4">{tablet.macAddress || '-'}</td>
                  <td className="py-3 px-4">{tablet.tableNumber}</td>
                  <td className="py-3 px-4">{tablet.wifiStrength}</td>
                  <td className="py-3 px-4">{tablet.batteryLevel}</td>
                  <td className="py-3 px-4">{tablet.version}</td>
                  <td className="py-3 px-4">{tablet.ipAddress}</td>
                  <td className="py-3 px-4">{tablet.firmwareBuild}</td>
                  <td className="py-3 px-4">
                    <span className={tablet.isOn ? 'text-blue-400 font-semibold' : 'text-blue-600'>
                      {tablet.isOn ? 'ON' : 'OFF'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tablets.length === 0 && (
            <div className="text-center py-12 text-blue-300">
              등록된 태블릿이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

