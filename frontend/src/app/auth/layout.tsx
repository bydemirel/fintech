"use client";

import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname() || "";
  
  // Sayfa başlığını belirle
  let pageTitle = "Kimlik Doğrulama";
  if (pathname.includes("/login")) pageTitle = "Giriş Yap";
  if (pathname.includes("/register")) pageTitle = "Hesap Oluştur";
  if (pathname.includes("/forgot-password")) pageTitle = "Şifremi Unuttum";
  
  return (
    <>
      <title>{`FinTech - ${pageTitle}`}</title>
      <div className="min-h-screen flex flex-col">
        <header className="py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-xl font-bold">FinTech</h1>
          </div>
        </header>
        
        <main className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          {children}
        </main>
        
        <footer className="py-4 bg-gray-100 dark:bg-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
          <div className="container mx-auto px-4">
            FinTech - Kişisel Finans Takip Uygulaması &copy; {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </>
  );
} 