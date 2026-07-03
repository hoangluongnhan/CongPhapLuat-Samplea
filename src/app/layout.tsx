import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cổng Pháp Luật Quốc Gia",
  description:
    "Nền tảng tương tác giữa người dân, doanh nghiệp và chính quyền - tra cứu văn bản, phản ánh chính sách, góp ý dự thảo, trợ giúp pháp lý.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="flex min-h-screen flex-col">
        <AppProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
