import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import UserSync from "@/components/UserSync";

export const metadata: Metadata = {
  title: "ROBO Cloud - 태블릿 기기제어 서비스",
  description: "태블릿 기기제어 기능 제공 서비스. 실시간 모니터링, 원격 제어, 상세한 분석을 제공합니다.",
  keywords: ["태블릿", "기기제어", "원격제어", "모니터링", "ROBO Cloud"],
  authors: [{ name: "ROBO Cloud" }],
  creator: "ROBO Cloud",
  publisher: "ROBO Cloud",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "ROBO Cloud - 태블릿 기기제어 서비스",
    description: "태블릿 기기제어 기능 제공 서비스. 실시간 모니터링, 원격 제어, 상세한 분석을 제공합니다.",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: "ROBO Cloud",
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'ROBO Cloud 로고',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "ROBO Cloud - 태블릿 기기제어 서비스",
    description: "태블릿 기기제어 기능 제공 서비스. 실시간 모니터링, 원격 제어, 상세한 분석을 제공합니다.",
    images: ['/logo.png'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <LanguageProvider>
          <UserSync />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

