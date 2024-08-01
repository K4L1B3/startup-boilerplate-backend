import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsDate,
} from 'class-validator';

export enum UserRole {
  User = 'User',
  Admin = 'Admin',
}

export enum UserPlan {
  Basic = 'Yellow',
  Premium = 'HeartGold',
  Year = 'Emerald',
}

@Entity('Users')
export class User {
  @ApiProperty({
    example: '1',
    description: 'Identificador único do usuário',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do usuário',
  })
  @IsString()
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiProperty({
    example: 'joao.silva@example.com',
    description: 'Endereço de email do usuário',
  })
  @IsEmail()
  @IsNotEmpty()
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: '+5511999999999',
    description: 'Número de telefone do usuário',
  })
  @IsString()
  @IsNotEmpty()
  @Column()
  phone: string;

  @ApiProperty({
    example: 'senhaSecreta123',
    description: 'Senha do usuário',
  })
  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  password?: string;

  @ApiProperty({
    example: 'São Paulo, SP, Brasil',
    description: 'Localização do usuário',
  })
  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  location?: string;

  @ApiProperty({
    example: UserRole.User,
    description: 'Papel do usuário no sistema',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @Column({
    type: process.env.NODE_ENV === 'production' ? 'enum' : 'varchar',
    enum: process.env.NODE_ENV === 'production' ? UserRole : undefined,
    default: UserRole.User,
  })
  role: UserRole;

  @ApiProperty({
    example: UserPlan.Basic,
    description: 'Plano do usuário',
    enum: UserPlan,
  })
  @IsEnum(UserPlan)
  @Column({
    type: process.env.NODE_ENV === 'production' ? 'enum' : 'varchar',
    enum: process.env.NODE_ENV === 'production' ? UserPlan : undefined,
    default: UserPlan.Basic,
  })
  plan: UserPlan;

  @ApiProperty({
    example: 'assets/ProfilePictureDefault/profile.png',
    description: 'URL da foto de perfil do usuário',
  })
  @IsString()
  @IsOptional()
  @Column({
    default: 'assets/ProfilePictureDefault/profile.png',
    nullable: true,
  })
  profilePicture?: string;

  @ApiProperty({
    example: '104449820953176261238',
    description: 'Google ID usado por usuários que se logam com o Google',
  })
  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  googleId?: string;

  @ApiProperty({
    example: 'direct',
    description: 'Tipo de autenticação do usuário (Direct ou Google)',
  })
  @IsString()
  @IsNotEmpty()
  @Column({ default: 'direct' })
  authType: string;

  @ApiProperty({
    example: 'cus_J1a2b3c4d5e6f7g8h9',
    description: 'Stripe Customer ID',
  })
  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  stripeCustomerId?: string;

  @ApiProperty({ example: 'active', description: 'Subscription status' })
  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  subscriptionStatus?: string;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Data de criação do usuário',
  })
  @IsDate()
  @CreateDateColumn()
  createdAt: Date;
}
