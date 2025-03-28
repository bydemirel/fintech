"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BalanceCardProps {
  balance: number;
  income: number;
  expense: number;
  currency: string;
}

export function BalanceCard({ balance, income, expense, currency }: BalanceCardProps) {
  // Para birimi formatı
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { 
      style: 'currency', 
      currency: currency || 'TRY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Card className="col-span-1 md:col-span-3 overflow-hidden border-none shadow-lg bg-gradient-to-r from-blue-600 to-indigo-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-white">Finansal Durum</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm">
            <p className="text-white/70 mb-2 font-medium">Toplam Bakiye</p>
            <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {formatCurrency(balance)}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm">
            <p className="text-white/70 mb-2 font-medium">Toplam Gelir</p>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <p className="text-3xl font-bold text-green-300">
                {formatCurrency(income)}
              </p>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm">
            <p className="text-white/70 mb-2 font-medium">Toplam Gider</p>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <p className="text-3xl font-bold text-red-300">
                {formatCurrency(expense)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 