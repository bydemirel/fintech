"use client";

import { useEffect, useState, useContext, createContext } from 'react';
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
    user: "Kullanıcı",
    authentication: "Kimlik Doğrulama",
    login: "Giriş Yap",
    register: "Hesap Oluştur",
    forgotPassword: "Şifremi Unuttum",
    footerText: "FinTech - Kişisel Finans Takip Uygulaması",
    
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
    exportCSV: "CSV İndir",
    deleteConfirmation: "Bu işlemi silmek istediğinize emin misiniz?",
    deleteError: "İşlem silinemedi. Lütfen tekrar deneyin.",
    manageAllTransactions: "Tüm gelir ve gider işlemlerinizi yönetin.",
    advancedFilters: "Gelişmiş Filtreler",
    allCategories: "Tüm kategoriler",
    allTransactions: "Tüm işlemler",
    descriptionOrContentSearch: "Açıklama veya içerik ara...",
    apply: "Uygula",
    totalBalance: "Toplam Bakiye",
    delete: "Sil",
    unknownCategory: "Bilinmeyen kategori",
    showing: "Gösterilen",
    of: "/",
    previous: "Önceki",
    next: "Sonraki",
    
    // Yeni İşlem
    addTransaction: "İşlem Ekle",
    enterTransactionDetails: "İşlem detaylarını giriniz",
    selectCategory: "Kategori Seçin",
    enterAmount: "Tutar Girin",
    enterDescription: "Açıklama Girin",
    selectDate: "Tarih Seçin",
    save: "Kaydet",
    cancel: "İptal",
    showMore: "Daha Fazla Göster",
    showMoreCategories: "Daha Fazla Kategori Göster (%count%)",
    showLess: "Daha Az Göster",
    noCategoriesFound: "Bu tipte kategori bulunamadı.",
    transactionSuccess: "İşlem Başarılı!",
    transactionSuccessMessage: "İşleminiz başarıyla kaydedildi. Ana sayfaya yönlendiriliyorsunuz...",
    
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
    errorFilteringTransactions: "İşlemler filtrelenirken bir hata oluştu.",
    
    // Kategoriler
    categorySalary: "Maaş",
    categoryExtraIncome: "Ek Gelir",
    categoryGiftIncome: "Hediye",
    categoryInvestment: "Yatırım",
    categoryGrocery: "Market",
    categoryRent: "Kira",
    categoryBills: "Faturalar",
    categoryEntertainment: "Eğlence",
    categoryHealth: "Sağlık",
    categoryTransport: "Ulaşım",
    categoryClothing: "Giyim",
    categoryRestaurant: "Restoran",
    categoryElectronics: "Elektronik",
    categoryEducation: "Eğitim",
    categorySports: "Spor",
    categoryBeauty: "Bakım & Kozmetik",
    categoryHomeItems: "Ev Eşyaları",
    categoryGiftsDonations: "Hediye & Bağış",
    categoryTravel: "Tatil & Seyahat",
    categoryInsurance: "Sigorta",
    categoryOtherExpenses: "Diğer Giderler",
  },
  en: {
    // General
    dashboard: "Dashboard",
    newTransaction: "New Transaction",
    transactions: "Transactions",
    settings: "Settings",
    logout: "Logout",
    user: "User",
    authentication: "Authentication",
    login: "Login",
    register: "Register",
    forgotPassword: "Forgot Password",
    footerText: "FinTech - Personal Finance Tracking App",
    
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
    exportCSV: "Export CSV",
    deleteConfirmation: "Are you sure you want to delete this transaction?",
    deleteError: "Failed to delete the transaction. Please try again.",
    manageAllTransactions: "Manage all your income and expense transactions.",
    advancedFilters: "Advanced Filters",
    allCategories: "All categories",
    allTransactions: "All transactions",
    descriptionOrContentSearch: "Search for description or content...",
    apply: "Apply",
    totalBalance: "Total Balance",
    delete: "Delete",
    unknownCategory: "Unknown category",
    showing: "Showing",
    of: "of",
    previous: "Previous",
    next: "Next",
    
    // Yeni İşlem
    addTransaction: "Add Transaction",
    enterTransactionDetails: "Enter transaction details",
    selectCategory: "Select Category",
    enterAmount: "Enter Amount",
    enterDescription: "Enter Description",
    selectDate: "Select Date",
    save: "Save",
    cancel: "Cancel",
    showMore: "Show More",
    showMoreCategories: "Show More Categories (%count%)",
    showLess: "Show Less",
    noCategoriesFound: "No categories found for this type.",
    transactionSuccess: "Transaction Successful!",
    transactionSuccessMessage: "Your transaction has been successfully saved. You are being redirected to the dashboard...",
    
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
    errorFilteringTransactions: "Error filtering transactions.",
    
    // Categories
    categorySalary: "Salary",
    categoryExtraIncome: "Extra Income",
    categoryGiftIncome: "Gift",
    categoryInvestment: "Investment",
    categoryGrocery: "Grocery",
    categoryRent: "Rent",
    categoryBills: "Bills",
    categoryEntertainment: "Entertainment",
    categoryHealth: "Health",
    categoryTransport: "Transportation",
    categoryClothing: "Clothing",
    categoryRestaurant: "Restaurant",
    categoryElectronics: "Electronics",
    categoryEducation: "Education",
    categorySports: "Sports",
    categoryBeauty: "Beauty & Care",
    categoryHomeItems: "Home Items",
    categoryGiftsDonations: "Gifts & Donations",
    categoryTravel: "Travel & Vacation",
    categoryInsurance: "Insurance",
    categoryOtherExpenses: "Other Expenses",
  }
};

// Context için tip tanımlaması
type TranslationContextType = {
  t: (key: string) => string;
  language: 'tr' | 'en';
  changeLanguage: (lang: 'tr' | 'en') => void;
};

// Context oluşturma
const TranslationContext = createContext<TranslationContextType | null>(null);

// Dil değiştirme hook'unun mantık kısmı
function useTranslationLogic() {
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');

  useEffect(() => {
    // LocalStorage'dan dil tercihini al
    const savedLanguage = localStorage.getItem('language') as 'tr' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Çeviri fonksiyonu
  const t = React.useCallback((key: string): string => {
    // @ts-ignore: translations içinde key'in varlığını kontrol ediyoruz
    return translations[language][key] || key;
  }, [language]);

  // Dil değiştirme fonksiyonu
  const changeLanguage = React.useCallback((lang: 'tr' | 'en') => {
    localStorage.setItem('language', lang);
    setLanguage(lang);
    document.documentElement.lang = lang;
  }, []);

  return { t, language, changeLanguage };
}

// Context provider bileşeni
export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const value = useTranslationLogic();
  
  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

// Kullanım için hook
export function useTranslation() {
  const context = useContext(TranslationContext);
  
  if (!context) {
    // Context dışında kullanılıyorsa kendi mantığını çalıştır
    return useTranslationLogic();
  }
  
  return context;
} 