"use client";

import { useState, useEffect } from "react";
import { BalanceCard } from "@/components/ui/dashboard/BalanceCard";
import { ExpenseChart } from "@/components/ui/dashboard/ExpenseChart";
import { IncomeExpenseChart } from "@/components/ui/dashboard/IncomeExpenseChart";
import { RecentTransactions } from "@/components/ui/dashboard/RecentTransactions";
import { FilterForm } from "@/components/ui/dashboard/FilterForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  getTransactions, 
  getFilteredTransactions, 
  getCategories, 
  getBalance, 
  getMonthlyData, 
  getCategoryExpenses,
  Transaction,
  Category
} from "@/lib/api";

interface CategoryExpense {
  id: number;
  name: string;
  amount: number;
  color: string;
}

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryExpense[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [currency, setCurrency] = useState("TRY");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Verileri yükle
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Paralel olarak tüm verileri yükle
        const [
          transactionsData,
          categoriesData,
          balanceData,
          monthlyStatsData,
          categoryExpensesData
        ] = await Promise.all([
          getTransactions(),
          getCategories(),
          getBalance(),
          getMonthlyData(),
          getCategoryExpenses()
        ]);
        
        setTransactions(transactionsData);
        setFilteredTransactions(transactionsData);
        setCategories(categoriesData);
        setBalance(balanceData.balance);
        setIncome(balanceData.income);
        setExpense(balanceData.expense);
        setMonthlyData(monthlyStatsData);
        setCategoryData(categoryExpensesData);
      } catch (err) {
        console.error("Veri yüklenirken hata:", err);
        setError("Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtre işlemi
  const handleFilter = async (filters: {
    startDate?: string;
    endDate?: string;
    categoryId?: number;
    type?: "income" | "expense";
  }) => {
    try {
      // Filtre boşsa tüm işlemleri göster
      if (
        !filters.startDate && 
        !filters.endDate && 
        !filters.categoryId && 
        !filters.type
      ) {
        setFilteredTransactions(transactions);
        return;
      }
      
      // API'dan filtrelenmiş verileri al
      const filteredData = await getFilteredTransactions(filters);
      setFilteredTransactions(filteredData);
    } catch (err) {
      console.error("Filtreleme hatası:", err);
      setError("İşlemler filtrelenirken bir hata oluştu.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4 sm:px-6">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Veriler yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4 sm:px-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          <p>{error}</p>
          <Button 
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Yeniden Dene
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/transactions/new">
          <Button className="bg-green-600 hover:bg-green-700">
            Yeni İşlem Ekle
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <BalanceCard 
          balance={balance} 
          income={income} 
          expense={expense} 
          currency={currency}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <FilterForm categories={categories} onFilter={handleFilter} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ExpenseChart data={categoryData} currency={currency} />
        <IncomeExpenseChart data={monthlyData} currency={currency} />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <RecentTransactions transactions={filteredTransactions} currency={currency} />
      </div>
    </div>
  );
} 