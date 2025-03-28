import { EntityRepository, Repository } from 'typeorm';
import { Category } from '../entities/Category';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async findByUserId(userId: number): Promise<Category[]> {
    return this.find({
      where: { userId },
      order: { name: 'ASC' }
    });
  }

  async findByUserIdAndType(
    userId: number,
    type: 'income' | 'expense'
  ): Promise<Category[]> {
    return this.find({
      where: { userId, type },
      order: { name: 'ASC' }
    });
  }
} 