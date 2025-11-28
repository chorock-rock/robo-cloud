import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ROBO Cloud",
  description: "태블릿 기기제어 기능 제공 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}

