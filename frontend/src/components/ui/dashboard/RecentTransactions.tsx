"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Transaction, Category } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

interface ExtendedTransaction extends Transaction {
  categoryName?: string;
  categoryColor?: string;
  categoryType?: "income" | "expense";
  type?: "income" | "expense";
}

interface RecentTransactionsProps {
  transactions: ExtendedTransaction[];
  currency: string;
}

export function RecentTransactions({ transactions, currency }: RecentTransactionsProps) {
  const { t } = useTranslation();
  
  // Para birimi formatı
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Tarih formatı
  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };
  
  // Kategori tipine veya işlem tutarına göre işlem tipini belirle
  const getTransactionType = (transaction: ExtendedTransaction) => {
    if (transaction.type) return transaction.type;
    if (transaction.categoryType) return transaction.categoryType;
    return transaction.amount > 0 ? "income" : "expense";
  };

  return (
    <Card className="col-span-3 overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
        <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('recentTransactions')}</CardTitle>
        <Link 
          href="/transactions" 
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          {t('viewAll')}
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 p-4">
            <p className="text-muted-foreground text-center">{t('noTransactionsYet')}</p>
            <p className="text-muted-foreground text-sm mt-2 text-center mb-4">
              {t('addTransactionsToSeeData')}
            </p>
            <Link href="/new-transaction">
              <Button className="bg-green-600 hover:bg-green-700">
                {t('addNewTransaction')}
              </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('date')}</TableHead>
                <TableHead>{t('description')}</TableHead>
                <TableHead>{t('category')}</TableHead>
                <TableHead className="text-right">{t('amount')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => {
                const transactionType = getTransactionType(transaction);
                
                return (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {formatDate(transaction.date)}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: transaction.categoryColor || '#999' }}
                        />
                        <span>{transaction.categoryName}</span>
                      </div>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${transactionType === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(Math.abs(transaction.amount))}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
} 