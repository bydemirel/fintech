import { JsonController, Get, Post, Put, Delete, Body, Param, QueryParam, Authorized, CurrentUser } from 'routing-controllers';
import { Service } from 'typedi';
import { TransactionService } from '../services/TransactionService';
import { User } from '../entities/User';
import { Transaction } from '../entities/Transaction';

@JsonController('/transactions')
@Service()
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  @Authorized()
  async getTransactions(
    @CurrentUser({ required: true }) user: User,
    @QueryParam('startDate') startDate?: string,
    @QueryParam('endDate') endDate?: string,
    @QueryParam('type') type?: 'income' | 'expense'
  ) {
    // Tarih aralığı filtreleme
    if (startDate && endDate) {
      return this.transactionService.findByUserIdAndDateRange(
        user.id,
        new Date(startDate),
        new Date(endDate)
      );
    }

    // Tür filtreleme
    if (type) {
      return this.transactionService.findByUserIdAndType(user.id, type);
    }

    // Tüm işlemleri getir
    return this.transactionService.findByUserId(user.id);
  }

  @Post()
  @Authorized()
  async createTransaction(
    @CurrentUser({ required: true }) user: User,
    @Body() transactionData: Partial<Transaction>
  ) {
    // Kullanıcı ID'sini ekle
    transactionData.userId = user.id;
    return this.transactionService.createTransaction(transactionData);
  }

  @Put('/:id')
  @Authorized()
  async updateTransaction(
    @CurrentUser({ required: true }) user: User,
    @Param('id') id: number,
    @Body() transactionData: Partial<Transaction>
  ) {
    return this.transactionService.updateTransaction(id, user.id, transactionData);
  }

  @Delete('/:id')
  @Authorized()
  async deleteTransaction(
    @CurrentUser({ required: true }) user: User,
    @Param('id') id: number
  ) {
    await this.transactionService.deleteTransaction(id, user.id);
    return { success: true };
  }
} 