"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface Category {
  id: number;
  name: string;
  type: "income" | "expense";
}

interface AddTransactionFormProps {
  categories: Category[];
  onSubmit: (transaction: {
    amount: number;
    type: "income" | "expense";
    categoryId: number;
    date: Date;
    description: string;
  }) => void;
}

export function AddTransactionForm({ categories, onSubmit }: AddTransactionFormProps) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [categoryId, setCategoryId] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Geçerli bir miktar giriniz";
    }

    if (!categoryId) {
      newErrors.categoryId = "Kategori seçiniz";
    }

    if (!date) {
      newErrors.date = "Tarih seçiniz";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      amount: Number(amount),
      type,
      categoryId: Number(categoryId),
      date,
      description,
    });

    // Form alanlarını temizle
    setAmount("");
    setType("expense");
    setCategoryId("");
    setDate(new Date());
    setDescription("");
    setErrors({});
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <Card className="col-span-3 shadow-md border border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
        <CardTitle className="text-xl font-bold flex items-center">
          <span className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path>
              <path d="M12 13V7"></path>
              <path d="M9 10h6"></path>
            </svg>
          </span>
          Yeni İşlem Ekle
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="transaction-type" className="text-sm font-medium">
              İşlem Türü
            </Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="income" 
                  name="transaction-type" 
                  value="income" 
                  checked={type === "income"} 
                  onChange={() => {
                    setType("income");
                    setCategoryId("");
                  }}
                  className="h-4 w-4 text-blue-600 border-gray-300"
                />
                <Label
                  htmlFor="income"
                  className="flex items-center gap-1 font-normal cursor-pointer"
                >
                  <span 
                    className="flex items-center justify-center bg-green-100 dark:bg-green-900/30 w-5 h-5 rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-600 dark:text-green-400"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                  <span>Gelir</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="expense" 
                  name="transaction-type" 
                  value="expense" 
                  checked={type === "expense"} 
                  onChange={() => {
                    setType("expense");
                    setCategoryId("");
                  }}
                  className="h-4 w-4 text-blue-600 border-gray-300"
                />
                <Label
                  htmlFor="expense"
                  className="flex items-center gap-1 font-normal cursor-pointer"
                >
                  <span 
                    className="flex items-center justify-center bg-red-100 dark:bg-red-900/30 w-5 h-5 rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-red-600 dark:text-red-400"
                    >
                      <path d="m6 15 6-6 6 6" />
                    </svg>
                  </span>
                  <span>Gider</span>
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Miktar (TL)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                ₺
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className={cn(
                  "pl-8",
                  errors.amount ? "border-red-500 focus-visible:ring-red-500" : ""
                )}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Kategori
            </Label>
            <Select
              value={categoryId}
              onValueChange={setCategoryId}
            >
              <SelectTrigger
                id="category"
                className={cn(
                  errors.categoryId ? "border-red-500 focus-visible:ring-red-500" : ""
                )}
              >
                <SelectValue placeholder="Kategori seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    Bu işlem türü için kategori bulunamadı
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-red-500">{errors.categoryId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              Tarih
            </Label>
            <div className="relative">
              <Input
                id="date"
                type="date"
                value={date.toISOString().split('T')[0]}
                onChange={(e) => {
                  if (e.target.value) {
                    setDate(new Date(e.target.value));
                  }
                }}
                className={cn(
                  errors.date ? "border-red-500 focus-visible:ring-red-500" : ""
                )}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
              </div>
            </div>
            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Açıklama
            </Label>
            <textarea
              id="description"
              placeholder="İşlem açıklaması..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-20 px-3 py-2 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 resize-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            İşlemi Kaydet
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 