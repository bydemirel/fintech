import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { Transaction } from '../entities/Transaction';

@Service()
export class TransactionService {
  constructor(
    @InjectRepository() private transactionRepository: TransactionRepository,
    @InjectRepository() private categoryRepository: CategoryRepository
  ) {}

  async findByUserId(userId: number): Promise<Transaction[]> {
    return this.transactionRepository.findByUserId(userId);
  }

  async findByUserIdAndDateRange(
    userId: number,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    return this.transactionRepository.findByUserIdAndDateRange(userId, startDate, endDate);
  }

  async findByUserIdAndType(
    userId: number,
    type: 'income' | 'expense'
  ): Promise<Transaction[]> {
    return this.transactionRepository.findByUserIdAndType(userId, type);
  }

  async createTransaction(transactionData: Partial<Transaction>): Promise<Transaction> {
    // Kategori kontrolü
    const category = await this.categoryRepository.findOne({ 
      where: { 
        id: transactionData.categoryId,
        userId: transactionData.userId 
      } 
    });

    if (!category) {
      throw new Error('Kategori bulunamadı');
    }

    // İşlem türü ve kategori türü uyumlu olmalı
    if (category.type !== transactionData.type) {
      throw new Error(`Bu kategori ${transactionData.type} türünde bir işlem için kullanılamaz`);
    }

    const transaction = this.transactionRepository.create(transactionData);
    return this.transactionRepository.save(transaction);
  }

  async updateTransaction(
    id: number,
    userId: number,
    transactionData: Partial<Transaction>
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({ 
      where: { 
        id, 
        userId 
      } 
    });

    if (!transaction) {
      throw new Error('İşlem bulunamadı');
    }

    // Kategori değiştiyse kontrol et
    if (transactionData.categoryId && transactionData.categoryId !== transaction.categoryId) {
      const category = await this.categoryRepository.findOne({ 
        where: { 
          id: transactionData.categoryId,
          userId
        } 
      });

      if (!category) {
        throw new Error('Kategori bulunamadı');
      }

      // Tür değişmediyse, kategori türü işlem türüyle uyumlu olmalı
      const type = transactionData.type || transaction.type;
      if (category.type !== type) {
        throw new Error(`Bu kategori ${type} türünde bir işlem için kullanılamaz`);
      }
    }

    await this.transactionRepository.update(id, transactionData);
    
    const updatedTransaction = await this.transactionRepository.findOne({ 
      where: { id },
      relations: ['category']
    });
    
    if (!updatedTransaction) {
      throw new Error('İşlem güncellenemedi');
    }
    
    return updatedTransaction;
  }

  async deleteTransaction(id: number, userId: number): Promise<void> {
    const transaction = await this.transactionRepository.findOne({ 
      where: { id, userId } 
    });

    if (!transaction) {
      throw new Error('İşlem bulunamadı');
    }

    await this.transactionRepository.remove(transaction);
  }
} 