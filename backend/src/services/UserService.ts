import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Service()
export class UserService {
  constructor(
    @InjectRepository() private userRepository: UserRepository
  ) {}

  async register(userData: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Bu e-posta adresi zaten kullanımda');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword
    });

    return this.userRepository.save(newUser);
  }

  async login(email: string, password: string): Promise<{ token: string; user: Partial<User> }> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new Error('Geçersiz e-posta veya şifre');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Geçersiz e-posta veya şifre');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    
    return {
      token,
      user: userWithoutPassword
    };
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    
    if (!updatedUser) {
      throw new Error('Kullanıcı bulunamadı');
    }
    
    return updatedUser;
  }

  async updatePassword(id: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }
    
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Mevcut şifre hatalı');
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(id, { password: hashedPassword });
  }
} 