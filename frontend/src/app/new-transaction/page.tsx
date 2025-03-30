"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/ui/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { tr, enUS } from 'date-fns/locale';
import { CalendarIcon, SaveIcon, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Category, addTransaction, getCategories } from "@/lib/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/lib/i18n";

export default function NewTransactionPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [transactionType, setTransactionType] = useState<"expense" | "income">("expense");
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Date locale based on selected language
  const dateLocale = language === 'tr' ? tr : enUS;

  // Yeni işlem için form state'i
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date(),
    categoryId: 0,
  });

  // Verileri yükle
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        
        // İlk kategoriyi seç
        const defaultCategory = categoriesData.find(c => c.type === transactionType);
        if (defaultCategory) {
          setFormData(prev => ({
            ...prev,
            categoryId: defaultCategory.id,
          }));
        }
      } catch (err) {
        console.error("Veri yüklenirken hata:", err);
        setError(t("errorLoadingData"));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [transactionType, t]);

  // Form değişiklikleri
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "categoryId" ? parseInt(value) : value,
    }));
  };

  // Tarih değişikliği
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        date,
      }));
    }
  };

  // İşlem tipini değiştir
  const handleTypeChange = (type: "expense" | "income") => {
    setTransactionType(type);
    
    // Yeni tipe göre bir kategori seç
    const defaultCategory = categories.find(c => c.type === type);
    if (defaultCategory) {
      setFormData(prev => ({
        ...prev,
        categoryId: defaultCategory.id,
      }));
    }
  };

  // Form gönderimi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasyon
    if (!formData.description.trim()) {
      setError(t("enterDescription"));
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError(t("enterAmount"));
      return;
    }

    if (!formData.categoryId) {
      setError(t("selectCategory"));
      return;
    }

    setError("");
    setSubmitLoading(true);

    try {
      // İşlem tutarını ayarla (gider için negatif, gelir için pozitif)
      const amount = parseFloat(formData.amount);
      const adjustedAmount = transactionType === "expense" ? -Math.abs(amount) : Math.abs(amount);

      // İşlemi ekle
      await addTransaction({
        description: formData.description,
        amount: adjustedAmount,
        date: formData.date,
        categoryId: formData.categoryId,
      });

      // Başarılı mesajı göster
      setSuccess(true);
      
      // Formu sıfırla
      setFormData({
        description: "",
        amount: "",
        date: new Date(),
        categoryId: 0,
      });

      // 2 saniye sonra dashboard'a yönlendir
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("İşlem eklenirken hata:", err);
      setError(t("errorLoadingData"));
    } finally {
      setSubmitLoading(false);
    }
  };

  // Filtrelenmiş kategoriler
  const filteredCategories = categories.filter(
    category => category.type === transactionType
  );

  // Temel ve ek kategorileri ayır
  const basicCategories = filteredCategories.filter(category => category.isBasic);
  const additionalCategories = filteredCategories.filter(category => !category.isBasic);
  
  // Gösterilecek kategorileri belirle
  const categoriesToShow = showAllCategories ? filteredCategories : basicCategories;

  // Kategori seçili mi?
  const selectedCategory = categories.find(
    category => category.id === formData.categoryId
  );

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("newTransaction")}</h1>
          <p className="text-muted-foreground">
            {t("enterTransactionDetails")}
          </p>
        </div>

        {success ? (
          <div className="rounded-lg border p-8 flex flex-col items-center justify-center bg-green-50 text-green-900 space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold">{t("transactionSuccess")}</h2>
            <p>{t("transactionSuccessMessage")}</p>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t("addTransaction")}</CardTitle>
              <CardDescription>
                {t("enterTransactionDetails")}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-900 p-3 rounded-md flex items-start space-x-2">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* İşlem Tipi Seçimi */}
                <div className="space-y-2">
                  <Label>{t("transactionType")}</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={transactionType === "expense" ? "default" : "outline"}
                      className={cn(
                        "flex items-center justify-center gap-2",
                        transactionType === "expense" && "bg-red-600 hover:bg-red-700"
                      )}
                      onClick={() => handleTypeChange("expense")}
                    >
                      <span>{t("expense")}</span>
                    </Button>
                    <Button
                      type="button"
                      variant={transactionType === "income" ? "default" : "outline"}
                      className={cn(
                        "flex items-center justify-center gap-2",
                        transactionType === "income" && "bg-green-600 hover:bg-green-700"
                      )}
                      onClick={() => handleTypeChange("income")}
                    >
                      <span>{t("income")}</span>
                    </Button>
                  </div>
                </div>

                {/* Açıklama */}
                <div className="space-y-2">
                  <Label htmlFor="description">{t("description")}</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder={t("enterDescription")}
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                {/* Tutar */}
                <div className="space-y-2">
                  <Label htmlFor="amount">{t("amount")} (₺)</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleChange}
                  />
                </div>

                {/* Tarih Seçimi */}
                <div className="space-y-2">
                  <Label htmlFor="date">{t("date")}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? (
                          format(formData.date, "PPP", { locale: dateLocale })
                        ) : (
                          <span>{t("selectDate")}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={handleDateChange}
                        initialFocus
                        locale={dateLocale}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Kategori Seçimi */}
                <div className="space-y-2">
                  <Label htmlFor="categoryId">{t("category")}</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {loading ? (
                      <div className="col-span-full flex justify-center items-center min-h-[100px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : categoriesToShow.length > 0 ? (
                      <>
                        {categoriesToShow.map((category) => (
                          <div
                            key={category.id}
                            className={cn(
                              "border rounded-md p-3 cursor-pointer transition-all hover:border-blue-500",
                              formData.categoryId === category.id
                                ? "border-blue-500 ring-2 ring-blue-500/20"
                                : "border-gray-200"
                            )}
                            onClick={() => setFormData(prev => ({ ...prev, categoryId: category.id }))}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: category.color }}
                              ></div>
                              <span>{category.name}</span>
                            </div>
                          </div>
                        ))}
                        
                        {/* Daha Fazla Göster / Daha Az Göster Düğmesi */}
                        {additionalCategories.length > 0 && (
                          <div 
                            className="col-span-full mt-2"
                          >
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full text-center"
                              onClick={() => setShowAllCategories(!showAllCategories)}
                            >
                              {showAllCategories ? (
                                <span>{t("showLess")}</span>
                              ) : (
                                <span>
                                  {t("showMoreCategories").replace("%count%", additionalCategories.length.toString())}
                                </span>
                              )}
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="col-span-full text-center text-gray-500">
                        {t("noCategoriesFound")}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  {t("cancel")}
                </Button>
                <Button
                  type="submit"
                  className={cn(
                    "gap-2",
                    selectedCategory?.type === "expense"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  )}
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>{t("saving")}</span>
                    </>
                  ) : (
                    <>
                      <SaveIcon className="h-4 w-4" />
                      <span>{t("save")}</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
} 