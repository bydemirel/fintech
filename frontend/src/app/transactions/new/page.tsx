"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addTransaction, getCategories } from "@/lib/api";
import { Category } from "@/lib/api";

export default function NewTransactionPage() {
  const router = useRouter();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  // Kategori verileri yükleniyor
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const allCategories = await getCategories();
        // Seçilen türe göre kategorileri filtrele
        const filteredCategories = allCategories.filter(category => category.type === type);
        setCategories(filteredCategories);
      } catch (err) {
        console.error("Kategoriler yüklenirken hata oluştu:", err);
        setError("Kategoriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.");
      }
    };

    loadCategories();
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!type || !amount || !categoryId || !description || !date) {
      setError("Lütfen tüm alanları doldurun");
      setLoading(false);
      return;
    }

    try {
      // Kategori türüne göre tutar işaretini ayarla
      const selectedCategory = categories.find(c => c.id === parseInt(categoryId));
      const adjustedAmount = selectedCategory?.type === "expense" 
        ? -Math.abs(parseFloat(amount)) 
        : Math.abs(parseFloat(amount));

      // API'ye gönder
      await addTransaction({
        description,
        amount: adjustedAmount,
        categoryId: parseInt(categoryId),
        date
      });
      
      setSuccess("İşlem başarıyla kaydedildi!");
      setLoading(false);
      
      // Başarılı işlemden sonra formu sıfırla
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
      
    } catch (err) {
      console.error("İşlem eklenirken hata:", err);
      setError("İşlem kaydedilirken bir hata oluştu");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Yeni İşlem Ekle</h1>
        <Button 
          variant="outline" 
          onClick={() => router.back()}
        >
          Geri Dön
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>İşlem Detayları</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 bg-red-50 text-red-500 p-4 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 bg-green-50 text-green-500 p-4 rounded-md text-sm">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="type">İşlem Türü</Label>
              <Select
                value={type}
                onValueChange={(value) => {
                  setType(value as "income" | "expense");
                  setCategoryId(""); // Tür değişince kategori seçimini sıfırla
                }}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="İşlem türü seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Gelir</SelectItem>
                  <SelectItem value="expense">Gider</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Tutar</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">₺</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-8"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={categoryId}
                onValueChange={setCategoryId}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      Kategori bulunamadı
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Input
                id="description"
                placeholder="İşlem açıklaması"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Tarih</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? "İşlem kaydediliyor..." : "İşlemi Kaydet"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 