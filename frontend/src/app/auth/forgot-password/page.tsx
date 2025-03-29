"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Burada API entegrasyonu yapılacak
      // Şimdilik basit bir simülasyon
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simüle edilmiş gecikme
      setSuccess(true);
    } catch (err) {
      setError("İşlem sırasında bir hata oluştu");
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
            <p className="mt-3 text-gray-700 dark:text-gray-300">İşleminiz gerçekleştiriliyor...</p>
          </div>
        </div>
      )}
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Şifremi Unuttum</CardTitle>
          <CardDescription className="text-center">
            E-posta adresinizi girin, şifre sıfırlama linki gönderelim
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-6 rounded-md flex flex-col items-center text-center">
              <Check className="h-12 w-12 text-green-500 mb-2" />
              <h3 className="text-lg font-medium">E-posta Gönderildi!</h3>
              <p className="mt-2">
                {email} adresine şifre sıfırlama linki gönderdik. Lütfen e-postanızı kontrol edin.
              </p>
            </div>
          ) : (
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
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                    <span>İşleniyor...</span>
                  </div>
                ) : (
                  "Şifre Sıfırlama Linki Gönder"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Şifrenizi hatırladınız mı?{" "}
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