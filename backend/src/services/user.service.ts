import { Repository } from 'typeorm';
import AppDataSource from '../utils/database';
import bcrypt from 'bcrypt';
import { User } from '../entities/user';

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async createUser(userData: {
    name: string;
    document: string;
    phone: string;
    email: string;
    password: string;
    role: 'admin' | 'adopter';
  }): Promise<User> {
    // Verificar se email já existe
    const existingUser = await this.userRepository.findOne({ 
      where: { email: userData.email } 
    });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Verificar se documento já existe
    const existingDocument = await this.userRepository.findOne({ 
      where: { document: userData.document } 
    });
    if (existingDocument) {
      throw new Error('Document already registered');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  async getAllUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [users, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    return {
      users: users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(id: string, updateData: Partial<User>) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }

    // Não permitir alterar role via update comum
    if (updateData.role) {
      delete updateData.role;
    }

    await this.userRepository.update(id, updateData);
    return await this.getUserById(id);
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.delete(id);
    return { message: 'User deleted successfully' };
  }
}