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
  storeId?: string;
}

interface Store {
  id: string;
  name: string;
  location: string;
  tabletCount: number;
}

export default function TabletsPage() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const [stores, setStores] = useState<Store[]>([]);
  const [expandedStores, setExpandedStores] = useState<Set<string>>(new Set());
  const [allTablets, setAllTablets] = useState<Tablet[]>([]);
  const [loadingTablets, setLoadingTablets] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [controllingTablet, setControllingTablet] = useState<string | null>(null);
  const [controlModalOpen, setControlModalOpen] = useState(false);
  const [selectedTablet, setSelectedTablet] = useState<Tablet | null>(null);
  const [controlStatus, setControlStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [lastAction, setLastAction] = useState<'turnOn' | 'turnOff' | 'restart' | 'refresh' | null>(null);
  const [tabletScreenState, setTabletScreenState] = useState<'on' | 'off' | 'restarting'>('on');
  const [selectedMenu, setSelectedMenu] = useState<string>('home');
  const [clickedMenu, setClickedMenu] = useState<string | null>(null);
  const { language, toggleLanguage } = useLanguage();
  const t = getTranslation(language);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/user');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadStores();
      loadTablets();
    }
  }, [user]);

  const toggleStore = (storeId: string) => {
    setExpandedStores(prev => {
      const newSet = new Set(prev);
      if (newSet.has(storeId)) {
        newSet.delete(storeId);
      } else {
        newSet.add(storeId);
      }
      return newSet;
    });
  };

  const getTabletsByStore = (storeId: string) => {
    // 검색은 매장만 되므로 태블릿은 필터링하지 않음
    return allTablets.filter(t => t.storeId === storeId);
  };

  const getOriginalTabletCountByStore = (storeId: string) => {
    return allTablets.filter(t => t.storeId === storeId).length;
  };

  const getFilteredStores = () => {
    if (!searchQuery.trim()) {
      return stores;
    }
    
    const query = searchQuery.toLowerCase().trim();
    // 매장명이나 위치로만 검색
    return stores.filter(store => 
      store.name.toLowerCase().includes(query) || 
      store.location.toLowerCase().includes(query)
    );
  };

  const loadStores = async () => {
    if (!user) return;

    // 더미 매장 데이터
    const dummyStores: Store[] = [
      {
        id: 'store1',
        name: '강남점',
        location: '서울시 강남구',
        tabletCount: 2,
      },
      {
        id: 'store2',
        name: '홍대점',
        location: '서울시 마포구',
        tabletCount: 3,
      },
      {
        id: 'store3',
        name: '명동점',
        location: '서울시 중구',
        tabletCount: 1,
      },
    ];
    setStores(dummyStores);
  };

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
        storeId: 'store1',
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
        storeId: 'store1',
      },
      {
        id: 'dummy3',
        macAddress: '',
        tableNumber: 'Table 03',
        wifiStrength: '80%',
        batteryLevel: '88%',
        version: 'v1.2.3',
        ipAddress: '192.168.1.102',
        firmwareBuild: 'FW-2024.11.28',
        isOn: true,
        storeId: 'store2',
      },
    ];
    setAllTablets(dummyData);
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
        setAllTablets(tabletsData);
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

  const handleRemoteControl = (tablet: Tablet) => {
    setSelectedTablet(tablet);
    setControlModalOpen(true);
    setControlStatus('idle');
    setTabletScreenState(tablet.isOn ? 'on' : 'off');
    setLastAction(null);
    setSelectedMenu('home');
    setClickedMenu(null);
  };

  const handleMenuClick = (menuId: string) => {
    setClickedMenu(menuId);
    setTimeout(() => {
      setSelectedMenu(menuId);
      setClickedMenu(null);
    }, 200);
  };

  const executeControl = async (action: 'turnOn' | 'turnOff' | 'restart' | 'refresh') => {
    if (!selectedTablet) return;

    setControlStatus('loading');
    setControllingTablet(selectedTablet.id);
    setLastAction(action);

    // 태블릿 화면 상태 업데이트
    if (action === 'turnOn') {
      setTabletScreenState('on');
    } else if (action === 'turnOff') {
      setTabletScreenState('off');
    } else if (action === 'restart') {
      setTabletScreenState('restarting');
    }

    // 원격 제어 시뮬레이션 (실제로는 API 호출)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5초 대기

      // 성공/실패 랜덤 시뮬레이션 (90% 성공률)
      const success = Math.random() > 0.1;
      
      if (success) {
        setControlStatus('success');
        
        // 재시작 완료 후 화면 켜기
        if (action === 'restart') {
          setTimeout(() => {
            setTabletScreenState('on');
          }, 500);
        }
        
        // 상태 새로고침인 경우 태블릿 목록 업데이트
        if (action === 'refresh') {
          await loadTablets();
        }
        
        // 2초 후 모달 닫기
        setTimeout(() => {
          setControlModalOpen(false);
          setControlStatus('idle');
          setControllingTablet(null);
          setLastAction(null);
          setTabletScreenState(selectedTablet.isOn ? 'on' : 'off');
        }, 2000);
      } else {
        setControlStatus('error');
        // 실패 시 원래 상태로 복구
        setTabletScreenState(selectedTablet.isOn ? 'on' : 'off');
        setTimeout(() => {
          setControlStatus('idle');
        }, 2000);
      }
    } catch (error) {
      setControlStatus('error');
      setTabletScreenState(selectedTablet.isOn ? 'on' : 'off');
      setTimeout(() => {
        setControlStatus('idle');
      }, 2000);
    } finally {
      setControllingTablet(null);
    }
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
      <nav className="fixed top-0 left-0 right-0 bg-blue-950/80 backdrop-blur-md border-b border-blue-500/20 z-50">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Image
                src="/logo.png"
                alt="ROBO Cloud"
                width={200}
                height={60}
                className="h-8 w-auto"
                priority
              />
            </a>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleLanguage}
                className="px-2.5 py-1 border border-blue-500/50 rounded hover:bg-blue-950/30 transition-colors text-white text-xs font-medium"
                title={language === 'ko' ? 'Switch to English' : '한국어로 전환'}
              >
                {language === 'ko' ? 'EN' : '한'}
              </button>
              <a
                href="/user/tablets"
                className="text-white hover:opacity-70 transition-opacity font-medium text-sm border-b-2 border-blue-400 pb-0.5"
              >
                {t.nav.myTablets}
              </a>
              <a
                href="/wifi-qr"
                className="text-white hover:opacity-70 transition-opacity font-medium text-sm"
              >
                {t.nav.wifiQr}
              </a>
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 border border-blue-500/50 rounded hover:bg-blue-950/30 transition-colors text-white text-sm"
              >
                {t.nav.logout}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 pt-20 relative z-10">
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
            <div className="text-3xl font-bold text-white">{allTablets.length}</div>
            <div className="text-blue-400 text-xs mt-1">{t.tablets.registeredDevices}</div>
          </div>
          <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
            <div className="text-blue-300 text-xs mb-1">{t.tablets.activeDevices}</div>
            <div className="text-3xl font-bold text-green-400">
              {allTablets.filter(t => t.isOn).length}
            </div>
            <div className="text-blue-400 text-xs mt-1">/ {allTablets.length} {t.tablets.devices}</div>
          </div>
          <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
            <div className="text-blue-300 text-xs mb-1">{t.tablets.avgBattery}</div>
            <div className="text-3xl font-bold text-white">
              {allTablets.length > 0 
                ? Math.round(
                    allTablets.reduce((sum, t) => {
                      const battery = parseInt(t.batteryLevel) || 0;
                      return sum + battery;
                    }, 0) / allTablets.length
                  )
                : 0}%
            </div>
            <div className="text-blue-400 text-xs mt-1">{t.tablets.allDevices}</div>
          </div>
          <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
            <div className="text-blue-300 text-xs mb-1">{t.tablets.avgWifi}</div>
            <div className="text-3xl font-bold text-white">
              {allTablets.length > 0 
                ? Math.round(
                    allTablets.reduce((sum, t) => {
                      const wifi = parseInt(t.wifiStrength) || 0;
                      return sum + wifi;
                    }, 0) / allTablets.length
                  )
                : 0}%
            </div>
            <div className="text-blue-400 text-xs mt-1">{t.tablets.connectionStrength}</div>
          </div>
        </div>

        {/* 검색 필터 */}
        <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.tablets.searchPlaceholder}
                className="w-full px-4 py-3 bg-blue-900/30 border border-blue-500/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
              >
                {t.tablets.clearSearch}
              </button>
            )}
          </div>
        </div>

        {/* 매장 목록 아코디언 */}
        <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg border border-blue-500/20 flex flex-col">
          <div className="p-6 pb-4 flex-shrink-0">
            <h2 className="text-2xl font-bold gradient-text">{t.tablets.storeList}</h2>
          </div>
          <div className="px-6 pb-6 min-h-[400px] max-h-[600px] overflow-y-auto scrollbar-always flex-1">
            {stores.length === 0 ? (
              <div className="text-center py-12 text-blue-300">
                {t.tablets.noStore}
              </div>
            ) : (
              <div className="space-y-4">
              {getFilteredStores().map((store) => {
                const isExpanded = expandedStores.has(store.id);
                const storeTablets = getTabletsByStore(store.id);
                const originalTabletCount = getOriginalTabletCountByStore(store.id);
                return (
                  <div key={store.id} className="border border-blue-500/30 rounded-lg overflow-hidden">
                    {/* 매장 헤더 */}
                    <button
                      onClick={() => toggleStore(store.id)}
                      className={`w-full p-4 text-left transition-all ${
                        isExpanded
                          ? 'bg-blue-900/50 border-b border-blue-500/30'
                          : 'bg-blue-950/30 hover:bg-blue-900/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-xl font-bold text-white mb-1">{store.name}</div>
                          <div className="text-sm text-blue-300">{store.location}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-blue-400">
                            {searchQuery.trim() && storeTablets.length === 0 ? (
                              <span className="text-blue-500">{originalTabletCount} {t.tablets.tabletsInStore} ({t.tablets.noSearchResults})</span>
                            ) : (
                              <span>{originalTabletCount} {t.tablets.tabletsInStore}</span>
                            )}
                          </div>
                          <svg
                            className={`w-5 h-5 text-blue-400 transition-transform ${
                              isExpanded ? 'transform rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    
                    {/* 태블릿 목록 (아코디언 콘텐츠) */}
                    {isExpanded && (
                      <div className="bg-blue-950/20 p-4">
                        {storeTablets.length === 0 ? (
                          <div className="text-center py-8 text-blue-300">
                            {t.tablets.noTablets}
                          </div>
                        ) : (
                          <div className="overflow-x-auto scrollbar-always">
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
                                  <th className="text-left py-3 px-4 font-semibold text-blue-200">{t.tablets.remoteControl}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {storeTablets.map((tablet) => {
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
                                      <td className="py-3 px-4">
                                        <button
                                          onClick={() => handleRemoteControl(tablet)}
                                          disabled={controllingTablet === tablet.id}
                                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                            controllingTablet === tablet.id
                                              ? 'bg-blue-600/50 text-blue-300 cursor-not-allowed'
                                              : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105 active:scale-95'
                                          }`}
                                        >
                                          {controllingTablet === tablet.id ? t.tablets.controlling : t.tablets.remoteControl}
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 원격 제어 모달 */}
      {controlModalOpen && selectedTablet && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-blue-950/95 backdrop-blur-md rounded-lg border border-blue-500/30 p-6 max-w-7xl w-full h-full max-h-full flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
              <h3 className="text-2xl font-bold gradient-text">{t.tablets.controlOptions} - {selectedTablet.tableNumber}</h3>
              <button
                onClick={() => {
                  setControlModalOpen(false);
                  setControlStatus('idle');
                  setSelectedTablet(null);
                  setTabletScreenState(selectedTablet.isOn ? 'on' : 'off');
                  setLastAction(null);
                }}
                className="text-gray-400 hover:text-white transition-colors text-2xl"
              >
                ×
              </button>
            </div>

            <div className="relative flex items-center justify-center flex-1 min-h-0">
              {/* 리모컨 네비게이션 - 태블릿 밖 영역 상단에 가로로 배치 */}
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-lg p-3 shadow-xl">
                <div className="flex gap-2">
                  {controlStatus === 'idle' && (
                    <>
                      <button
                        onClick={() => executeControl('turnOn')}
                        disabled={controllingTablet === selectedTablet.id}
                        className="flex flex-col items-center justify-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        title={t.tablets.turnOnDevice}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[10px] font-medium">{t.tablets.turnOnDevice}</span>
                      </button>
                      <button
                        onClick={() => executeControl('turnOff')}
                        disabled={controllingTablet === selectedTablet.id}
                        className="flex flex-col items-center justify-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        title={t.tablets.turnOffDevice}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-[10px] font-medium">{t.tablets.turnOffDevice}</span>
                      </button>
                      <button
                        onClick={() => executeControl('restart')}
                        disabled={controllingTablet === selectedTablet.id}
                        className="flex flex-col items-center justify-center gap-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        title={t.tablets.restartDevice}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="text-[10px] font-medium">{t.tablets.restartDevice}</span>
                      </button>
                      <button
                        onClick={() => executeControl('refresh')}
                        disabled={controllingTablet === selectedTablet.id}
                        className="flex flex-col items-center justify-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        title={t.tablets.refreshStatus}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="text-[10px] font-medium">{t.tablets.refreshStatus}</span>
                      </button>
                    </>
                  )}

                  {controlStatus === 'loading' && (
                    <div className="flex flex-col items-center justify-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[10px] font-medium">{t.tablets.controlling}</span>
                    </div>
                  )}

                  {controlStatus === 'success' && (
                    <div className="flex flex-col items-center justify-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[10px] font-medium">{t.tablets.controlSuccess}</span>
                    </div>
                  )}

                  {controlStatus === 'error' && (
                    <div className="flex flex-col items-center justify-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-[10px] font-medium">{t.tablets.controlFailed}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 태블릿 화면 시뮬레이션 - 가로 방향 */}
              <div className="relative w-full h-full max-h-full flex items-center justify-center">
                {/* 태블릿 프레임 - 가로 방향 */}
                <div className="bg-gray-800 shadow-2xl border-4 border-gray-700 w-full max-w-full h-full max-h-full aspect-[16/9] flex items-center justify-center" style={{ borderRadius: '2rem', padding: '1rem' }}>
                  {/* 태블릿 화면 */}
                  <div 
                    className={`bg-black overflow-hidden transition-all duration-500 w-full h-full ${tabletScreenState === 'off' ? 'opacity-0' : 'opacity-100'}`}
                    style={{ borderRadius: '1.5rem' }}
                  >
                      {tabletScreenState === 'off' ? (
                        <div className="w-full h-full flex items-center justify-center bg-black">
                          <div className="text-gray-600 text-lg">화면 꺼짐</div>
                        </div>
                      ) : tabletScreenState === 'restarting' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-black">
                          <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                          <div className="text-blue-300 text-lg font-semibold">재시작 중...</div>
                        </div>
                      ) : controlStatus === 'loading' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-black">
                          <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                          <div className="text-blue-300 text-lg font-semibold">{t.tablets.controlling}</div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-black p-4 flex flex-col">
                          {/* 상태바 */}
                          <div className="flex justify-between items-center mb-3 text-white text-xs">
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-2 border border-white rounded-sm">
                                <div className="w-full h-full bg-white"></div>
                              </div>
                              <span>100%</span>
                            </div>
                            <div className="font-semibold text-xs">ROBO Cloud</div>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                              </svg>
                              <span>Wi-Fi</span>
                            </div>
                          </div>

                          {/* 메인 콘텐츠 영역 - 가로 레이아웃 */}
                          <div className="flex-1 flex gap-4 overflow-hidden">
                            {/* 왼쪽: 메뉴 바 (세로) */}
                            <div className="flex flex-col gap-2 bg-blue-950/30 rounded-lg p-2 w-20 flex-shrink-0">
                              {[
                                { id: 'home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                                { id: 'settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
                                { id: 'info', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                                { id: 'stats', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                                { id: 'control', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
                              ].map((menu) => (
                                <button
                                  key={menu.id}
                                  onClick={() => handleMenuClick(menu.id)}
                                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-md transition-all duration-200 ${
                                    selectedMenu === menu.id
                                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                                      : clickedMenu === menu.id
                                      ? 'bg-blue-700 text-white scale-95'
                                      : 'bg-transparent text-blue-300 hover:bg-blue-900/30'
                                  }`}
                                >
                                  <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menu.icon} />
                                  </svg>
                                  <span className="text-[10px] font-medium text-center leading-tight">
                                    {menu.id === 'home' && t.tablets.menuHome}
                                    {menu.id === 'settings' && t.tablets.menuSettings}
                                    {menu.id === 'info' && t.tablets.menuInfo}
                                    {menu.id === 'stats' && t.tablets.menuStats}
                                    {menu.id === 'control' && t.tablets.menuControl}
                                  </span>
                                </button>
                              ))}
                            </div>

                            {/* 오른쪽: 콘텐츠 영역 */}
                            <div className="flex-1 overflow-y-auto">
                              {selectedMenu === 'home' && (
                                <div className="space-y-3">
                                  {/* 헤더 */}
                                  <div className="flex justify-between items-center mb-3">
                                    <div>
                                      <div className="text-lg font-bold text-white">{selectedTablet.tableNumber}</div>
                                      <div className="text-xs text-blue-300">{t.tablets.menuManagement}</div>
                                    </div>
                                    <button className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs rounded-lg transition-all">
                                      {t.tablets.addMenu}
                                    </button>
                                  </div>

                                  {/* 카테고리 탭 */}
                                  <div className="flex gap-2 overflow-x-auto pb-2">
                                    {['전체', '메인', '사이드', '음료', '디저트'].map((cat, idx) => (
                                      <button
                                        key={idx}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                                          idx === 0
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50'
                                        }`}
                                      >
                                        {cat}
                                      </button>
                                    ))}
                                  </div>

                                  {/* 메뉴 목록 */}
                                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                    {[
                                      { name: '스테이크 정식', category: '메인', price: '25,000원', status: 'available' },
                                      { name: '파스타 세트', category: '메인', price: '18,000원', status: 'available' },
                                      { name: '치킨 샐러드', category: '사이드', price: '12,000원', status: 'available' },
                                      { name: '콜라', category: '음료', price: '3,000원', status: 'soldOut' },
                                      { name: '아이스크림', category: '디저트', price: '5,000원', status: 'available' },
                                    ].map((menu, idx) => (
                                      <div
                                        key={idx}
                                        className="bg-blue-900/50 rounded-lg p-2 border border-blue-700/50 hover:border-blue-500/50 transition-all"
                                      >
                                        <div className="flex justify-between items-start mb-1">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-white text-sm font-semibold">{menu.name}</span>
                                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                                menu.status === 'available'
                                                  ? 'bg-green-500/20 text-green-400'
                                                  : 'bg-red-500/20 text-red-400'
                                              }`}>
                                                {menu.status === 'available' ? t.tablets.available : t.tablets.soldOut}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                              <span className="text-blue-300">{menu.category}</span>
                                              <span className="text-white font-semibold">{menu.price}</span>
                                            </div>
                                          </div>
                                          <div className="flex gap-1">
                                            <button className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] rounded transition-all">
                                              {t.tablets.editMenu}
                                            </button>
                                            <button className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-[10px] rounded transition-all">
                                              {t.tablets.deleteMenu}
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {selectedMenu === 'settings' && (
                                <div className="space-y-2">
                                  <div className="text-white text-sm font-semibold mb-2">{t.tablets.menuSettings}</div>
                                  {['Wi-Fi 설정', '화면 밝기', '알림 설정', '언어 설정'].map((item, idx) => (
                                    <div key={idx} className="bg-blue-900/50 rounded-lg p-2 border border-blue-700/50 flex items-center justify-between">
                                      <span className="text-white text-xs">{item}</span>
                                      <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {selectedMenu === 'info' && (
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="text-white text-sm font-semibold mb-2 col-span-2">{t.tablets.menuInfo}</div>
                                  <div className="bg-blue-900/50 rounded-lg p-2 border border-blue-700/50">
                                    <div className="text-xs text-blue-300 mb-1">{t.tablets.version}</div>
                                    <div className="text-sm font-semibold text-white">{selectedTablet.version}</div>
                                  </div>
                                  <div className="bg-blue-900/50 rounded-lg p-2 border border-blue-700/50">
                                    <div className="text-xs text-blue-300 mb-1">{t.tablets.firmwareBuild}</div>
                                    <div className="text-sm font-semibold text-white">{selectedTablet.firmwareBuild}</div>
                                  </div>
                                  <div className="bg-blue-900/50 rounded-lg p-2 border border-blue-700/50 col-span-2">
                                    <div className="text-xs text-blue-300 mb-1">{t.tablets.ipAddress}</div>
                                    <div className="text-xs font-mono text-white">{selectedTablet.ipAddress}</div>
                                  </div>
                                </div>
                              )}

                              {selectedMenu === 'stats' && (
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="text-white text-sm font-semibold mb-2 col-span-2">{t.tablets.menuStats}</div>
                                  <div className="bg-blue-900/50 rounded-lg p-2 border border-blue-700/50">
                                    <div className="text-xs text-blue-300 mb-1">사용 시간</div>
                                    <div className="text-sm font-semibold text-white">24시간 30분</div>
                                  </div>
                                  <div className="bg-blue-900/50 rounded-lg p-2 border border-blue-700/50">
                                    <div className="text-xs text-blue-300 mb-1">평균 배터리</div>
                                    <div className="text-sm font-semibold text-white">{selectedTablet.batteryLevel}</div>
                                  </div>
                                  <div className="bg-blue-900/50 rounded-lg p-2 border border-blue-700/50 col-span-2">
                                    <div className="text-xs text-blue-300 mb-1">네트워크 상태</div>
                                    <div className="text-sm font-semibold text-green-400">정상</div>
                                  </div>
                                </div>
                              )}

                              {selectedMenu === 'control' && (
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="text-white text-sm font-semibold mb-2 col-span-2">{t.tablets.menuControl}</div>
                                  <div className="bg-blue-900/50 rounded-lg p-2 border border-blue-700/50">
                                    <div className="text-xs text-blue-300 mb-1">원격 제어 상태</div>
                                    <div className="text-sm font-semibold text-green-400">활성화</div>
                                  </div>
                                  <div className="bg-blue-900/50 rounded-lg p-2 border border-blue-700/50">
                                    <div className="text-xs text-blue-300 mb-1">마지막 제어</div>
                                    <div className="text-xs text-white">방금 전</div>
                                  </div>
                                </div>
                              )}

                              {controlStatus === 'success' && (
                                <div className="mt-2 flex items-center gap-2 text-green-400 text-xs bg-green-900/20 rounded-lg p-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>{t.tablets.controlSuccess}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}

