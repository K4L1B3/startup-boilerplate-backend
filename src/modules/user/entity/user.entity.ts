// src/entities/user.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @ApiProperty({
    example: '23',
    description: 'Identificador do usuário',
  })
  @IsNumber()
  @IsNotEmpty()
  @IsDefined()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Luiz Belispetre',
    description: 'Nome de usuário',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Column()
  name: string;

  @ApiProperty({
    example: 'luizbelispetre@gmail.com',
    description: 'Email do usuário',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  @Column()
  email: string;

  @ApiProperty({
    example: 'asd!@#$%FSAD1253',
    description: 'Senha do usuário',
  })
  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  password?: string;

  @ApiProperty({
    example: 'https://www.google.com/ProfilePicturePhoto',
    description: 'Url da foto de perfil do usuário',
  })
  @IsString()
  @IsOptional()
  @Column({
    nullable: true,
    default: 'assets/ProfilePictureDefault/profile.png',
  })
  profilePicture?: string;

  @ApiProperty({
    example: '104449820953176261238',
    description: 'Google ID usuado por usuários que se logan com o google',
  })
  @IsString()
  @IsOptional()
  @Column({
    default: null,
    nullable: true,
  })
  googleId?: string;

  @ApiProperty({
    example: 'google',
    description: 'Tipo de login do usuário se é direto ou pelo google',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Column({ default: 'direct' })
  authType: string;
}
