import { Service } from 'typedi';
import { Repository, Between } from 'typeorm';
import { Transaction } from '../entities/Transaction';
import { Category } from '../entities/Category';
import { AppDataSource } from '../data-source';

@Service()
export class TransactionService {
  private transactionRepository: Repository<Transaction>;
  private categoryRepository: Repository<Category>;

  constructor() {
    this.transactionRepository = AppDataSource.getRepository(Transaction);
    this.categoryRepository = AppDataSource.getRepository(Category);
  }

  async findByUserId(userId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { userId },
      relations: ['category'],
      order: { date: 'DESC' }
    });
  }

  async findByUserIdAndDateRange(
    userId: number,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        userId,
        date: Between(startDate, endDate)
      },
      relations: ['category'],
      order: { date: 'DESC' }
    });
  }

  async findByUserIdAndType(
    userId: number,
    type: 'income' | 'expense'
  ): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { userId, type },
      relations: ['category'],
      order: { date: 'DESC' }
    });
  }

  async createTransaction(transactionData: Partial<Transaction>): Promise<Transaction> {
    // Kategori tipini kontrol et
    const category = await this.categoryRepository.findOne({ 
      where: { id: transactionData.categoryId } 
    });

    if (!category) {
      throw new Error('Kategori bulunamadı');
    }

    // Kullanıcı, kategorinin tipine uygun işlem eklemelidir
    if (transactionData.type !== category.type) {
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
    // İşlemi bul
    const transaction = await this.transactionRepository.findOne({ 
      where: { id, userId } 
    });

    if (!transaction) {
      throw new Error('İşlem bulunamadı');
    }

    // Kategori değiştiriliyorsa kontrolü yap
    if (transactionData.categoryId && transaction.categoryId !== transactionData.categoryId) {
      const category = await this.categoryRepository.findOne({ 
        where: { id: transactionData.categoryId } 
      });

      if (!category) {
        throw new Error('Kategori bulunamadı');
      }

      // İşlem tipi varsa onu, yoksa mevcut işlem tipini kullan
      const type = transactionData.type || transaction.type;

      // Kategori tipi ile işlem tipi uyumlu olmalı
      if (category.type !== type) {
        throw new Error(`Bu kategori ${type} türünde bir işlem için kullanılamaz`);
      }
    }

    // İşlemi güncelle
    await this.transactionRepository.update(id, transactionData);

    // Güncellenmiş işlemi al
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

    await this.transactionRepository.delete(id);
  }
} 