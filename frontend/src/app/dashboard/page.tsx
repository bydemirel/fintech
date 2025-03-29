"use client";

import { useState, useEffect } from "react";
import { BalanceCard } from "@/components/ui/dashboard/BalanceCard";
import { ExpenseChart } from "@/components/ui/dashboard/ExpenseChart";
import { IncomeExpenseChart } from "@/components/ui/dashboard/IncomeExpenseChart";
import { RecentTransactions } from "@/components/ui/dashboard/RecentTransactions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardShell } from "@/components/ui/dashboard/DashboardShell";
import { 
  getTransactions, 
  getCategories,
  getDashboardSummary,
  Transaction,
  Category
} from "@/lib/api";
import { useTranslation } from "@/lib/i18n";
import { Plus } from "lucide-react";

// ExpenseChart bileşeni için veri yapısı
interface CategoryData {
  id: number;
  name: string;
  amount: number;
  color: string;
}

// IncomeExpenseChart bileşeni için veri yapısı
interface ChartMonthlyData {
  month: string;
  income: number;
  expense: number;
}

// RecentTransactions bileşeni için genişletilmiş işlem
interface ExtendedTransaction extends Transaction {
  categoryName?: string;
  categoryColor?: string;
  categoryType?: "income" | "expense";
  type?: "income" | "expense";
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<ExtendedTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<ExtendedTransaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [monthlyData, setMonthlyData] = useState<ChartMonthlyData[]>([]);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [currency, setCurrency] = useState("₺");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Verileri yükle
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Kategorileri al
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        
        // Dashboard özet bilgilerini al
        const dashboardData = await getDashboardSummary();
        
        setTransactions(dashboardData.recentTransactions);
        setFilteredTransactions(dashboardData.recentTransactions);
        
        // API'den gelen verileri uygun formatlara dönüştür
        
        // categoryData için ExpenseChart'a uygun formata dönüştür
        const expenseCategoryData = dashboardData.expenseByCategory.map(item => ({
          id: categoriesData.find(c => c.name === item.name)?.id || 0,
          name: item.name,
          amount: item.value,
          color: item.color
        }));
        setCategoryData(expenseCategoryData);
        
        // monthlyData için IncomeExpenseChart'a uygun formata dönüştür
        const chartData = dashboardData.monthlyData.map(item => ({
          month: item.name,
          income: item.gelir,
          expense: item.gider
        }));
        setMonthlyData(chartData);
        
        setBalance(dashboardData.balance);
        setIncome(dashboardData.totalIncome);
        setExpense(dashboardData.totalExpense);
      } catch (err) {
        console.error("Veri yüklenirken hata:", err);
        setError(t("errorLoadingData"));
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
        // Dashboard özet bilgilerini al
        const dashboardData = await getDashboardSummary();
        setFilteredTransactions(dashboardData.recentTransactions);
        return;
      }
      
      // API'dan tüm işlemleri al
      const allTransactions = await getTransactions();
      
      // Manuel filtreleme işlemi
      let filtered = [...allTransactions];
      
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        filtered = filtered.filter(t => new Date(t.date) >= startDate);
      }
      
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        filtered = filtered.filter(t => new Date(t.date) <= endDate);
      }
      
      if (filters.categoryId) {
        filtered = filtered.filter(t => t.categoryId === filters.categoryId);
      }
      
      if (filters.type) {
        filtered = filtered.filter(t => {
          const category = categories.find(c => c.id === t.categoryId);
          return category?.type === filters.type;
        });
      }
      
      // İşlemleri genişletilmiş forma dönüştür
      const extendedTransactions = filtered.slice(0, 5).map(transaction => {
        const category = categories.find(c => c.id === transaction.categoryId);
        return {
          ...transaction,
          categoryName: category?.name || "Bilinmeyen",
          categoryColor: category?.color || "#CCC",
          type: category?.type || "expense"
        } as ExtendedTransaction;
      });
      
      setFilteredTransactions(extendedTransactions);
    } catch (err) {
      console.error("Filtreleme hatası:", err);
      setError(t("errorFilteringTransactions"));
    }
  };

  const dashboardContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">{t("loading")}</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          <p>{error}</p>
          <Button 
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            {t("retry")}
          </Button>
        </div>
      );
    }

    // İşlem yoksa özel bir içerik göster
    if (transactions.length === 0) {
      return (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
            <Link href="/new-transaction">
              <Button className="bg-green-600 hover:bg-green-700">
                {t("addNewTransaction")}
              </Button>
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">{t("welcome")}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              {t("noTransactionsMessage")}
            </p>
            <div className="flex justify-center">
              <Link href="/new-transaction">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-5 w-5" />
                  {t("addNewTransaction")}
                </Button>
              </Link>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
          <Link href="/new-transaction">
            <Button className="bg-green-600 hover:bg-green-700">
              {t("addNewTransaction")}
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ExpenseChart data={categoryData} currency={currency} />
          <IncomeExpenseChart data={monthlyData} currency={currency} />
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <RecentTransactions transactions={filteredTransactions} currency={currency} />
        </div>
      </>
    );
  };

  return (
    <DashboardShell>
      {dashboardContent()}
    </DashboardShell>
  );
} 