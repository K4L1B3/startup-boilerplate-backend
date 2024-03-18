// src/services/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { externalAuthDto } from '../auth/dto/external-auth.dto';
import { userDto } from './dto/user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(userData: userDto): Promise<User> {
    const newUser = this.userRepository.create(userData);
    return await this.userRepository.save(newUser);
  }

  async createGoogleLogin(userData: externalAuthDto): Promise<User> {
    const newUser = this.userRepository.create(userData);
    return await this.userRepository.save(newUser);
  }

  async update(userId: number, userData: userDto): Promise<User> {
    if (userData.password) {
      //Se a senha foi fornecida criptografe-a antes de salvar
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      userData.password = hashedPassword;
    }

    // Primeiro, atualiza o usuário com os novos dados
    await this.userRepository.update(userId, userData);
    // Depois, retorna o usuário atualizado
    return this.userRepository.findOneBy({ id: userId });
  }

  delete(userId: number) {
    return this.userRepository.delete(userId);
  }
}
