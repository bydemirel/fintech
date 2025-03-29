"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/ui/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { MoonIcon, SunIcon, GlobeIcon } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

type Theme = "light" | "dark" | "system";
type Language = "tr" | "en";

export default function SettingsPage() {
  const { t, language, changeLanguage } = useTranslation();
  const [theme, setTheme] = useState<Theme>("light");
  const [isSaving, setIsSaving] = useState(false);

  // Tarayıcıdan ayarları yükle
  useEffect(() => {
    // Tema ayarı
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      setTheme("light");
    }
  }, []);

  // Tema değiştirme işlevi
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    toast({
      title: t("settingsSaved"),
      description: newTheme === "light" 
        ? "Uygulama teması açık olarak ayarlandı." 
        : newTheme === "dark" 
          ? "Uygulama teması koyu olarak ayarlandı." 
          : "Uygulama teması sistem ayarlarına göre düzenlendi.",
    });
  };

  // Dil değiştirme işlevi
  const handleLanguageChange = (newLanguage: Language) => {
    changeLanguage(newLanguage);
    
    toast({
      title: t("settingsSaved"),
      description: newLanguage === "tr" 
        ? "Uygulama dili Türkçe olarak ayarlandı." 
        : "Application language set to English.",
    });
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h3 className="text-3xl font-bold">{t("settings")}</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {t("selectAppLanguage")}
          </p>
        </div>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="appearance">{t("appearance")}</TabsTrigger>
            <TabsTrigger value="language">{t("language")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("appearance")}</CardTitle>
                <CardDescription>
                  {t("customizeAppearance")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1">
                    <h4 className="font-medium">{t("theme")}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("selectAppTheme")}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      className="flex flex-col items-center justify-between p-4 h-auto gap-2"
                      onClick={() => handleThemeChange("light")}
                    >
                      <SunIcon className="h-5 w-5" />
                      <span>{t("light")}</span>
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      className="flex flex-col items-center justify-between p-4 h-auto gap-2"
                      onClick={() => handleThemeChange("dark")}
                    >
                      <MoonIcon className="h-5 w-5" />
                      <span>{t("dark")}</span>
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      className="flex flex-col items-center justify-between p-4 h-auto gap-2"
                      onClick={() => handleThemeChange("system")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                      <span>{t("system")}</span>
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">{t("darkMode")}</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("quicklyToggleDarkMode")}
                    </p>
                  </div>
                  <button
                    id="dark-mode"
                    className={`w-11 h-6 rounded-full transition-colors ${theme === "dark" ? "bg-blue-600" : "bg-gray-200"}`}
                    onClick={() => handleThemeChange(theme === "dark" ? "light" : "dark")}
                  >
                    <span 
                      className={`block w-5 h-5 rounded-full bg-white transform transition-transform ${
                        theme === "dark" ? "translate-x-5" : "translate-x-1"
                      }`} 
                    />
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="language" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("languageSettings")}</CardTitle>
                <CardDescription>
                  {t("selectAppLanguage")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1">
                    <h4 className="font-medium">{t("appLanguage")}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("selectAppLanguage")}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={language === "tr" ? "default" : "outline"}
                      className="flex items-center justify-start gap-2 h-auto p-4"
                      onClick={() => handleLanguageChange("tr")}
                    >
                      <img 
                        src="/flag-for-flag-turkey.svg" 
                        alt="Türk Bayrağı"
                        className="h-4 w-6 rounded-sm object-cover"
                      />
                      <span>{t("turkish")}</span>
                    </Button>
                    <Button
                      variant={language === "en" ? "default" : "outline"}
                      className="flex items-center justify-start gap-2 h-auto p-4"
                      onClick={() => handleLanguageChange("en")}
                    >
                      <img 
                        src="/flag-for-flag-united-kingdom.svg" 
                        alt="UK Flag"
                        className="h-4 w-6 rounded-sm object-cover"
                      />
                      <span>{t("english")}</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
} 