"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/ui/dashboard/DashboardShell";
import { AddTransactionForm } from "@/components/ui/dashboard/AddTransactionForm";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  type: "income" | "expense";
}

// Geçici kategoriler - normalde API'den gelecek
const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Maaş", type: "income" },
  { id: 2, name: "Freelance", type: "income" },
  { id: 3, name: "Yatırım Geliri", type: "income" },
  { id: 4, name: "Hediye", type: "income" },
  { id: 5, name: "Diğer Gelir", type: "income" },
  { id: 6, name: "Kira", type: "expense" },
  { id: 7, name: "Market", type: "expense" },
  { id: 8, name: "Faturalar", type: "expense" },
  { id: 9, name: "Eğlence", type: "expense" },
  { id: 10, name: "Sağlık", type: "expense" },
  { id: 11, name: "Ulaşım", type: "expense" },
  { id: 12, name: "Yemek", type: "expense" },
  { id: 13, name: "Alışveriş", type: "expense" },
  { id: 14, name: "Diğer Gider", type: "expense" },
];

export default function AddTransactionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTransaction = async (transaction: {
    amount: number;
    type: "income" | "expense";
    categoryId: number;
    date: Date;
    description: string;
  }) => {
    setIsSubmitting(true);
    try {
      // Normalde bir API çağrısı yapılacak
      console.log("İşlem ekleniyor:", transaction);
      
      // API çağrısını simüle ediyoruz
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "İşlem başarıyla eklendi",
        description: `${transaction.type === "income" ? "Gelir" : "Gider"} kaydedildi: ${transaction.amount.toLocaleString('tr-TR')} TL`,
        variant: "success",
      });
      
      // İşlem tamamlandıktan sonra dashboard'a yönlendir
      router.push("/dashboard");
    } catch (error) {
      console.error("İşlem eklenirken hata oluştu:", error);
      toast({
        title: "Hata",
        description: "İşlem eklenirken bir sorun oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Yeni İşlem Ekle</h1>
          <p className="text-muted-foreground mt-1">
            Gelir veya gider işlemi eklemek için formu doldurun
          </p>
        </div>
      </div>
      <div className="grid gap-6">
        <AddTransactionForm
          categories={MOCK_CATEGORIES}
          onSubmit={handleAddTransaction}
        />
      </div>
    </DashboardShell>
  );
} 