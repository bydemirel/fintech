import { EntityRepository, Repository, Between } from 'typeorm';
import { Transaction } from '../entities/Transaction';

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
  async findByUserId(userId: number): Promise<Transaction[]> {
    return this.find({
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
    return this.find({
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
    return this.find({
      where: { userId, type },
      relations: ['category'],
      order: { date: 'DESC' }
    });
  }
} 