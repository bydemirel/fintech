import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Transaction } from './Transaction';
import { Category } from './Category';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'TRY' })
  currency: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Category, category => category.user)
  categories: Category[];
} 