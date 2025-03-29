// API türleri
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface Category {
  id: number;
  name: string;
  type: "income" | "expense";
  color: string;
}

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  date: string | Date;
  categoryId: number;
  userId: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Kullanıcı veritabanı işlemleri için yardımcı fonksiyonlar
function getUsersDatabase(): User[] {
  try {
    const usersJson = localStorage.getItem("users_db");
    if (!usersJson) {
      // İlk kullanımda boş bir kullanıcı veritabanı oluştur
      localStorage.setItem("users_db", JSON.stringify([]));
      return [];
    }
    return JSON.parse(usersJson);
  } catch (error) {
    console.error("Kullanıcı veritabanı okunamadı:", error);
    return [];
  }
}

function saveUsersDatabase(users: User[]): void {
  try {
    localStorage.setItem("users_db", JSON.stringify(users));
  } catch (error) {
    console.error("Kullanıcı veritabanı kaydedilemedi:", error);
  }
}

// İşlem veritabanı işlemleri için yardımcı fonksiyonlar
function getTransactionsDatabase(): Record<number, Transaction[]> {
  try {
    const transactionsJson = localStorage.getItem("transactions_db");
    if (!transactionsJson) {
      // İlk kullanımda boş bir işlem veritabanı oluştur
      localStorage.setItem("transactions_db", JSON.stringify({}));
      return {};
    }
    return JSON.parse(transactionsJson);
  } catch (error) {
    console.error("İşlem veritabanı okunamadı:", error);
    return {};
  }
}

function saveTransactionsDatabase(transactions: Record<number, Transaction[]>): void {
  try {
    localStorage.setItem("transactions_db", JSON.stringify(transactions));
  } catch (error) {
    console.error("İşlem veritabanı kaydedilemedi:", error);
  }
}

// API istekleri için yardımcı fonksiyon
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Token geçersiz ise kullanıcıyı çıkış yaptır
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Oturum süresi doldu. Lütfen tekrar giriş yapın.");
  }

  return response;
}

// Giriş işlemi
export async function login(credentials: LoginCredentials) {
  try {
    // Kullanıcı veritabanını kontrol et
    const users = getUsersDatabase();
    const user = users.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error("Kullanıcı bulunamadı. Lütfen kayıt olun.");
    }
    
    // Gerçek bir API'da şifre kontrolü yapılacaktır
    // Burada basit bir simülasyon yapalım
    
    // Kullanıcı bulundu, oturum bilgilerini hazırla
    const mockToken = `token_${user.id}_${Date.now()}`;
    
    // Oturum bilgilerini local storage'a kaydet
    localStorage.setItem("token", mockToken);
    localStorage.setItem("user", JSON.stringify(user));
    
    return { user, token: mockToken };
  } catch (error) {
    console.error("Login error:", error);
    throw error instanceof Error ? error : new Error("Giriş başarısız. Email ve şifrenizi kontrol edin.");
  }
}

// Kayıt işlemi
export async function register(credentials: RegisterCredentials) {
  try {
    // Kullanıcı veritabanını kontrol et
    const users = getUsersDatabase();
    
    // Email adresi zaten kullanılıyor mu?
    if (users.some(u => u.email === credentials.email)) {
      throw new Error("Bu email adresi zaten kullanılıyor.");
    }
    
    // Yeni kullanıcı oluştur
    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: credentials.name,
      email: credentials.email,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    };
    
    // Kullanıcıyı veritabanına ekle ve kaydet
    users.push(newUser);
    saveUsersDatabase(users);
    
    // Oturum token'ı oluştur
    const mockToken = `token_${newUser.id}_${Date.now()}`;
    
    // Oturum bilgilerini local storage'a kaydet
    localStorage.setItem("token", mockToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    
    return { user: newUser, token: mockToken };
  } catch (error) {
    console.error("Register error:", error);
    throw error instanceof Error ? error : new Error("Kayıt başarısız. Lütfen tekrar deneyin.");
  }
}

