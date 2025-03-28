import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from './User';
import { Category } from './Category';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, user => user.transactions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: ['income', 'expense'],
  })
  type: 'income' | 'expense';

  @Column()
  categoryId: number;

  @ManyToOne(() => Category, category => category.transactions)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  description: string;

  @Column('date')
  date: Date;

  @CreateDateColumn()
  createdAt: Date;
} 