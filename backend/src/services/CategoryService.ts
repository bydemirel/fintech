import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { Category } from '../entities/Category';

@Service()
export class CategoryService {
  constructor(
    @InjectRepository() private categoryRepository: CategoryRepository,
    @InjectRepository() private transactionRepository: TransactionRepository
  ) {}

  async findByUserId(userId: number): Promise<Category[]> {
    return this.categoryRepository.findByUserId(userId);
  }

  async findByUserIdAndType(userId: number, type: 'income' | 'expense'): Promise<Category[]> {
    return this.categoryRepository.findByUserIdAndType(userId, type);
  }

  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    const category = this.categoryRepository.create(categoryData);
    return this.categoryRepository.save(category);
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

    // Bu kategoriye ait işlemler var mı kontrol et
    const transactions = await this.transactionRepository.find({
      where: { categoryId: id }
    });

    if (transactions.length > 0) {
      throw new Error(`Bu kategoriye ait ${transactions.length} adet işlem bulunduğu için kategori silinemez`);
    }

    await this.categoryRepository.remove(category);
  }
} 