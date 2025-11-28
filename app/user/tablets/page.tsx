'use client';

// 동적 렌더링 강제 (prerender 방지)
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import { auth, db } from '@/lib/firebase';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/i18n';

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
  const { language, toggleLanguage } = useLanguage();
  const t = getTranslation(language);

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
      <div className="min-h-screen flex items-center justify-center bg-[#000000] text-white relative overflow-hidden">
        <div className="pulse-bg"></div>
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  // 로그인하지 않은 사용자는 로그인 페이지로 리디렉션
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#000000] text-white relative overflow-hidden">
        <div className="pulse-bg"></div>
        <div className="text-center relative z-10">
          <div className="text-white mb-4">로그인이 필요합니다.</div>
          <a
            href="/user"
            className="px-6 py-2 gradient-button text-white rounded-lg hover:scale-105 transition-transform inline-block"
          >
            로그인 페이지로 이동
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white relative overflow-hidden">
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
      <nav className="fixed top-0 left-0 right-0 bg-transparent z-50">
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
              <button
                onClick={toggleLanguage}
                className="px-3 py-1.5 border border-blue-500/50 rounded hover:bg-blue-950/30 transition-colors text-white text-sm font-medium"
                title={language === 'ko' ? 'Switch to English' : '한국어로 전환'}
              >
                {language === 'ko' ? 'EN' : '한'}
              </button>
              <a
                href="/user/tablets"
                className="text-white hover:opacity-70 transition-opacity font-medium border-b-2 border-blue-400 pb-1"
              >
                {t.nav.myTablets}
              </a>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 border border-blue-500/50 rounded hover:bg-blue-950/30 transition-colors text-white"
              >
                {t.nav.logout}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 pt-24 relative z-10">
        {/* 대시보드 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 gradient-text">{t.tablets.title}</h1>
          <p className="text-lg md:text-xl text-blue-200">
            {t.tablets.description}
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
            <div className="text-blue-300 text-xs mb-1">{t.tablets.totalTablets}</div>
            <div className="text-3xl font-bold text-white">{tablets.length}</div>
            <div className="text-blue-400 text-xs mt-1">{t.tablets.registeredDevices}</div>
          </div>
          <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
            <div className="text-blue-300 text-xs mb-1">{t.tablets.activeDevices}</div>
            <div className="text-3xl font-bold text-green-400">
              {tablets.filter(t => t.isOn).length}
            </div>
            <div className="text-blue-400 text-xs mt-1">/ {tablets.length} {t.tablets.devices}</div>
          </div>
          <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
            <div className="text-blue-300 text-xs mb-1">{t.tablets.avgBattery}</div>
            <div className="text-3xl font-bold text-white">
              {tablets.length > 0 
                ? Math.round(
                    tablets.reduce((sum, t) => {
                      const battery = parseInt(t.batteryLevel) || 0;
                      return sum + battery;
                    }, 0) / tablets.length
                  )
                : 0}%
            </div>
            <div className="text-blue-400 text-xs mt-1">{t.tablets.allDevices}</div>
          </div>
          <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
            <div className="text-blue-300 text-xs mb-1">{t.tablets.avgWifi}</div>
            <div className="text-3xl font-bold text-white">
              {tablets.length > 0 
                ? Math.round(
                    tablets.reduce((sum, t) => {
                      const wifi = parseInt(t.wifiStrength) || 0;
                      return sum + wifi;
                    }, 0) / tablets.length
                  )
                : 0}%
            </div>
            <div className="text-blue-400 text-xs mt-1">{t.tablets.connectionStrength}</div>
          </div>
        </div>

        {/* 태블릿 목록 카드 */}
        <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
          <h2 className="text-2xl font-bold mb-6 gradient-text">{t.tablets.tabletList}</h2>
          {tablets.length === 0 ? (
            <div className="text-center py-12 text-blue-300">
              {t.tablets.noTablets}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-blue-500/30">
                    <th className="text-left py-3 px-4 font-semibold text-blue-200">{t.tablets.macAddress}</th>
                    <th className="text-left py-3 px-4 font-semibold text-blue-200">{t.tablets.tableNumber}</th>
                    <th className="text-left py-3 px-4 font-semibold text-blue-200">{t.tablets.wifiStrength}</th>
                    <th className="text-left py-3 px-4 font-semibold text-blue-200">{t.tablets.batteryLevel}</th>
                    <th className="text-left py-3 px-4 font-semibold text-blue-200">{t.tablets.version}</th>
                    <th className="text-left py-3 px-4 font-semibold text-blue-200">{t.tablets.ipAddress}</th>
                    <th className="text-left py-3 px-4 font-semibold text-blue-200">{t.tablets.firmwareBuild}</th>
                    <th className="text-left py-3 px-4 font-semibold text-blue-200">{t.tablets.onOff}</th>
                  </tr>
                </thead>
                <tbody>
                  {tablets.map((tablet) => {
                    const statusText = tablet.isOn ? "ON" : "OFF";
                    const statusClass = tablet.isOn ? "text-green-400 font-semibold" : "text-gray-400";
                    const batteryValue = parseInt(tablet.batteryLevel) || 0;
                    const wifiValue = parseInt(tablet.wifiStrength) || 0;
                    return (
                      <tr key={tablet.id} className="border-b border-blue-500/10 hover:bg-blue-900/20 transition-colors">
                        <td className="py-3 px-4 text-white font-mono text-sm">{tablet.macAddress || "-"}</td>
                        <td className="py-3 px-4 text-white">{tablet.tableNumber}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-white">{tablet.wifiStrength}</span>
                            <div className="w-16 bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  wifiValue > 70 ? 'bg-green-500' : 
                                  wifiValue > 40 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${wifiValue}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-white">{tablet.batteryLevel}</span>
                            <div className="w-16 bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  batteryValue > 80 ? 'bg-green-500' : 
                                  batteryValue > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${batteryValue}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white">{tablet.version}</td>
                        <td className="py-3 px-4 text-white font-mono text-sm">{tablet.ipAddress}</td>
                        <td className="py-3 px-4 text-white text-sm">{tablet.firmwareBuild}</td>
                        <td className="py-3 px-4">
                          <span className={statusClass}>
                            {statusText}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

