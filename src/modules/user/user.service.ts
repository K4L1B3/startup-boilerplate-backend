// src/services/user.service.ts
import {
  forwardRef,
  Inject,
  Injectable,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { externalAuthDto } from '../auth/dto/external-auth.dto';
import { userDto } from './dto/user.dto';
import { User, UserRole } from './entity/user.entity';
import { EmailDto } from '../auth/dto/email.dto';
import { StripeService } from '../stripe/stripe.service';
import * as cron from 'node-cron';
import * as winston from 'winston';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private stripeService: StripeService,
    @Inject('winston') 
    private readonly logger: winston.Logger,
  ) {
    this.schedulePendingUserCleanup();
  }

  private schedulePendingUserCleanup() {
    cron.schedule('*/20 * * * *', async () => {
      try {
        const now = new Date();
        now.setMinutes(now.getMinutes() - 20);
  
        const pendingUsers = await this.userRepository.find({
          where: {
            subscriptionStatus: 'pending',
            createdAt: LessThan(now),
          },
        });
  
        for (const user of pendingUsers) {
          this.logger.warn(`Removing pending user: ${user.email}`);
          if (user.stripeCustomerId) {
            await this.stripeService.deleteCustomer(user.stripeCustomerId);
          }
          await this.userRepository.remove(user);
        }
      } catch (error) {
        this.logger.error('Error in scheduled job:', error);
      }
    });
  }
  

  async findAllUsers(): Promise<User[]> {
    this.logger.info('Retrieving all users');
    return await this.userRepository.find();
  }

  async getUserById(id: number) {
    this.logger.info(`Retrieving user by ID: ${id}`);
    return await this.userRepository.findOne({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    this.logger.info(`Retrieving user by email: ${email}`);
    return await this.userRepository.findOne({ where: { email } });
  }

  async getRequestUserByEmail(email: EmailDto): Promise<User> {
    this.logger.info(`Retrieving user by request email: ${email.email}`);
    return await this.userRepository.findOne({ where: { email: email.email } });
  }

  async createUser(userData: userDto): Promise<User> {
    this.logger.info(`Creating user with email: ${userData.email}`);
    const existingUser = await this.getUserByEmail(userData.email);
    if (existingUser) {
      this.logger.error(`User with email ${userData.email} already exists`);
      throw new Error('User with this email already exists');
    }
    const newUser = this.userRepository.create({
      ...userData,
      role: UserRole.User,
    });
    return await this.userRepository.save(newUser);
  }

  async createGoogleLogin(userData: externalAuthDto): Promise<User> {
    this.logger.info(
      `Creating Google login for user with email: ${userData.email}`,
    );
    const existingUser = await this.getUserByEmail(userData.email);
    if (existingUser) {
      this.logger.error(`User with email ${userData.email} already exists`);
      throw new Error('User with this email already exists');
    }

    const newUser = this.userRepository.create(userData);
    return await this.userRepository.save(newUser);
  }

  async patchUser(userId: number, userData: Partial<userDto>): Promise<User> {
    this.logger.info(`Patching user with ID: ${userId}`);
    await this.userRepository.update(userId, userData);
    return this.userRepository.findOneBy({ id: userId });
  }

  async updateUser(userId: number, userData: userDto): Promise<User> {
    this.logger.info(`Updating user with ID: ${userId}`);
    if (userData.password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      userData.password = hashedPassword;
    }
    await this.userRepository.update(userId, userData);
    return this.userRepository.findOneBy({ id: userId });
  }

  async updateUserSelf(userId: number, userData: userDto): Promise<User> {
    this.logger.info(`Self-updating user with ID: ${userId}`);
    const user = await this.getUserById(userId);
    if (!user) {
      this.logger.error(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    if (userData.password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      userData.password = hashedPassword;
    }

    await this.userRepository.update(userId, userData);
    return this.userRepository.findOneBy({ id: userId });
  }

  async deleteUser(userId: number) {
    this.logger.info(`Deleting user with ID: ${userId}`);
    return await this.userRepository.delete(userId);
  }

  async deleteUserSelf(userId: number) {
    this.logger.info(`Self-deleting user with ID: ${userId}`);
    const user = await this.getUserById(userId);
    if (!user) {
      this.logger.error(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }
    await this.userRepository.remove(user);
  }
}
