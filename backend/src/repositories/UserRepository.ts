import { User } from '../entities/User';
import { AppDataSource } from '../data-source';

// TypeORM 0.3.x'te özel repository sınıfları yerine doğrudan dataSource.getRepository kullanılmalıdır
// Bu dosya artık kullanılmamaktadır ve sadece geriye dönük uyumluluk için tutulmaktadır

// Eski repository metodlarını burada tutuyoruz
export const UserRepository = {
  findByEmail: async (email: string): Promise<User | null> => {
    return AppDataSource.getRepository(User).findOne({ where: { email } });
  }
}; 