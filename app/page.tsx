'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState, useSignInWithGoogle, useSignOut } from 'react-firebase-hooks/auth';
import { doc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import { auth, db } from '@/lib/firebase';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/i18n';

// 숫자 카운트업 훅
function useCountUp(end: number, duration: number = 2000, start: number = 0, isVisible: boolean = false) {
    const [count, setCount] = useState(start);
    
    useEffect(() => {
        if (!isVisible) return;
        
        let startTime: number | null = null;
        const animate = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(start + (end - start) * easeOutQuart));
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };
        
        requestAnimationFrame(animate);
    }, [end, duration, start, isVisible]);
    
    return count;
}

// 섹션 가시성 감지 훅
function useSectionVisibility(ref: React.RefObject<HTMLElement | null>) {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );
        
        if (ref.current) {
            observer.observe(ref.current);
        }
        
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref]);
    
    return isVisible;
}

// MonitoringCard 컴포넌트
interface MonitoringCardProps {
    label: string;
    value: number | string;
    suffix?: string;
    showProgress?: boolean;
    progressValue?: number;
    progressColor?: string;
    isStatus?: boolean;
}

function MonitoringCard({ label, value, suffix, showProgress, progressValue, progressColor, isStatus }: MonitoringCardProps) {
    return (
        <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
            <div className="text-blue-300 text-xs mb-1">{label}</div>
            <div className={`text-3xl font-bold ${isStatus ? 'text-green-400' : 'text-white'}`}>
                {value}{typeof value === 'number' ? '' : ''}
            </div>
            {showProgress && progressValue !== undefined && (
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                        className={`${progressColor || 'bg-blue-500'} h-2 rounded-full transition-all duration-1000`}
                        style={{ width: `${progressValue}%` }}
                    ></div>
                </div>
            )}
            {suffix && !showProgress && (
                <div className={`text-blue-400 text-xs mt-1`}>{suffix}</div>
            )}
        </div>
    );
}

