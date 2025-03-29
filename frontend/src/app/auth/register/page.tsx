"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { register } from "@/lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Şifre doğrulaması
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }
    
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // API üzerinden kayıt ol
      await register({ name, email, password });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt olurken bir hata oluştu");
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
            <p className="mt-3 text-gray-700 dark:text-gray-300">Kaydınız işleniyor...</p>
          </div>
        </div>
      )}
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Hesap Oluştur</CardTitle>
          <CardDescription className="text-center">
            Finans takip uygulamasını kullanmak için kayıt olun
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
              <Label htmlFor="name">Ad Soyad</Label>
              <Input 
                id="name" 
                placeholder="Ad Soyad"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
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
              <Label htmlFor="password">Şifre</Label>
              <Input 
                id="password" 
                type="password"
                placeholder="En az 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
              <Input 
                id="confirmPassword" 
                type="password"
                placeholder="Şifrenizi tekrar girin"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  <span>Kaydediliyor...</span>
                </div>
              ) : (
                "Kayıt Ol"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Zaten bir hesabınız var mı?{" "}
            <Link 
              href="/auth/login" 
              className="text-blue-600 hover:underline"
              tabIndex={loading ? -1 : undefined}
              aria-disabled={loading}
              onClick={e => loading && e.preventDefault()}
            >
              Giriş Yap
            </Link>
          </p>
        </CardFooter>
      </Card>
    </>
  );
} 