// src/services/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { externalAuthDto } from '../auth/dto/external-auth.dto';
import { userDto } from './dto/user.dto';
import { User } from './entity/user.entity';
import { EmailDto } from '../auth/dto/email.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  getUserById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  getRequestUserByEmail(email: EmailDto): Promise<User> {
    return this.userRepository.findOne({ where: { email: email.email } });
  }

  async createUser(userData: userDto): Promise<User> {
    const existingUser = await this.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    const newUser = this.userRepository.create(userData);
    return await this.userRepository.save(newUser);
  }

  async createGoogleLogin(userData: externalAuthDto): Promise<User> {
    const existingUser = await this.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser = this.userRepository.create(userData);
    return await this.userRepository.save(newUser);
  }

  async patchUser(userId: number, userData: Partial<userDto>): Promise<User> {
    await this.userRepository.update(userId, userData);
    return this.userRepository.findOneBy({ id: userId });
  }

  async updateUser(userId: number, userData: userDto): Promise<User> {
    if (userData.password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      userData.password = hashedPassword;
    }
    await this.userRepository.update(userId, userData);
    return this.userRepository.findOneBy({ id: userId });
  }

  deleteUser(userId: number) {
    return this.userRepository.delete(userId);
  }
}
