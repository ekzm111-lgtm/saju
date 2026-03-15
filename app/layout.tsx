import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "사주명인",
  description: "AI가 읽어주는 프리미엄 사주풀이 서비스"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

