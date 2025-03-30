// API türleri
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface Category {
  id: number;
  name: string;
  type: "income" | "expense";
  color: string;
  isBasic?: boolean; // Temel kategorileri işaretlemek için
  translationKey?: string; // Çeviri anahtarı
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
    
    // Demo kullanıcısını tanımlayalım
    const demoUser: User = {
      id: 1,
      name: "Demo Kullanıcı",
      email: "demo@example.com",
      password: "demo123",
      avatar: "https://i.pravatar.cc/150?img=1"
    };
    
    // bariscandemirel35@gmail.com kullanıcısını tanımlayalım
    const barisUser: User = {
      id: 2,
      name: "Barış Demirel",
      email: "bariscandemirel35@gmail.com",
      password: "123456",
      avatar: "https://i.pravatar.cc/150?img=2"
    };
    
    if (!usersJson) {
      // İlk kullanımda boş bir kullanıcı veritabanı oluştur ve demo kullanıcılarını ekle
      const initialUsers = [demoUser, barisUser];
      localStorage.setItem("users_db", JSON.stringify(initialUsers));
      return initialUsers;
    }
    
    // Mevcut kullanıcıları alıp eksik şifreleri ekleyelim
    let users = JSON.parse(usersJson);
    let updated = false;
    
    // Demo kullanıcısı var mı kontrol edelim, yoksa ekleyelim
    if (!users.some((u: User) => u.email === "demo@example.com")) {
      users.push(demoUser);
      updated = true;
    }
    
    // Barış kullanıcısı var mı kontrol edelim, yoksa ekleyelim
    if (!users.some((u: User) => u.email === "bariscandemirel35@gmail.com")) {
      users.push(barisUser);
      updated = true;
    }
    
    // Mevcut kullanıcılarda şifre yoksa ekleyelim
    users = users.map((user: User) => {
      if (!user.password) {
        updated = true;
        // Şifre yoksa, e-posta adresi bilinen kullanıcılar için özel şifre ekleyelim
        if (user.email === "demo@example.com") {
          return { ...user, password: "demo123" };
        } else if (user.email === "bariscandemirel35@gmail.com") {
          return { ...user, password: "123456" };
        } else {
          // Diğer kullanıcılar için varsayılan şifre
          return { ...user, password: "default123" };
        }
      }
      return user;
    });
    
    // Değişiklik varsa veritabanını güncelleyelim
    if (updated) {
      localStorage.setItem("users_db", JSON.stringify(users));
    }
    
    return users;
  } catch (error) {
    console.error("Kullanıcı veritabanı okunamadı:", error);
    // Hata durumunda yeni bir veritabanı oluşturalım
    const initialUsers = [
      {
        id: 1,
        name: "Demo Kullanıcı",
        email: "demo@example.com",
        password: "demo123",
        avatar: "https://i.pravatar.cc/150?img=1"
      },
      {
        id: 2,
        name: "Barış Demirel",
        email: "bariscandemirel35@gmail.com",
        password: "123456",
        avatar: "https://i.pravatar.cc/150?img=2"
      }
    ];
    localStorage.setItem("users_db", JSON.stringify(initialUsers));
    return initialUsers;
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
    console.log("Giriş denemesi:", credentials.email); // Debug için
    
    // Özel kullanıcılar için hızlı giriş
    if (credentials.email === "demo@example.com" && credentials.password === "demo123") {
      const token = `token_1_${Date.now()}`;
      const user = {
        id: 1,
        name: "Demo Kullanıcı",
        email: "demo@example.com",
        avatar: "https://i.pravatar.cc/150?img=1"
      };
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      console.log("Demo kullanıcısı girişi başarılı"); // Debug için
      return { user, token };
    }
    
    if (credentials.email === "bariscandemirel35@gmail.com" && credentials.password === "123456") {
      const token = `token_2_${Date.now()}`;
      const user = {
        id: 2,
        name: "Barış Demirel",
        email: "bariscandemirel35@gmail.com",
        avatar: "https://i.pravatar.cc/150?img=2"
      };
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      console.log("Barış kullanıcısı girişi başarılı"); // Debug için
      return { user, token };
    }
    
    // Normal giriş işlemi
    const users = getUsersDatabase();
    console.log("Kullanıcı veritabanı:", users.length, "kullanıcı"); // Debug için
    
    const user = users.find((u: User) => u.email === credentials.email);
    if (!user) {
      console.log("Kullanıcı bulunamadı:", credentials.email); // Debug için
      throw new Error("Kullanıcı bulunamadı. Lütfen kayıt olun.");
    }
    
    // Şifre kontrolü - eğer kullanıcının şifresi yoksa kontrolü atla
    if (user.password && user.password !== credentials.password) {
      console.log("Şifre hatalı"); // Debug için
      throw new Error("Hatalı şifre. Lütfen tekrar deneyin.");
    }
    
    // Kullanıcı bulundu, oturum bilgilerini hazırla
    const mockToken = `token_${user.id}_${Date.now()}`;
    
    // Şifre içermeyen kullanıcı bilgilerini hazırla
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    };
    
    // Oturum bilgilerini local storage'a kaydet
    localStorage.setItem("token", mockToken);
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));
    
    console.log("Giriş başarılı:", user.email); // Debug için
    return { user: userWithoutPassword, token: mockToken };
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
    if (users.some((u: User) => u.email === credentials.email)) {
      throw new Error("Bu email adresi zaten kullanılıyor.");
    }
    
    // Yeni kullanıcı oluştur
    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map((u: User) => u.id)) + 1 : 1,
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    };
    
    // Kullanıcıyı veritabanına ekle ve kaydet
    users.push(newUser);
    saveUsersDatabase(users);
    
    // Oturum token'ı oluştur
    const mockToken = `token_${newUser.id}_${Date.now()}`;
    
    // Oturum bilgilerini local storage'a kaydet
    localStorage.setItem("token", mockToken);
    localStorage.setItem("user", JSON.stringify({
      id: newUser.id, 
      name: newUser.name, 
      email: newUser.email,
      avatar: newUser.avatar
    }));
    
    return { 
      user: {
        id: newUser.id, 
        name: newUser.name, 
        email: newUser.email,
        avatar: newUser.avatar
      }, 
      token: mockToken 
    };
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
      // Gelir Kategorileri
      { id: 1, name: "Maaş", type: "income", color: "#10b981", isBasic: true, translationKey: "categorySalary" },
      { id: 2, name: "Ek Gelir", type: "income", color: "#06b6d4", isBasic: true, translationKey: "categoryExtraIncome" },
      { id: 3, name: "Hediye", type: "income", color: "#8b5cf6", isBasic: true, translationKey: "categoryGiftIncome" },
      { id: 4, name: "Yatırım", type: "income", color: "#3b82f6", isBasic: true, translationKey: "categoryInvestment" },
      
      // Temel Gider Kategorileri
      { id: 5, name: "Market", type: "expense", color: "#ef4444", isBasic: true, translationKey: "categoryGrocery" },
      { id: 6, name: "Kira", type: "expense", color: "#f97316", isBasic: true, translationKey: "categoryRent" },
      { id: 7, name: "Faturalar", type: "expense", color: "#f59e0b", isBasic: true, translationKey: "categoryBills" },
      { id: 8, name: "Eğlence", type: "expense", color: "#84cc16", isBasic: true, translationKey: "categoryEntertainment" },
      { id: 9, name: "Sağlık", type: "expense", color: "#14b8a6", isBasic: true, translationKey: "categoryHealth" },
      { id: 10, name: "Ulaşım", type: "expense", color: "#6366f1", isBasic: true, translationKey: "categoryTransport" },
      
      // Ek Gider Kategorileri
      { id: 11, name: "Giyim", type: "expense", color: "#8b5cf6", isBasic: false, translationKey: "categoryClothing" },
      { id: 12, name: "Restoran", type: "expense", color: "#ec4899", isBasic: false, translationKey: "categoryRestaurant" },
      { id: 13, name: "Elektronik", type: "expense", color: "#06b6d4", isBasic: false, translationKey: "categoryElectronics" },
      { id: 14, name: "Eğitim", type: "expense", color: "#10b981", isBasic: false, translationKey: "categoryEducation" },
      { id: 15, name: "Spor", type: "expense", color: "#f43f5e", isBasic: false, translationKey: "categorySports" },
      { id: 16, name: "Bakım & Kozmetik", type: "expense", color: "#d946ef", isBasic: false, translationKey: "categoryBeauty" },
      { id: 17, name: "Ev Eşyaları", type: "expense", color: "#64748b", isBasic: false, translationKey: "categoryHomeItems" },
      { id: 18, name: "Hediye & Bağış", type: "expense", color: "#a855f7", isBasic: false, translationKey: "categoryGiftsDonations" },
      { id: 19, name: "Tatil & Seyahat", type: "expense", color: "#fb923c", isBasic: false, translationKey: "categoryTravel" },
      { id: 20, name: "Sigorta", type: "expense", color: "#4f46e5", isBasic: false, translationKey: "categoryInsurance" },
      { id: 21, name: "Diğer Giderler", type: "expense", color: "#94a3b8", isBasic: false, translationKey: "categoryOtherExpenses" },
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