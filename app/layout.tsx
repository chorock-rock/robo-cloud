import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import UserSync from "@/components/UserSync";

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
      <body className="antialiased">
        <LanguageProvider>
          <UserSync />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

