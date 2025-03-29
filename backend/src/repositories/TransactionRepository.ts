import { Between } from 'typeorm';
import { Transaction } from '../entities/Transaction';
import { AppDataSource } from '../data-source';

// TypeORM 0.3.x'te özel repository sınıfları yerine doğrudan dataSource.getRepository kullanılmalıdır
// Bu dosya artık kullanılmamaktadır ve sadece geriye dönük uyumluluk için tutulmaktadır

// Eski repository metodlarını burada tutuyoruz
export const TransactionRepository = {
  findByUserId: async (userId: number): Promise<Transaction[]> => {
    return AppDataSource.getRepository(Transaction).find({
      where: { userId },
      relations: ['category'],
      order: { date: 'DESC' }
    });
  },

  findByUserIdAndDateRange: async (
    userId: number,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> => {
    return AppDataSource.getRepository(Transaction).find({
      where: {
        userId,
        date: Between(startDate, endDate)
      },
      relations: ['category'],
      order: { date: 'DESC' }
    });
  },

  findByUserIdAndType: async (
    userId: number,
    type: 'income' | 'expense'
  ): Promise<Transaction[]> => {
    return AppDataSource.getRepository(Transaction).find({
      where: { userId, type },
      relations: ['category'],
      order: { date: 'DESC' }
    });
  }
}; 