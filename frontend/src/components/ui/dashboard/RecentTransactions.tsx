"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Transaction } from "@/lib/api";

interface ExtendedTransaction extends Transaction {
  categoryName?: string;
  categoryColor?: string;
}

interface RecentTransactionsProps {
  transactions: ExtendedTransaction[];
  currency: string;
}

export function RecentTransactions({ transactions, currency }: RecentTransactionsProps) {
  // Para birimi formatı
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { 
      style: 'currency', 
      currency: currency || 'TRY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Tarih formatı
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // İşlem türüne göre simge
  const getTransactionIcon = (type: 'income' | 'expense') => {
    return type === 'income' 
      ? <span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">↓</span>
      : <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-600 dark:text-red-400 font-bold">↑</span>
  };

  return (
    <Card className="col-span-3 overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
        <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">Son İşlemler</CardTitle>
        <Link 
          href="/transactions" 
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          Tümünü Gör
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {transactions.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Henüz bir işlem bulunmamaktadır</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-900">
                <TableRow>
                  <TableHead className="w-[80px]">Tür</TableHead>
                  <TableHead className="w-[100px]">Tarih</TableHead>
                  <TableHead>Açıklama</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Tutar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow 
                    key={transaction.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <TableCell>
                      {getTransactionIcon(transaction.type)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(transaction.date as string)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.description}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800">
                        {transaction.categoryName || "Kategori"}
                      </span>
                    </TableCell>
                    <TableCell 
                      className={`text-right font-medium ${
                        transaction.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 