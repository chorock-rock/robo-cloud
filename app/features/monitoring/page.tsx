'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function MonitoringPage() {
  const [monitoringData, setMonitoringData] = useState({
    activeDevices: 24,
    totalDevices: 30,
    averageBattery: 78,
    averageWifi: 85,
    recentActivity: [
      { time: '10:00', devices: 22 },
      { time: '11:00', devices: 24 },
      { time: '12:00', devices: 23 },
      { time: '13:00', devices: 25 },
      { time: '14:00', devices: 24 },
    ],
    batteryData: [
      { device: 'Tablet 01', battery: 85 },
      { device: 'Tablet 02', battery: 92 },
      { device: 'Tablet 03', battery: 75 },
      { device: 'Tablet 04', battery: 88 },
      { device: 'Tablet 05', battery: 90 },
    ],
    wifiData: [
      { device: 'Tablet 01', strength: 75 },
      { device: 'Tablet 02', strength: 60 },
      { device: 'Tablet 03', strength: 85 },
      { device: 'Tablet 04', strength: 70 },
      { device: 'Tablet 05', strength: 80 },
    ],
  });

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
            실시간 모니터링
          </h1>
          <p className="text-xl text-blue-200 mb-12 text-center">
            모든 태블릿의 상태를 실시간으로 확인하고 모니터링하세요
          </p>

          {/* 대시보드 카드 */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
              <div className="text-blue-300 text-sm mb-2">활성 기기</div>
              <div className="text-4xl font-bold text-white">{monitoringData.activeDevices}</div>
              <div className="text-blue-400 text-sm mt-2">/{monitoringData.totalDevices} 총 기기</div>
            </div>
            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
              <div className="text-blue-300 text-sm mb-2">평균 배터리</div>
              <div className="text-4xl font-bold text-white">{monitoringData.averageBattery}%</div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${monitoringData.averageBattery}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
              <div className="text-blue-300 text-sm mb-2">평균 Wi-Fi</div>
              <div className="text-4xl font-bold text-white">{monitoringData.averageWifi}%</div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${monitoringData.averageWifi}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
              <div className="text-blue-300 text-sm mb-2">시스템 상태</div>
              <div className="text-4xl font-bold text-green-400">정상</div>
              <div className="text-blue-400 text-sm mt-2">모든 시스템 운영 중</div>
            </div>
          </div>

          {/* 차트 영역 */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* 활동 차트 */}
            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
              <h3 className="text-xl font-semibold mb-4 text-white">시간별 활성 기기</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {monitoringData.recentActivity.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-700 rounded-t transition-all hover:opacity-80"
                      style={{ height: `${(item.devices / 30) * 100}%` }}
                    ></div>
                    <div className="text-xs text-blue-300 mt-2">{item.time}</div>
                    <div className="text-xs text-white font-semibold">{item.devices}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 배터리 차트 */}
            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
              <h3 className="text-xl font-semibold mb-4 text-white">기기별 배터리 상태</h3>
              <div className="space-y-4">
                {monitoringData.batteryData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-200">{item.device}</span>
                      <span className="text-white font-semibold">{item.battery}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          item.battery > 80 ? 'bg-green-500' : 
                          item.battery > 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${item.battery}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Wi-Fi 강도 차트 */}
          <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
            <h3 className="text-xl font-semibold mb-4 text-white">기기별 Wi-Fi 강도</h3>
            <div className="grid grid-cols-5 gap-4">
              {monitoringData.wifiData.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-blue-200 text-sm mb-2">{item.device}</div>
                  <div className="relative w-24 h-24 mx-auto">
                    <svg className="transform -rotate-90 w-24 h-24">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-700"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - item.strength / 100)}`}
                        className="text-green-500 transition-all"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{item.strength}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





