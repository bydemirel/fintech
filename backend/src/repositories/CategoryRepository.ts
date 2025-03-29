import { Category } from '../entities/Category';
import { AppDataSource } from '../data-source';

// TypeORM 0.3.x'te özel repository sınıfları yerine doğrudan dataSource.getRepository kullanılmalıdır
// Bu dosya artık kullanılmamaktadır ve sadece geriye dönük uyumluluk için tutulmaktadır

// Eski repository metodlarını burada tutuyoruz
export const CategoryRepository = {
  findByUserId: async (userId: number): Promise<Category[]> => {
    return AppDataSource.getRepository(Category).find({
      where: { userId },
      order: { name: 'ASC' }
    });
  },

  findByUserIdAndType: async (
    userId: number,
    type: 'income' | 'expense'
  ): Promise<Category[]> => {
    return AppDataSource.getRepository(Category).find({
      where: { userId, type },
      order: { name: 'ASC' }
    });
  }
}; 