export default function Home() {
    const router = useRouter();
    const [user, loading] = useAuthState(auth);
    const [signInWithGoogle] = useSignInWithGoogle(auth);
    const [signOut] = useSignOut(auth);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { language, toggleLanguage } = useLanguage();
    const t = getTranslation(language);
    
    // 섹션 refs
    const monitoringSectionRef = useRef<HTMLElement | null>(null);
    const controlSectionRef = useRef<HTMLElement | null>(null);
    const infoSectionRef = useRef<HTMLElement | null>(null);
    
    // 섹션 가시성
    const isMonitoringVisible = useSectionVisibility(monitoringSectionRef);
    const isControlVisible = useSectionVisibility(controlSectionRef);
    const isInfoVisible = useSectionVisibility(infoSectionRef);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        let isScrolling = false;

        const handleWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                
                if (isScrolling) return;
                isScrolling = true;

                const scrollAmount = e.deltaY > 0 ? container.clientWidth : -container.clientWidth;
                const targetScroll = container.scrollLeft + scrollAmount;
                
                container.scrollTo({
                    left: targetScroll,
                    behavior: 'smooth'
                });

                setTimeout(() => {
                    isScrolling = false;
                }, 800);
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, []);

    const handleGoogleSignIn = async () => {
        try {
            // UserSync 컴포넌트가 자동으로 Firestore에 저장하므로 여기서는 로그인만 처리
            await signInWithGoogle();
            // 로그인 후 자동 리다이렉트 제거 - 사용자가 마케팅 페이지에 머물 수 있도록
        } catch (error) {
            console.error('로그인 실패:', error);
        }
    };

    return (
        <div className="min-h-screen text-white relative overflow-hidden bg-[#000000]">
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
                                href={user ? "/user/tablets" : "/user"}
                                className={`text-white hover:opacity-70 transition-opacity font-medium ${user ? "border-b-2 border-blue-400 pb-1" : ""
                                    }`}
                            >
                                {t.nav.myTablets}
                            </a>
                            {user && (
                                <button
                                    onClick={async () => {
                                        await signOut();
                                        router.push('/user');
                                    }}
                                    className="px-4 py-2 border border-blue-500/50 rounded hover:bg-blue-950/30 transition-colors text-white"
                                >
                                    {t.nav.logout}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Horizontal Scroll Container */}
            <div 
                ref={scrollContainerRef}
                className="flex overflow-x-scroll overflow-y-hidden h-screen snap-x snap-mandatory scrollbar-hide"
                style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                    scrollBehavior: 'smooth'
                }}
            >
                {/* Hero Section */}
                <section className="min-w-full h-screen flex items-center justify-center snap-center relative z-10">
                    <div className="max-w-4xl mx-auto text-center px-4">
                        <h1 className="text-7xl font-bold mb-6 tracking-tight gradient-text">
                            {t.hero.title}
                        </h1>
                        <p className="text-2xl text-blue-200 mb-12 leading-relaxed">
                            {t.hero.subtitle}
                        </p>
                        {!user && !loading && (
                            <button
                                onClick={handleGoogleSignIn}
                                className="px-10 py-4 text-white text-lg rounded-lg gradient-button pulse-glow flex items-center gap-3 mx-auto"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                {t.hero.googleLogin}
                            </button>
                        )}
                    </div>
                </section>

                {/* 실시간 모니터링 Section */}
                <section ref={monitoringSectionRef} className="min-w-full min-h-screen flex items-center justify-center snap-center relative z-10 py-12">
                    <div className="max-w-7xl mx-auto px-4 w-full">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center pulse-ring cosmic-icon icon-3d-1">
                                <svg className="w-10 h-10 text-white icon-3d-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-3 gradient-text">{t.features.monitoring.title}</h2>
                            <p className="text-lg md:text-xl text-blue-200">
                                {t.features.monitoring.description}
                            </p>
                        </div>

                        {/* 대시보드 카드 */}
                        <div className="grid md:grid-cols-4 gap-4 mb-6">
                            <MonitoringCard 
                                label={t.features.monitoring.activeDevices} 
                                value={useCountUp(24, 1500, 0, isMonitoringVisible)} 
                                suffix={t.features.monitoring.totalDevices}
                            />
                            <MonitoringCard 
                                label={t.features.monitoring.avgBattery} 
                                value={useCountUp(78, 1500, 0, isMonitoringVisible)} 
                                suffix="%"
                                showProgress={true}
                                progressValue={78}
                                progressColor="bg-blue-500"
                            />
                            <MonitoringCard 
                                label={t.features.monitoring.avgWifi} 
                                value={useCountUp(85, 1500, 0, isMonitoringVisible)} 
                                suffix="%"
                                showProgress={true}
                                progressValue={85}
                                progressColor="bg-green-500"
                            />
                            <MonitoringCard 
                                label={t.features.monitoring.systemStatus} 
                                value={t.features.monitoring.normal}
                                suffix={t.features.monitoring.allSystemsRunning}
                                isStatus={true}
                            />
                        </div>

                        {/* 차트 */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                                <h3 className="text-lg font-semibold mb-3 text-white">{t.features.monitoring.hourlyActiveDevices}</h3>
                                <div className="h-40 flex items-end justify-between gap-1.5">
                                    {[
                                        { time: '09:00', value: 12, color: 'from-blue-300 to-blue-500' },
                                        { time: '10:00', value: 28, color: 'from-blue-500 to-blue-700' },
                                        { time: '11:00', value: 35, color: 'from-cyan-500 to-blue-600' },
                                        { time: '12:00', value: 42, color: 'from-blue-600 to-indigo-700' },
                                        { time: '13:00', value: 38, color: 'from-indigo-500 to-blue-600' },
                                        { time: '14:00', value: 22, color: 'from-blue-500 to-cyan-600' },
                                        { time: '15:00', value: 18, color: 'from-blue-400 to-blue-600' },
                                        { time: '16:00', value: 8, color: 'from-blue-300 to-blue-500' },
                                    ].map((item, index) => {
                                        const maxValue = 45;
                                        const containerHeight = 160; // h-40 = 160px
                                        const heightPercent = (item.value / maxValue) * 100;
                                        const heightPx = Math.max((containerHeight * heightPercent) / 100, 8); // 최소 8px
                                        return (
                                            <div key={index} className="flex-1 flex flex-col items-center justify-end group">
                                                <div className="relative w-full">
                                                    <div 
                                                        className={`w-full bg-gradient-to-t ${item.color} rounded-t transition-all hover:opacity-90 hover:scale-105 chart-bar ${isMonitoringVisible ? `animate chart-bar-delay-${index + 1}` : ''} shadow-lg shadow-blue-500/30`}
                                                        style={{ 
                                                            height: `${heightPx}px`,
                                                            boxShadow: isMonitoringVisible ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none'
                                                        }}
                                                    >
                                                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-900/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                                            {item.value}개
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-blue-300 mt-2 font-medium">{item.time}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                                <h3 className="text-lg font-semibold mb-3 text-white">{t.features.monitoring.deviceBatteryStatus}</h3>
                                <div className="space-y-2">
                                    {['Tablet 01', 'Tablet 02', 'Tablet 03', 'Tablet 04', 'Tablet 05'].map((name, index) => {
                                        const battery = [85, 92, 75, 88, 90][index];
                                        const batteryCount = useCountUp(battery, 1500, 0, isMonitoringVisible);
                                        return (
                                            <div key={index} className={`chart-bar ${isMonitoringVisible ? `animate chart-bar-delay-${index + 1}` : ''}`}>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-blue-200">{name}</span>
                                                    <span className="text-white font-semibold">{batteryCount}%</span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-1.5">
                                                    <div 
                                                        className={`h-1.5 rounded-full transition-all duration-1000 ${
                                                            battery > 80 ? 'bg-green-500' : 
                                                            battery > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                        style={{ width: isMonitoringVisible ? `${battery}%` : '0%' }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 기기 제어 Section */}
                <section ref={controlSectionRef} className="min-w-full min-h-screen flex items-center justify-center snap-center relative z-10 py-12">
                    <div className="max-w-7xl mx-auto px-4 w-full">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center pulse-ring cosmic-icon icon-3d-2">
                                <svg className="w-10 h-10 text-white icon-3d-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-3 gradient-text">{t.features.control.title}</h2>
                            <p className="text-lg md:text-xl text-blue-200">
                                {t.features.control.description}
                            </p>
                        </div>

                        {/* 대시보드 카드 */}
                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                                <div className="text-blue-300 text-xs mb-1">{t.features.control.totalControls}</div>
                                <div className="text-3xl font-bold text-white">{useCountUp(191, 1500, 0, isControlVisible)}</div>
                                <div className="text-blue-400 text-xs mt-1">{t.features.control.today}</div>
                            </div>
                            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                                <div className="text-blue-300 text-xs mb-1">{t.features.control.activeDevices}</div>
                                <div className="text-3xl font-bold text-green-400">{useCountUp(3, 1500, 0, isControlVisible)}</div>
                                <div className="text-blue-400 text-xs mt-1">{t.features.control.devices}</div>
                            </div>
                            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                                <div className="text-blue-300 text-xs mb-1">{t.features.control.avgResponseTime}</div>
                                <div className="text-3xl font-bold text-white">0.8초</div>
                                <div className="text-blue-400 text-xs mt-1">{t.features.control.fastResponse}</div>
                            </div>
                        </div>

                        {/* 제어 패널 및 히스토리 */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                                <h3 className="text-lg font-semibold mb-3 text-white">{t.features.control.deviceControlPanel}</h3>
                                <div className="space-y-2">
                                    {['Tablet 01', 'Tablet 02', 'Tablet 03'].map((name, index) => {
                                        const isOn = [true, false, true][index];
                                        return (
                                            <div key={index} className={`chart-bar ${isControlVisible ? `animate chart-bar-delay-${index + 1}` : ''} flex items-center justify-between p-2 bg-blue-900/20 rounded-lg border border-blue-500/10`}>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${isOn ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                                    <span className="text-white font-semibold text-sm">{name}</span>
                                                </div>
                                                <button className={`px-3 py-1 rounded text-xs font-semibold ${
                                                    isOn ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                                                } text-white`}>
                                                    {isOn ? t.features.control.turnOff : t.features.control.turnOn}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                                <h3 className="text-lg font-semibold mb-3 text-white">{t.features.control.controlHistory}</h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {[
                                        { time: '14:30', device: 'Tablet 01', action: '전원 켜기' },
                                        { time: '14:25', device: 'Tablet 03', action: '설정 변경' },
                                        { time: '14:20', device: 'Tablet 04', action: '재시작' },
                                        { time: '14:15', device: 'Tablet 01', action: '전원 끄기' },
                                        { time: '14:10', device: 'Tablet 02', action: '전원 켜기' },
                                    ].map((item, index) => (
                                        <div key={index} className={`chart-bar ${isControlVisible ? `animate chart-bar-delay-${index + 1}` : ''} flex items-center justify-between p-2 bg-blue-900/20 rounded border border-blue-500/10`}>
                                            <div>
                                                <div className="text-white text-xs font-semibold">{item.action}</div>
                                                <div className="text-blue-300 text-xs">{item.device}</div>
                                            </div>
                                            <div className="text-blue-400 text-xs">{item.time}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 기기 정보 Section */}
                <section ref={infoSectionRef} className="min-w-full min-h-screen flex items-center justify-center snap-center relative z-10 py-12">
                    <div className="max-w-7xl mx-auto px-4 w-full">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center pulse-ring cosmic-icon icon-3d-3">
                                <svg className="w-10 h-10 text-white icon-3d-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-3 gradient-text">{t.features.info.title}</h2>
                            <p className="text-lg md:text-xl text-blue-200">
                                {t.features.info.description}
                            </p>
                        </div>

                        {/* 대시보드 카드 */}
                        <div className="grid md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                                <div className="text-blue-300 text-xs mb-1">{t.features.info.totalDevices}</div>
                                <div className="text-3xl font-bold text-white">{useCountUp(5, 1500, 0, isInfoVisible)}</div>
                                <div className="text-blue-400 text-xs mt-1">{t.features.info.registeredDevices}</div>
                            </div>
                            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                                <div className="text-blue-300 text-xs mb-1">{t.features.info.avgBattery}</div>
                                <div className="text-3xl font-bold text-white">{useCountUp(86, 1500, 0, isInfoVisible)}%</div>
                                <div className="text-blue-400 text-xs mt-1">{t.features.info.allDevices}</div>
                            </div>
                            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                                <div className="text-blue-300 text-xs mb-1">{t.features.info.avgWifi}</div>
                                <div className="text-3xl font-bold text-white">{useCountUp(74, 1500, 0, isInfoVisible)}%</div>
                                <div className="text-blue-400 text-xs mt-1">{t.features.info.connectionStrength}</div>
                            </div>
                            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                                <div className="text-blue-300 text-xs mb-1">{t.features.info.latestVersion}</div>
                                <div className="text-3xl font-bold text-white">v1.2.3</div>
                                <div className="text-blue-400 text-xs mt-1">{t.features.info.devices}</div>
                            </div>
                        </div>

                        {/* 정보 테이블 및 통계 */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                                <h3 className="text-lg font-semibold mb-3 text-white">{t.features.info.deviceDetails}</h3>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {[
                                        { name: 'Tablet 01', mac: 'AA:BB:CC:DD:EE:01', ip: '192.168.1.100', battery: 85, wifi: 75 },
                                        { name: 'Tablet 02', mac: 'AA:BB:CC:DD:EE:02', ip: '192.168.1.101', battery: 92, wifi: 60 },
                                    ].map((device, index) => {
                                        const batteryCount = useCountUp(device.battery, 1500, 0, isInfoVisible);
                                        const wifiCount = useCountUp(device.wifi, 1500, 0, isInfoVisible);
                                        return (
                                            <div key={index} className={`chart-bar ${isInfoVisible ? `animate chart-bar-delay-${index + 1}` : ''} p-2 bg-blue-900/20 rounded-lg border border-blue-500/10`}>
                                                <div className="text-white font-semibold text-sm mb-1">{device.name}</div>
                                                <div className="text-blue-300 text-xs font-mono mb-1">MAC: {device.mac}</div>
                                                <div className="text-blue-300 text-xs font-mono mb-2">IP: {device.ip}</div>
                                                <div className="flex gap-3 text-xs">
                                                    <div className="flex-1">
                                                        <div className="text-blue-200 mb-1">{t.features.info.battery}: {batteryCount}%</div>
                                                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                                                            <div 
                                                                className="bg-green-500 h-1.5 rounded-full transition-all duration-1000" 
                                                                style={{ width: isInfoVisible ? `${device.battery}%` : '0%' }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-blue-200 mb-1">{t.features.info.wifi}: {wifiCount}%</div>
                                                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                                                            <div 
                                                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000" 
                                                                style={{ width: isInfoVisible ? `${device.wifi}%` : '0%' }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                                <h3 className="text-lg font-semibold mb-3 text-white">{t.features.info.versionDistribution}</h3>
                                <div className="space-y-3">
                                    {[
                                        { version: 'v1.2.3', count: 4 },
                                        { version: 'v1.2.2', count: 1 },
                                    ].map((item, index) => {
                                        const countValue = useCountUp(item.count, 1500, 0, isInfoVisible);
                                        return (
                                            <div key={index} className={`chart-bar ${isInfoVisible ? `animate chart-bar-delay-${index + 1}` : ''}`}>
                                                <div className="flex justify-between text-xs mb-2">
                                                    <span className="text-blue-200">{item.version}</span>
                                                    <span className="text-white font-semibold">{countValue}개</span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                                    <div 
                                                        className="bg-gradient-to-r from-blue-500 to-blue-700 h-2.5 rounded-full transition-all duration-1000"
                                                        style={{ width: isInfoVisible ? `${(item.count / 5) * 100}%` : '0%' }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 마지막 페이지 - 감사 인사 및 로그인 */}
                <section className="min-w-full min-h-screen flex items-center justify-center snap-center relative z-10 py-12">
                    <div className="max-w-4xl mx-auto text-center px-4">
                        <h2 className="text-5xl md:text-6xl font-bold mb-8 gradient-text">
                            {t.thankYou.title}
                        </h2>
                        <p className="text-xl md:text-2xl text-blue-200 mb-12">
                            {t.thankYou.subtitle}
                        </p>
                        {!user && !loading && (
                            <button
                                onClick={handleGoogleSignIn}
                                className="px-10 py-4 text-white text-lg rounded-lg gradient-button pulse-glow flex items-center gap-3 mx-auto"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                {t.thankYou.googleLogin}
                            </button>
                        )}
                    </div>
                </section>
            </div>
            
            {/* Footer - 하단 고정 */}
            <footer className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm z-40">
                <div className="container mx-auto px-4 py-3">
                    <div className="text-center text-blue-300 text-sm">
                        <p>{t.footer.copyright}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
