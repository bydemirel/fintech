"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  LogOut, 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  Settings, 
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

interface DashboardShellProps {
  children: React.ReactNode;
}

interface UserData {
  name?: string;
  email?: string;
  avatar?: string;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, language } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserData>({});

  useEffect(() => {
    // LocalStorage'dan kullanıcı bilgilerini al
    try {
      const userString = localStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        setUserData(user);
      }
    } catch (error) {
      console.error("Kullanıcı bilgileri yüklenemedi:", error);
    }
  }, []);

  const handleLogout = () => {
    // LocalStorage'dan kullanıcı bilgilerini temizle
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Login sayfasına yönlendir
    router.push("/auth/login");
  };

  const navItems = React.useMemo(() => [
    {
      title: t("dashboard"),
      href: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: t("newTransaction"),
      href: "/new-transaction",
      icon: <PlusCircle size={20} />,
    },
    {
      title: t("transactions"),
      href: "/transactions",
      icon: <FileText size={20} />,
    },
    {
      title: t("settings"),
      href: "/settings",
      icon: <Settings size={20} />,
    },
  ], [t, language]);

  return (
    <div className="min-h-screen w-full flex">
      {/* Mobil Menü Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen z-50 fixed md:relative transition-all duration-300",
          isCollapsed ? "w-[80px]" : "w-[280px]",
          isMobileMenuOpen ? "left-0" : "-left-[280px] md:left-0"
        )}
      >
        <div className="flex h-16 items-center border-b border-gray-200 dark:border-gray-800 px-4 justify-between">
          <Link href="/dashboard" className={cn("flex items-center gap-2 font-semibold", isCollapsed && "justify-center")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M16 8h-6.5a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 1 0 5H6" />
              <path d="M12 18v2" />
              <path d="M12 4v2" />
            </svg>
            {!isCollapsed && <span>FinTech</span>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Genişlet" : "Daralt"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>
        
        <nav className="grid items-start px-3 text-sm font-medium gap-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900 dark:hover:text-gray-50",
                pathname === item.href
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
                isCollapsed && "justify-center px-0"
              )}
              title={isCollapsed ? item.title : undefined}
            >
              {item.icon}
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className={cn(
            "flex items-center gap-3 text-sm mb-4",
            isCollapsed && "flex-col"
          )}>
            <div className={cn(
              "flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 p-2",
              isCollapsed ? "w-10 h-10" : "w-9 h-9"
            )}>
              <User size={isCollapsed ? 20 : 18} className="text-gray-600 dark:text-gray-400" />
            </div>
            {!isCollapsed && (
              <div className="grid gap-1 flex-1 min-w-0">
                <p className="font-medium truncate">{userData.name || t("user")}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userData.email || "user@example.com"}</p>
              </div>
            )}
          </div>
          
          <Button
            variant="outline"
            size={isCollapsed ? "icon" : "default"}
            className={cn(
              "gap-2 w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200",
              isCollapsed && "justify-center"
            )}
            onClick={handleLogout}
          >
            <LogOut size={18} />
            {!isCollapsed && <span>{t("logout")}</span>}
          </Button>
        </div>
      </div>
      
      {/* Ana İçerik */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 flex items-center border-b border-gray-200 dark:border-gray-800 px-6 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={20} />
          </Button>
          <div className="flex-1 text-lg font-medium">
            {navItems.find(item => item.href === pathname)?.title || t("dashboard")}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
} 