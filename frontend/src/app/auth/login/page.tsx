"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { login } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // API üzerinden giriş yap
      await login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş yapılırken bir hata oluştu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Demo hesabı ile giriş
  const handleDemoLogin = async () => {
    setLoading(true);
    setError("");
    
    try {
      // State'i değiştirip form gönderimi simüle etmek yerine doğrudan login fonksiyonunu çağır
      await login({ email: "demo@example.com", password: "demo123" });
      
      // UI'ı güncelle (opsiyonel, artık giriş yapıldı)
      setEmail("demo@example.com");
      setPassword("demo123");
      
      // Başarılı giriş sonrası yönlendirme
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo girişi sırasında bir hata oluştu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Yükleme Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-700 dark:text-gray-300">Giriş yapılıyor...</p>
          </div>
        </div>
      )}
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Giriş Yap</CardTitle>
          <CardDescription className="text-center">
            Kişisel finans takip uygulamanıza hoş geldiniz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-500 px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="ornek@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Şifre</Label>
                <Link href="/auth/forgot-password" 
                  className="text-sm text-blue-600 hover:underline"
                  tabIndex={loading ? -1 : undefined}
                  aria-disabled={loading}
                  onClick={e => loading && e.preventDefault()}
                >
                  Şifremi Unuttum
                </Link>
              </div>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  <span>Giriş yapılıyor...</span>
                </div>
              ) : (
                "Giriş Yap"
              )}
            </Button>
          </form>
          
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Veya</span>
            </div>
          </div>
          
          {/* Demo hesabı ile giriş butonu */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleDemoLogin}
            disabled={loading}
          >
            Demo Hesabı ile Giriş Yap
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Hesabınız yok mu?{" "}
            <Link href="/auth/register" 
              className="text-blue-600 hover:underline"
              tabIndex={loading ? -1 : undefined}
              aria-disabled={loading}
              onClick={e => loading && e.preventDefault()}
            >
              Kayıt Ol
            </Link>
          </p>
        </CardFooter>
      </Card>
    </>
  );
} 