// Şifre sıfırlama isteği
export async function forgotPassword(email: string) {
  try {
    // Gerçek API'ye istek atılacak
    // Şu anda başarılı olduğunu varsayıyoruz
    return { success: true, message: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi." };
  } catch (error) {
    console.error("Forgot password error:", error);
    throw new Error("Şifre sıfırlama isteği başarısız. Lütfen tekrar deneyin.");
  }
}

// Çıkış işlemi
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

// Kullanıcı bilgilerini getir
export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem("user");
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as User;
  } catch (error) {
    console.error("Error parsing user JSON:", error);
    return null;
  }
}

// Kategorileri getir
export async function getCategories(): Promise<Category[]> {
  try {
    // Gerçek API'ye istek atılacak
    // Şu anda varsayılan kategorileri döndürüyoruz
    // API entegrasyonu için bu kod kullanılacak:
    // const response = await fetchWithAuth("/categories");
    // if (!response.ok) throw new Error("Kategoriler alınamadı");
    // return await response.json();
    
    // Varsayılan kategori listesi - API entegrasyonu sırasında kaldırılacak
    return [
      { id: 1, name: "Maaş", type: "income", color: "#10b981" },
      { id: 2, name: "Ek Gelir", type: "income", color: "#06b6d4" },
      { id: 3, name: "Hediye", type: "income", color: "#8b5cf6" },
      { id: 4, name: "Yatırım", type: "income", color: "#3b82f6" },
      { id: 5, name: "Market", type: "expense", color: "#ef4444" },
      { id: 6, name: "Kira", type: "expense", color: "#f97316" },
      { id: 7, name: "Faturalar", type: "expense", color: "#f59e0b" },
      { id: 8, name: "Eğlence", type: "expense", color: "#84cc16" },
      { id: 9, name: "Sağlık", type: "expense", color: "#14b8a6" },
      { id: 10, name: "Ulaşım", type: "expense", color: "#6366f1" },
    ];
  } catch (error) {
    console.error("Get categories error:", error);
    throw new Error("Kategoriler alınamadı. Lütfen tekrar deneyin.");
  }
}

// İşlemleri getir
export async function getTransactions(): Promise<Transaction[]> {
  try {
    // Giriş yapmış kullanıcıyı kontrol et
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return [];
    }
    
    // İşlem veritabanını al ve kullanıcının işlemlerini döndür
    const allTransactions = getTransactionsDatabase();
    return allTransactions[currentUser.id] || [];
  } catch (error) {
    console.error("Get transactions error:", error);
    throw new Error("İşlemler alınamadı. Lütfen tekrar deneyin.");
  }
}

// Yeni işlem ekle
export async function addTransaction(transaction: Omit<Transaction, "id" | "userId">): Promise<Transaction> {
  try {
    // Kullanıcı kontrolü
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("Kullanıcı oturumu bulunamadı");
    }
    
    // İşlem veritabanını al
    const allTransactions = getTransactionsDatabase();
    
    // Kullanıcının işlemleri yoksa oluştur
    if (!allTransactions[currentUser.id]) {
      allTransactions[currentUser.id] = [];
    }
    
    // Yeni işlem için id oluştur
    const userTransactions = allTransactions[currentUser.id];
    const newId = userTransactions.length > 0 
      ? Math.max(...userTransactions.map(t => t.id)) + 1 
      : 1;
    
    // Yeni işlemi oluştur
    const newTransaction: Transaction = {
      ...transaction,
      id: newId,
      userId: currentUser.id,
    };
    
    // İşlemi kullanıcının listesine ekle
    userTransactions.push(newTransaction);
    
    // Veritabanını güncelle
    saveTransactionsDatabase(allTransactions);
    
    return newTransaction;
  } catch (error) {
    console.error("Add transaction error:", error);
    throw new Error("İşlem eklenemedi. Lütfen tekrar deneyin.");
  }
}

