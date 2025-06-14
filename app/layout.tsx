import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "문제 생성 대시보드",
  description: "문제를 만들고 관리하는 도구입니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full">
      <body className="h-full bg-white text-gray-900 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto p-6 w-full">{children}</main>
      </body>
    </html>
  );
}
