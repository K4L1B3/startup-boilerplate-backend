// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../../config/logs/logger.module';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), LoggerModule], // Registro do model TypeORM, se necessário
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Registro do Resolver e Serviços
})
export class UserModule {}
