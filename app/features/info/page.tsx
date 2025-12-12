'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function InfoPage() {
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: 'Tablet 01',
      macAddress: 'AA:BB:CC:DD:EE:01',
      ipAddress: '192.168.1.100',
      battery: 85,
      wifi: 75,
      version: 'v1.2.3',
      firmware: 'FW-2024.11.28',
      lastUpdate: '2분 전',
    },
    {
      id: 2,
      name: 'Tablet 02',
      macAddress: 'AA:BB:CC:DD:EE:02',
      ipAddress: '192.168.1.101',
      battery: 92,
      wifi: 60,
      version: 'v1.2.3',
      firmware: 'FW-2024.11.28',
      lastUpdate: '5분 전',
    },
  ]);

  const versionDistribution = [
    { version: 'v1.2.3', count: 4 },
    { version: 'v1.2.2', count: 1 },
  ];

  const firmwareDistribution = [
    { firmware: 'FW-2024.11.28', count: 4 },
    { firmware: 'FW-2024.11.27', count: 1 },
  ];

  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-[#000000]">
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
            기기 정보
          </h1>
          <p className="text-xl text-blue-200 mb-12 text-center">
            MAC 주소, 배터리, 와이파이 강도 등 상세한 기기 정보를 확인하세요
          </p>

          {/* 대시보드 카드 */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
              <div className="text-blue-300 text-sm mb-2">총 기기 수</div>
              <div className="text-4xl font-bold text-white">{devices.length}</div>
              <div className="text-blue-400 text-sm mt-2">등록된 기기</div>
            </div>
            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
              <div className="text-blue-300 text-sm mb-2">평균 배터리</div>
              <div className="text-4xl font-bold text-white">
                {Math.round(devices.reduce((sum, d) => sum + d.battery, 0) / devices.length)}%
              </div>
              <div className="text-blue-400 text-sm mt-2">전체 기기</div>
            </div>
            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
              <div className="text-blue-300 text-sm mb-2">평균 Wi-Fi</div>
              <div className="text-4xl font-bold text-white">
                {Math.round(devices.reduce((sum, d) => sum + d.wifi, 0) / devices.length)}%
              </div>
              <div className="text-blue-400 text-sm mt-2">연결 강도</div>
            </div>
            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
              <div className="text-blue-300 text-sm mb-2">최신 버전</div>
              <div className="text-4xl font-bold text-white">v1.2.3</div>
              <div className="text-blue-400 text-sm mt-2">4/5 기기</div>
            </div>
          </div>

          {/* 기기 정보 테이블 */}
          <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20 mb-12">
            <h3 className="text-xl font-semibold mb-4 text-white">기기 상세 정보</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-500/30">
                    <th className="text-left py-3 px-4 text-blue-300">기기명</th>
                    <th className="text-left py-3 px-4 text-blue-300">MAC 주소</th>
                    <th className="text-left py-3 px-4 text-blue-300">IP 주소</th>
                    <th className="text-left py-3 px-4 text-blue-300">배터리</th>
                    <th className="text-left py-3 px-4 text-blue-300">Wi-Fi</th>
                    <th className="text-left py-3 px-4 text-blue-300">버전</th>
                    <th className="text-left py-3 px-4 text-blue-300">펌웨어</th>
                    <th className="text-left py-3 px-4 text-blue-300">최종 업데이트</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device) => (
                    <tr key={device.id} className="border-b border-blue-500/10 hover:bg-blue-900/20">
                      <td className="py-3 px-4 text-white font-semibold">{device.name}</td>
                      <td className="py-3 px-4 text-blue-200 font-mono text-sm">{device.macAddress}</td>
                      <td className="py-3 px-4 text-blue-200 font-mono text-sm">{device.ipAddress}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                device.battery > 80 ? 'bg-green-500' : 
                                device.battery > 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${device.battery}%` }}
                            ></div>
                          </div>
                          <span className="text-white text-sm">{device.battery}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${device.wifi}%` }}
                            ></div>
                          </div>
                          <span className="text-white text-sm">{device.wifi}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-blue-200">{device.version}</td>
                      <td className="py-3 px-4 text-blue-200 text-sm">{device.firmware}</td>
                      <td className="py-3 px-4 text-blue-300 text-sm">{device.lastUpdate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 통계 차트 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
              <h3 className="text-xl font-semibold mb-4 text-white">버전 분포</h3>
              <div className="space-y-4">
                {versionDistribution.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-blue-200">{item.version}</span>
                      <span className="text-white font-semibold">{item.count}개</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-700 h-4 rounded-full"
                        style={{ width: `${(item.count / devices.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
              <h3 className="text-xl font-semibold mb-4 text-white">펌웨어 분포</h3>
              <div className="space-y-4">
                {firmwareDistribution.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-blue-200">{item.firmware}</span>
                      <span className="text-white font-semibold">{item.count}개</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-purple-700 h-4 rounded-full"
                        style={{ width: `${(item.count / devices.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