// İşlem sil
export async function deleteTransaction(id: number): Promise<boolean> {
  try {
    // Kullanıcı kontrolü
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("Kullanıcı oturumu bulunamadı");
    }
    
    // İşlem veritabanını al
    const allTransactions = getTransactionsDatabase();
    
    // Kullanıcının işlemleri yoksa hata döndür
    if (!allTransactions[currentUser.id]) {
      throw new Error("Kullanıcı işlemleri bulunamadı");
    }
    
    // İşlemi bul ve sil
    const userTransactions = allTransactions[currentUser.id];
    const initialLength = userTransactions.length;
    
    allTransactions[currentUser.id] = userTransactions.filter(t => t.id !== id);
    
    // İşlem bulunamadıysa hata döndür
    if (initialLength === allTransactions[currentUser.id].length) {
      throw new Error("Silinecek işlem bulunamadı");
    }
    
    // Veritabanını güncelle
    saveTransactionsDatabase(allTransactions);
    
    return true;
  } catch (error) {
    console.error("Delete transaction error:", error);
    throw new Error("İşlem silinemedi. Lütfen tekrar deneyin.");
  }
}

// Özet verileri getir (Dashboard için)
export async function getDashboardSummary() {
  try {
    // İşlemleri ve kategorileri al
    const transactions = await getTransactions();
    const categories = await getCategories();
    
    // İşlem yoksa boş bir özet döndür
    if (transactions.length === 0) {
      return {
        monthlyData: [],
        expenseByCategory: [],
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        recentTransactions: [],
      };
    }
    
    // Son 6 ayın verilerini hesapla
    const last6Months: string[] = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = date.toLocaleString('tr-TR', { month: 'short' });
      last6Months.push(monthName);
    }
    
    // Aylık gelir ve gider verilerini hesapla
    const monthlyData = last6Months.map(month => {
      const monthIndex = today.getMonth() - last6Months.indexOf(month);
      const year = monthIndex < 0 ? today.getFullYear() - 1 : today.getFullYear();
      const adjustedMonthIndex = monthIndex < 0 ? monthIndex + 12 : monthIndex;
      
      // Ay başlangıç ve bitiş tarihi
      const startDate = new Date(year, adjustedMonthIndex, 1);
      const endDate = new Date(year, adjustedMonthIndex + 1, 0);
      
      // Bu ayın işlemlerini filtrele
      const monthTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
      
      // Gelir ve giderleri hesapla
      const income = monthTransactions
        .filter(t => {
          const category = categories.find(c => c.id === t.categoryId);
          return category?.type === "income";
        })
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      const expense = monthTransactions
        .filter(t => {
          const category = categories.find(c => c.id === t.categoryId);
          return category?.type === "expense";
        })
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      return {
        name: month,
        gelir: income,
        gider: expense,
      };
    });
    
    // Kategorilere göre harcama dağılımı
    const expenseByCategory = categories
      .filter(category => category.type === "expense")
      .map(category => {
        const amount = transactions
          .filter(t => t.categoryId === category.id)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        return {
          name: category.name,
          value: amount,
          color: category.color,
        };
      })
      .sort((a, b) => b.value - a.value);
    
    // Toplam gelir, gider ve kalan para
    const totalIncome = transactions
      .filter(t => {
        const category = categories.find(c => c.id === t.categoryId);
        return category?.type === "income";
      })
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const totalExpense = transactions
      .filter(t => {
        const category = categories.find(c => c.id === t.categoryId);
        return category?.type === "expense";
      })
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const balance = totalIncome - totalExpense;
    
    // Son 5 işlem
    const recentTransactions = transactions
      .slice(0, 5)
      .map(transaction => {
        const category = categories.find(c => c.id === transaction.categoryId);
        return {
          ...transaction,
          categoryName: category?.name || "Bilinmeyen",
          categoryColor: category?.color || "#999",
          categoryType: category?.type || "expense",
        };
      });
    
    return {
      monthlyData,
      expenseByCategory,
      totalIncome,
      totalExpense,
      balance,
      recentTransactions,
    };
  } catch (error) {
    console.error("Get dashboard summary error:", error);
    throw new Error("Özet veriler alınamadı. Lütfen tekrar deneyin.");
  }
} 