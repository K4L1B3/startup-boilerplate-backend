import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsBoolean,
} from 'class-validator';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Timestamp,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Chat')
export class Chat {
  @ApiProperty({
    example: 1,
    description: 'ID único do chat',
  })
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  @IsDefined()
  @IsNumber()
  id: number;

  @ApiProperty({
    example: 1,
    description: 'ID do usuário associado ao chat',
  })
  @Column()
  @IsNotEmpty()
  @IsDefined()
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: 'Luiz Belipestre',
    description: 'Nome do usuário que está participando do chat',
  })
  @Column()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name: string;

  @ApiProperty({
    example: 'Histórico de mensagens do chat...',
    description: 'Histórico de mensagens do chat',
  })
  @Column('text')
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  menssageHistory: string;

  @ApiProperty({
    example: '2024-06-20T12:34:56.789Z',
    description: 'Data e hora de início do chat',
  })
  @CreateDateColumn({ name: 'chatStart', type: 'timestamp' })
  @IsDate()
  @IsNotEmpty()
  @IsDefined()
  chatStart: Date;

  @ApiProperty({
    example: '2024-06-20T13:34:56.789Z',
    description: 'Data e hora de término do chat',
  })
  @UpdateDateColumn({ name: 'chatEnd', type: 'timestamp' })
  @IsDate()
  @IsNotEmpty()
  @IsDefined()
  chatEnd: Date;

  @ApiProperty({
    example: true,
    description: 'Status do chat (ativo/inativo)',
  })
  @Column({ default: true })
  @IsBoolean()
  @IsNotEmpty()
  @IsDefined()
  chatStatus: boolean;
}
