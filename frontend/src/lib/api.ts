// API isteği için temel URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Transaction {
  id?: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: number;
  date: Date | string;
}

export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  color?: string;
}

// Tüm işlemleri getir
export async function getTransactions(): Promise<Transaction[]> {
  const response = await fetch(`${API_URL}/transactions`);
  
  if (!response.ok) {
    throw new Error('İşlemler getirilirken bir hata oluştu');
  }
  
  return response.json();
}

// Belirli filtrelere göre işlemleri getir
export async function getFilteredTransactions(filters: {
  startDate?: string;
  endDate?: string;
  categoryId?: number;
  type?: 'income' | 'expense';
}): Promise<Transaction[]> {
  const params = new URLSearchParams();
  
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.categoryId) params.append('categoryId', filters.categoryId.toString());
  if (filters.type) params.append('type', filters.type);
  
  const response = await fetch(`${API_URL}/transactions?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('İşlemler filtrelenirken bir hata oluştu');
  }
  
  return response.json();
}

// Yeni işlem ekle
export async function addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
  const response = await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transaction),
  });
  
  if (!response.ok) {
    throw new Error('İşlem eklenirken bir hata oluştu');
  }
  
  return response.json();
}

// İşlem sil
export async function deleteTransaction(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/transactions/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('İşlem silinirken bir hata oluştu');
  }
}

// İşlem güncelle
export async function updateTransaction(id: number, transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
  const response = await fetch(`${API_URL}/transactions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transaction),
  });
  
  if (!response.ok) {
    throw new Error('İşlem güncellenirken bir hata oluştu');
  }
  
  return response.json();
}

// Tüm kategorileri getir
export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`);
  
  if (!response.ok) {
    throw new Error('Kategoriler getirilirken bir hata oluştu');
  }
  
  return response.json();
}

// Kategori tipine göre kategorileri getir
export async function getCategoriesByType(type: 'income' | 'expense'): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories?type=${type}`);
  
  if (!response.ok) {
    throw new Error('Kategoriler getirilirken bir hata oluştu');
  }
  
  return response.json();
}

// Bakiye bilgilerini getir
export async function getBalance(): Promise<{ balance: number; income: number; expense: number }> {
  const response = await fetch(`${API_URL}/balance`);
  
  if (!response.ok) {
    throw new Error('Bakiye bilgileri getirilirken bir hata oluştu');
  }
  
  return response.json();
}

// Aylık gelir/gider verilerini getir
export async function getMonthlyData(): Promise<{ month: string; income: number; expense: number }[]> {
  const response = await fetch(`${API_URL}/stats/monthly`);
  
  if (!response.ok) {
    throw new Error('Aylık veriler getirilirken bir hata oluştu');
  }
  
  return response.json();
}

// Kategori bazlı harcama dağılımını getir
export async function getCategoryExpenses(): Promise<{ id: number; name: string; amount: number; color: string }[]> {
  const response = await fetch(`${API_URL}/stats/categories`);
  
  if (!response.ok) {
    throw new Error('Kategori bazlı veriler getirilirken bir hata oluştu');
  }
  
  return response.json();
} 