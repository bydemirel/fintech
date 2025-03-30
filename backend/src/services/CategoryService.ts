import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { Category } from '../entities/Category';
import { Transaction } from '../entities/Transaction';
import { AppDataSource } from '../data-source';

@Service()
export class CategoryService {
  private categoryRepository: Repository<Category>;
  private transactionRepository: Repository<Transaction>;

  constructor() {
    this.categoryRepository = AppDataSource.getRepository(Category);
    this.transactionRepository = AppDataSource.getRepository(Transaction);
  }

  async findByUserId(userId: number): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { userId },
      order: { name: 'ASC' }
    });
  }

  async findByUserIdAndType(userId: number, type: 'income' | 'expense'): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { userId, type },
      order: { name: 'ASC' }
    });
  }

  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    const newCategory = this.categoryRepository.create(categoryData);
    return this.categoryRepository.save(newCategory);
  }

  async updateCategory(id: number, userId: number, categoryData: Partial<Category>): Promise<Category> {
    const category = await this.categoryRepository.findOne({ 
      where: { id, userId } 
    });

    if (!category) {
      throw new Error('Kategori bulunamadı');
    }

    // Kategori tipini değiştiriyorsa, ilgili işlemlerin olup olmadığını kontrol et
    if (categoryData.type && categoryData.type !== category.type) {
      const transactions = await this.transactionRepository.find({
        where: { 
          categoryId: id,
          type: category.type 
        }
      });

      if (transactions.length > 0) {
        throw new Error(`Bu kategoriye ait ${transactions.length} adet işlem bulunduğu için kategori tipi değiştirilemez`);
      }
    }

    await this.categoryRepository.update(id, categoryData);
    
    const updatedCategory = await this.categoryRepository.findOne({ where: { id } });
    if (!updatedCategory) {
      throw new Error('Kategori güncellenemedi');
    }
    
    return updatedCategory;
  }

  async deleteCategory(id: number, userId: number): Promise<void> {
    const category = await this.categoryRepository.findOne({ 
      where: { id, userId } 
    });

    if (!category) {
      throw new Error('Kategori bulunamadı');
    }

    // İlgili işlemlerin olup olmadığını kontrol et
    const transactions = await this.transactionRepository.find({
      where: { categoryId: id }
    });

    if (transactions.length > 0) {
      throw new Error(`Bu kategoriye ait ${transactions.length} adet işlem bulunduğu için kategori silinemez`);
    }

    await this.categoryRepository.delete(id);
  }
} 