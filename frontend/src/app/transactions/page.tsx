"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/ui/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, ChevronDown, Download, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { getTransactions, getCategories, deleteTransaction, Transaction, Category } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { tr, enUS } from 'date-fns/locale';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";

// İşlem filtreleme formu
const FilterForm = ({
  filters,
  setFilters,
  categories,
  onFilter
}: {
  filters: any;
  setFilters: (filters: any) => void;
  categories: Category[];
  onFilter: () => void;
}) => {
  const { t, language } = useTranslation();
  const dateLocale = language === 'tr' ? tr : enUS;
  
  // Tarih seçimi işlevi
  const handleDateSelect = (field: string, date: Date | undefined) => {
    if (date) {
      setFilters({
        ...filters,
        [field]: date,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("startDate")}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate ? (
                  format(filters.startDate, "PPP", { locale: dateLocale })
                ) : (
                  <span>{t("selectDate")}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.startDate}
                onSelect={(date) => handleDateSelect("startDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label>{t("endDate")}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.endDate ? (
                  format(filters.endDate, "PPP", { locale: dateLocale })
                ) : (
                  <span>{t("selectDate")}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.endDate}
                onSelect={(date) => handleDateSelect("endDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("category")}</Label>
          <Select
            value={filters.categoryId?.toString() || "all"}
            onValueChange={(value) =>
              setFilters({
                ...filters,
                categoryId: value !== "all" ? parseInt(value) : undefined,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t("allCategories")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allCategories")}</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span>{category.translationKey ? t(category.translationKey) : category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("transactionType")}</Label>
          <Select
            value={filters.type || "all"}
            onValueChange={(value) =>
              setFilters({
                ...filters,
                type: value !== "all" ? (value as "income" | "expense") : undefined,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t("allTransactions")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allTransactions")}</SelectItem>
              <SelectItem value="income">{t("income")}</SelectItem>
              <SelectItem value="expense">{t("expense")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>{t("description")}</Label>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder={t("descriptionOrContentSearch")}
            className="pl-8"
            value={filters.description || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                description: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button
          variant="outline"
          onClick={() =>
            setFilters({
              startDate: undefined,
              endDate: undefined,
              categoryId: undefined,
              type: undefined,
              description: "",
            })
          }
        >
          {t("clearFilters")}
        </Button>
        <Button onClick={onFilter}>{t("apply")}</Button>
      </div>
    </div>
  );
};

export default function TransactionsPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const dateLocale = language === 'tr' ? tr : enUS;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currency, setCurrency] = useState("₺");
  const [filters, setFilters] = useState({
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    categoryId: undefined as number | undefined,
    type: undefined as "income" | "expense" | undefined,
    description: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState<string | null>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Verileri yükle
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // İşlemleri ve kategorileri al
        const [transactionsData, categoriesData] = await Promise.all([
          getTransactions(),
          getCategories(),
        ]);
        
        setTransactions(transactionsData);
        setFilteredTransactions(transactionsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Veri yüklenirken hata:", err);
        setError("İşlemler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtreleme işlevi
  const handleFilter = () => {
    let filtered = [...transactions];

    // Tarih filtresi
    if (filters.startDate) {
      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= filters.startDate!;
      });
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999); // Günün sonuna ayarla
      
      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate <= endDate;
      });
    }

    // Kategori filtresi
    if (filters.categoryId) {
      filtered = filtered.filter(
        (transaction) => transaction.categoryId === filters.categoryId
      );
    }

    // İşlem tipi filtresi
    if (filters.type) {
      const category = categories.find(c => c.id === filters.categoryId);
      
      if (filters.type === "income") {
        filtered = filtered.filter((transaction) => {
          const category = categories.find(c => c.id === transaction.categoryId);
          return category?.type === "income";
        });
      } else if (filters.type === "expense") {
        filtered = filtered.filter((transaction) => {
          const category = categories.find(c => c.id === transaction.categoryId);
          return category?.type === "expense";
        });
      }
    }

    // Açıklama filtresi
    if (filters.description) {
      const searchTerm = filters.description.toLowerCase();
      filtered = filtered.filter((transaction) =>
        transaction.description.toLowerCase().includes(searchTerm)
      );
    }

    // Sıralama
    filtered = sortData(filtered, sortColumn, sortDirection);

    setFilteredTransactions(filtered);
  };

  // Sıralama işlevi
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Aynı sütun, yönü değiştir
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Farklı sütun, varsayılan desc
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  // Veriyi sırala
  const sortData = (
    data: Transaction[],
    column: string | null,
    direction: "asc" | "desc"
  ) => {
    if (!column) return data;

    return [...data].sort((a: any, b: any) => {
      let valueA: any;
      let valueB: any;

      // Sütuna göre değerleri al
      if (column === "date") {
        valueA = new Date(a.date).getTime();
        valueB = new Date(b.date).getTime();
      } else if (column === "amount") {
        valueA = Math.abs(a.amount);
        valueB = Math.abs(b.amount);
      } else if (column === "category") {
        const categoryA = categories.find((c) => c.id === a.categoryId);
        const categoryB = categories.find((c) => c.id === b.categoryId);
        valueA = categoryA?.name || "";
        valueB = categoryB?.name || "";
      } else {
        valueA = a[column as keyof Transaction];
        valueB = b[column as keyof Transaction];
      }

      // Karşılaştır
      if (valueA < valueB) {
        return direction === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  // Filtreleme veya sıralama değiştiğinde veriye uygula
  useEffect(() => {
    handleFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortColumn, sortDirection]);

  // Para formatı
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  // Tarih formatı
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy", { locale: dateLocale });
  };

  // İşlem silme
  const handleDeleteTransaction = async (id: number) => {
    if (window.confirm(t("deleteConfirmation"))) {
      try {
        // API üzerinden işlemi sil
        await deleteTransaction(id);
        
        // UI'dan da kaldır
        const updatedTransactions = transactions.filter(
          (transaction) => transaction.id !== id
        );
        setTransactions(updatedTransactions);
        setFilteredTransactions(
          filteredTransactions.filter((transaction) => transaction.id !== id)
        );
      } catch (error) {
        console.error("İşlem silinirken hata:", error);
        alert(t("deleteError"));
      }
    }
  };

  // CSV dışa aktarma
  const handleExportCSV = () => {
    // CSV başlıkları
    const headers = ["Tarih", "Açıklama", "Kategori", "Tutar", "Tür"];
    
    // CSV içeriği oluştur
    let csvContent = headers.join(",") + "\n";
    
    // Her işlem için satır ekle
    filteredTransactions.forEach((transaction) => {
      const category = categories.find((c) => c.id === transaction.categoryId);
      const type = category?.type === "income" ? "Gelir" : "Gider";
      const formattedDate = formatDate(transaction.date);
      
      const row = [
        `"${formattedDate}"`,
        `"${transaction.description}"`,
        `"${category?.translationKey ? t(category.translationKey) : category?.name || "Bilinmeyen"}"`,
        `"${formatCurrency(transaction.amount)}"`,
        `"${type}"`,
      ];
      
      csvContent += row.join(",") + "\n";
    });
    
    // CSV dosyasını indir
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "islemler.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sıralama ikonunu göster
  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) return null;
    
    return sortDirection === "asc" ? (
      <ChevronDown className="h-4 w-4 rotate-180" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const transactionsContent = () => {
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
        <div className="flex flex-col gap-6">
          <div className="flex justify-between gap-4">
            <h1 className="text-3xl font-bold">{t("transactionList")}</h1>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">{t("noTransactionsYet")}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              {t("noTransactionsMessage")}
            </p>
            <div className="flex justify-center">
              <Button
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                onClick={() => router.push("/new-transaction")}
              >
                <Plus size={16} />
                <span>{t("addNewTransaction")}</span>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // Toplam gelir ve gider hesapla
    const totalIncome = filteredTransactions
      .filter((transaction) => {
        const category = categories.find((c) => c.id === transaction.categoryId);
        return category?.type === "income";
      })
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

    const totalExpense = filteredTransactions
      .filter((transaction) => {
        const category = categories.find((c) => c.id === transaction.categoryId);
        return category?.type === "expense";
      })
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

    const balance = totalIncome - totalExpense;

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{t("transactionList")}</h1>
            <p className="text-muted-foreground">
              {t("manageAllTransactions")}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal size={16} />
              <span>{t("filter")}</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleExportCSV}
            >
              <Download size={16} />
              <span>{t("exportCSV")}</span>
            </Button>
            <Button
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              onClick={() => router.push("/new-transaction")}
            >
              <Plus size={16} />
              <span>{t("addNewTransaction")}</span>
            </Button>
          </div>
        </div>

        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <CollapsibleTrigger className="hidden">Filtreler</CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="bg-muted/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{t("advancedFilters")}</CardTitle>
              </CardHeader>
              <CardContent>
                <FilterForm
                  filters={filters}
                  setFilters={setFilters}
                  categories={categories}
                  onFilter={handleFilter}
                />
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">
                {t("totalBalance")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {formatCurrency(balance)}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-800">
                {t("totalIncome")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {formatCurrency(totalIncome)}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-800">
                {t("totalExpense")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">
                {formatCurrency(totalExpense)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle>{t("transactionList")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="w-[120px] cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center gap-1">
                        <span>{t("date")}</span>
                        {renderSortIcon("date")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("description")}
                    >
                      <div className="flex items-center gap-1">
                        <span>{t("description")}</span>
                        {renderSortIcon("description")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("category")}
                    >
                      <div className="flex items-center gap-1">
                        <span>{t("category")}</span>
                        {renderSortIcon("category")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="text-right cursor-pointer"
                      onClick={() => handleSort("amount")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>{t("amount")}</span>
                        {renderSortIcon("amount")}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">
                      {t("actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-muted-foreground"
                      >
                        {t("noTransactionsFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => {
                      const category = categories.find(
                        (c) => c.id === transaction.categoryId
                      );
                      const isIncome = category?.type === "income";

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
                                style={{ backgroundColor: category?.color || "#999" }}
                              ></div>
                              <span>{category?.translationKey ? t(category.translationKey) : category?.name || t("unknownCategory")}</span>
                            </div>
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${
                              isIncome ? "text-green-700" : "text-red-700"
                            }`}
                          >
                            {isIncome ? "+" : "-"}
                            {formatCurrency(Math.abs(transaction.amount))}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600"
                              onClick={() => handleDeleteTransaction(transaction.id)}
                              title={t("delete")}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return <DashboardShell>{transactionsContent()}</DashboardShell>;
} 