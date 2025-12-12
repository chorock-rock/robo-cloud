'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/i18n';

export default function WifiQrPage() {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [securityType, setSecurityType] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [hidden, setHidden] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [copied, setCopied] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const t = getTranslation(language);

  const generateQRCode = () => {
    if (!ssid.trim()) {
      alert(language === 'ko' ? '네트워크 이름을 입력해주세요.' : 'Please enter network name.');
      return;
    }

    if (securityType !== 'nopass' && !password.trim()) {
      alert(language === 'ko' ? '비밀번호를 입력해주세요.' : 'Please enter password.');
      return;
    }

    // WiFi QR 코드 형식: WIFI:T:WPA;S:NetworkName;P:Password;H:false;;
    const wifiString = `WIFI:T:${securityType};S:${ssid};P:${password};H:${hidden};;`;
    setQrValue(wifiString);
  };

  const downloadQRCode = () => {
    if (!qrValue) return;

    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = document.createElement('img');

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `wifi-qr-${ssid || 'network'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const copyToClipboard = () => {
    if (!qrValue) return;

    navigator.clipboard.writeText(qrValue).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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
                className="text-white hover:opacity-70 transition-opacity font-medium"
              >
                {t.nav.myTablets}
              </a>
              <a
                href="/wifi-qr"
                className="text-white hover:opacity-70 transition-opacity font-medium border-b-2 border-blue-400 pb-1"
              >
                {t.nav.wifiQr}
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 pt-24 relative z-10">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 gradient-text">{t.wifiQr.title}</h1>
          <p className="text-lg md:text-xl text-blue-200">
            {t.wifiQr.description}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* 입력 폼 */}
            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
              <h2 className="text-2xl font-bold mb-6 gradient-text">
                {language === 'ko' ? 'WiFi 정보 입력' : 'WiFi Information'}
              </h2>

              <div className="space-y-4">
                {/* SSID */}
                <div>
                  <label className="block text-blue-300 text-sm mb-2">{t.wifiQr.ssid}</label>
                  <input
                    type="text"
                    value={ssid}
                    onChange={(e) => setSsid(e.target.value)}
                    placeholder={t.wifiQr.placeholder.ssid}
                    className="w-full px-4 py-3 bg-blue-900/50 border border-blue-700/50 rounded-lg text-white placeholder-blue-400/50 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Security Type */}
                <div>
                  <label className="block text-blue-300 text-sm mb-2">{t.wifiQr.securityType}</label>
                  <select
                    value={securityType}
                    onChange={(e) => setSecurityType(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                    className="w-full px-4 py-3 bg-blue-900/50 border border-blue-700/50 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="WPA">{t.wifiQr.wpa}</option>
                    <option value="WEP">{t.wifiQr.wep}</option>
                    <option value="nopass">{t.wifiQr.nopass}</option>
                  </select>
                </div>

                {/* Password */}
                {securityType !== 'nopass' && (
                  <div>
                    <label className="block text-blue-300 text-sm mb-2">{t.wifiQr.password}</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.wifiQr.placeholder.password}
                      className="w-full px-4 py-3 bg-blue-900/50 border border-blue-700/50 rounded-lg text-white placeholder-blue-400/50 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                )}

                {/* Hidden Network */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="hidden"
                    checked={hidden}
                    onChange={(e) => setHidden(e.target.checked)}
                    className="w-5 h-5 rounded border-blue-500 bg-blue-900/50 text-blue-500 focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="hidden" className="text-blue-300 text-sm cursor-pointer">
                    {t.wifiQr.hidden}
                  </label>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateQRCode}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                  {t.wifiQr.generate}
                </button>
              </div>
            </div>

            {/* QR 코드 표시 */}
            <div className="bg-blue-950/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
              <h2 className="text-2xl font-bold mb-6 gradient-text">
                {language === 'ko' ? 'QR 코드' : 'QR Code'}
              </h2>

              {qrValue ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <QRCodeSVG
                      id="qr-code-svg"
                      value={qrValue}
                      size={256}
                      level="H"
                      includeMargin={true}
                    />
                  </div>

                  <div className="w-full space-y-2">
                    <button
                      onClick={downloadQRCode}
                      className="w-full px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-all hover:scale-105 active:scale-95"
                    >
                      {t.wifiQr.download}
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all hover:scale-105 active:scale-95"
                    >
                      {copied ? t.wifiQr.copied : t.wifiQr.copy}
                    </button>
                  </div>

                  <div className="text-center text-sm text-blue-300 mt-4">
                    <p className="mb-1">{language === 'ko' ? '네트워크 이름:' : 'Network Name:'}</p>
                    <p className="font-semibold text-white">{ssid || '-'}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-32 h-32 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <p className="text-blue-300">
                    {language === 'ko' ? 'WiFi 정보를 입력하고 QR 코드를 생성하세요' : 'Enter WiFi information and generate QR code'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

