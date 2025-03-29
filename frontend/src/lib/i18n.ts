import { useEffect, useState } from 'react';
import React from 'react';

// Dil çevirileri
const translations = {
  tr: {
    // Genel
    dashboard: "Ana Sayfa",
    newTransaction: "Yeni İşlem",
    transactions: "İşlemler",
    settings: "Ayarlar",
    logout: "Çıkış Yap",
    
    // Dashboard
    incomeExpenseAnalysis: "Gelir & Gider Analizi",
    monthlyComparison: "Aylık gelir ve gider karşılaştırması",
    totalIncome: "Toplam Gelir",
    totalExpense: "Toplam Gider",
    balance: "Bakiye",
    expenseAnalysis: "Gider Analizi",
    expensesByCategory: "Kategorilere göre giderler",
    recentTransactions: "Son İşlemler",
    viewAll: "Tümünü Gör",
    noTransactionsYet: "Henüz işlem bulunmuyor",
    loading: "Veriler yükleniyor...",
    retry: "Yeniden Dene",
    addNewTransaction: "Yeni İşlem Ekle",
    addTransactionsToSeeCharts: "Grafikleri görmek için işlem ekleyin",
    addTransactionsToSeeData: "İşlemlerinizi görüntülemek için yeni işlem ekleyin",
    welcome: "Fintech uygulamasına hoş geldiniz!",
    noTransactionsMessage: "Henüz hiç işlem eklemediniz. Finans durumunuzu takip etmek için yeni bir işlem ekleyerek başlayabilirsiniz.",
    
    // İşlemler
    transactionList: "İşlemler",
    date: "Tarih",
    description: "Açıklama",
    category: "Kategori",
    amount: "Tutar",
    actions: "İşlemler",
    filter: "Filtrele",
    clearFilters: "Filtreleri Temizle",
    startDate: "Başlangıç Tarihi",
    endDate: "Bitiş Tarihi",
    transactionType: "İşlem Tipi",
    all: "Tümü",
    income: "Gelir",
    expense: "Gider",
    noTransactionsFound: "İşlem bulunamadı",
    difference: "Fark",
    
    // Yeni İşlem
    addTransaction: "İşlem Ekle",
    enterTransactionDetails: "İşlem detaylarını giriniz",
    selectCategory: "Kategori Seçin",
    enterAmount: "Tutar Girin",
    enterDescription: "Açıklama Girin",
    selectDate: "Tarih Seçin",
    save: "Kaydet",
    cancel: "İptal",
    
    // Ayarlar
    appearance: "Görünüm",
    language: "Dil",
    customizeAppearance: "Uygulamanın görünümünü özelleştirin",
    theme: "Tema",
    selectAppTheme: "Uygulama için açık veya koyu temayı seçin",
    light: "Açık",
    dark: "Koyu",
    system: "Sistem",
    darkMode: "Koyu Mod",
    quicklyToggleDarkMode: "Koyu modu hızlıca açın veya kapatın",
    languageSettings: "Dil Ayarları",
    selectAppLanguage: "Uygulamanın dilini seçin",
    appLanguage: "Uygulama Dili",
    turkish: "Türkçe",
    english: "İngilizce",
    saveChanges: "Değişiklikleri Kaydet",
    saving: "Kaydediliyor...",
    settingsSaved: "Ayarlar kaydedildi",
    allSettingsSaved: "Tüm ayarlarınız başarıyla kaydedildi",
    
    // Hata mesajları
    errorLoadingData: "Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.",
    errorFilteringTransactions: "İşlemler filtrelenirken bir hata oluştu."
  },
  en: {
    // General
    dashboard: "Dashboard",
    newTransaction: "New Transaction",
    transactions: "Transactions",
    settings: "Settings",
    logout: "Logout",
    
    // Dashboard
    incomeExpenseAnalysis: "Income & Expense Analysis",
    monthlyComparison: "Monthly income and expense comparison",
    totalIncome: "Total Income",
    totalExpense: "Total Expense",
    balance: "Balance",
    expenseAnalysis: "Expense Analysis",
    expensesByCategory: "Expenses by category",
    recentTransactions: "Recent Transactions",
    viewAll: "View All",
    noTransactionsYet: "No transactions yet",
    loading: "Loading data...",
    retry: "Retry",
    addNewTransaction: "Add New Transaction",
    addTransactionsToSeeCharts: "Add transactions to see charts",
    addTransactionsToSeeData: "Add a new transaction to view your transactions",
    welcome: "Welcome to Fintech app!",
    noTransactionsMessage: "You haven't added any transactions yet. Start tracking your finances by adding a new transaction.",
    
    // Transactions
    transactionList: "Transactions",
    date: "Date",
    description: "Description",
    category: "Category",
    amount: "Amount",
    actions: "Actions",
    filter: "Filter",
    clearFilters: "Clear Filters",
    startDate: "Start Date",
    endDate: "End Date",
    transactionType: "Transaction Type",
    all: "All",
    income: "Income",
    expense: "Expense",
    noTransactionsFound: "No transactions found",
    difference: "Difference",
    
    // New Transaction
    addTransaction: "Add Transaction",
    enterTransactionDetails: "Enter transaction details",
    selectCategory: "Select Category",
    enterAmount: "Enter Amount",
    enterDescription: "Enter Description",
    selectDate: "Select Date",
    save: "Save",
    cancel: "Cancel",
    
    // Settings
    appearance: "Appearance",
    language: "Language",
    customizeAppearance: "Customize the appearance of the application",
    theme: "Theme",
    selectAppTheme: "Select light or dark theme for the application",
    light: "Light",
    dark: "Dark",
    system: "System",
    darkMode: "Dark Mode",
    quicklyToggleDarkMode: "Quickly toggle dark mode on or off",
    languageSettings: "Language Settings",
    selectAppLanguage: "Select the language for the application",
    appLanguage: "Application Language",
    turkish: "Turkish",
    english: "English",
    saveChanges: "Save Changes",
    saving: "Saving...",
    settingsSaved: "Settings saved",
    allSettingsSaved: "All your settings have been successfully saved",
    
    // Error messages
    errorLoadingData: "Error loading data. Please refresh the page.",
    errorFilteringTransactions: "Error filtering transactions."
  }
};

// Dil context hook'u
export function useTranslation() {
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');

  useEffect(() => {
    // LocalStorage'dan dil tercihini al
    const savedLanguage = localStorage.getItem('language') as 'tr' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Çeviri fonksiyonu - useCallback ile memoize ediyoruz
  const t = React.useCallback((key: string): string => {
    // @ts-ignore: translations içinde key'in varlığını kontrol ediyoruz
    return translations[language][key] || key;
  }, [language]); // Sadece dil değiştiğinde fonksiyon değişecek

  // Dil değiştirme fonksiyonu - useCallback ile memoize ediyoruz
  const changeLanguage = React.useCallback((lang: 'tr' | 'en') => {
    localStorage.setItem('language', lang);
    setLanguage(lang);
    document.documentElement.lang = lang;
  }, []); // Değişmesi gerekmeyen bir fonksiyon

  // Memoize edilmiş değerler
  return React.useMemo(() => {
    return { t, language, changeLanguage };
  }, [t, language, changeLanguage]);
} 