import "./globals.css";

export const metadata = {
  title: "COUPANG-AI-SYSTEM",
  description: "쿠팡파트너스 숏폼 콘텐츠 자동 생성 시스템"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
