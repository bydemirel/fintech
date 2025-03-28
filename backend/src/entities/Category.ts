import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';
import { Transaction } from './Transaction';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, user => user.categories)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: ['income', 'expense'],
  })
  type: 'income' | 'expense';

  @OneToMany(() => Transaction, transaction => transaction.category)
  transactions: Transaction[];
} 