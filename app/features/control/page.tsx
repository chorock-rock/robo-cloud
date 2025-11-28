'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ControlPage() {
  const [devices, setDevices] = useState([
    { id: 1, name: 'Tablet 01', status: true, lastControl: '2분 전', controlCount: 45 },
    { id: 2, name: 'Tablet 02', status: false, lastControl: '5분 전', controlCount: 32 },
    { id: 3, name: 'Tablet 03', status: true, lastControl: '1분 전', controlCount: 67 },
    { id: 4, name: 'Tablet 04', status: true, lastControl: '3분 전', controlCount: 28 },
    { id: 5, name: 'Tablet 05', status: false, lastControl: '10분 전', controlCount: 19 },
  ]);

  const [controlHistory, setControlHistory] = useState([
    { time: '14:30', device: 'Tablet 01', action: '전원 켜기', user: 'Admin' },
    { time: '14:25', device: 'Tablet 03', action: '설정 변경', user: 'Admin' },
    { time: '14:20', device: 'Tablet 04', action: '재시작', user: 'Admin' },
    { time: '14:15', device: 'Tablet 01', action: '전원 끄기', user: 'Admin' },
    { time: '14:10', device: 'Tablet 02', action: '전원 켜기', user: 'Admin' },
  ]);

  const toggleDevice = (id: number) => {
    setDevices(devices.map(device => 
      device.id === id ? { ...device, status: !device.status } : device
    ));
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-[#000000]">
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

      {/* TopBar */}
      <nav className="fixed top-0 left-0 right-0 bg-transparent z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Image
                src="/logo.png"
                alt="ROBO Cloud"
                width={200}
                height={60}
                className="h-12 w-auto"
                priority
              />
            </Link>
            <Link
              href="/"
              className="text-white hover:opacity-70 transition-opacity font-medium"
            >
              홈으로
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-8 text-center gradient-text">
            기기 제어
          </h1>
          <p className="text-xl text-blue-200 mb-12 text-center">
            태블릿의 전원, 설정 등을 원격에서 제어할 수 있습니다
          </p>

          {/* 대시보드 카드 */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
              <div className="text-blue-300 text-sm mb-2">총 제어 횟수</div>
              <div className="text-4xl font-bold text-white">
                {devices.reduce((sum, d) => sum + d.controlCount, 0)}
              </div>
              <div className="text-blue-400 text-sm mt-2">오늘</div>
            </div>
            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
              <div className="text-blue-300 text-sm mb-2">활성 기기</div>
              <div className="text-4xl font-bold text-green-400">
                {devices.filter(d => d.status).length}
              </div>
              <div className="text-blue-400 text-sm mt-2">/{devices.length} 기기</div>
            </div>
            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
              <div className="text-blue-300 text-sm mb-2">평균 응답 시간</div>
              <div className="text-4xl font-bold text-white">0.8초</div>
              <div className="text-blue-400 text-sm mt-2">빠른 응답</div>
            </div>
          </div>

          {/* 기기 제어 패널 */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
              <h3 className="text-xl font-semibold mb-4 text-white">기기 제어 패널</h3>
              <div className="space-y-4">
                {devices.map((device) => (
                  <div 
                    key={device.id} 
                    className="flex items-center justify-between p-4 bg-blue-900/20 rounded-lg border border-blue-500/10"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${device.status ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                      <div>
                        <div className="text-white font-semibold">{device.name}</div>
                        <div className="text-blue-300 text-sm">마지막 제어: {device.lastControl}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleDevice(device.id)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        device.status 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {device.status ? '끄기' : '켜기'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 제어 히스토리 */}
            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
              <h3 className="text-xl font-semibold mb-4 text-white">제어 히스토리</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {controlHistory.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg border border-blue-500/10"
                  >
                    <div>
                      <div className="text-white font-semibold">{item.action}</div>
                      <div className="text-blue-300 text-sm">{item.device}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-sm">{item.time}</div>
                      <div className="text-blue-400 text-xs">{item.user}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 제어 통계 차트 */}
          <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
            <h3 className="text-xl font-semibold mb-4 text-white">시간별 제어 통계</h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'].map((time, index) => {
                const value = Math.floor(Math.random() * 30) + 10;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-purple-500 to-purple-700 rounded-t transition-all hover:opacity-80"
                      style={{ height: `${(value / 50) * 100}%` }}
                    ></div>
                    <div className="text-xs text-blue-300 mt-2">{time}</div>
                    <div className="text-xs text-white font-semibold">{value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

