import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';

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
  @Column({
    name: 'chatStart',
    type: process.env.NODE_ENV === 'production' ? 'timestamp' : 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @IsDate()
  @IsNotEmpty()
  @IsDefined()
  chatStart: Date;

  @ApiProperty({
    example: '2024-06-20T13:34:56.789Z',
    description: 'Data e hora de término do chat',
  })
  @Column({
    name: 'chatEnd',
    type: process.env.NODE_ENV === 'production' ? 'timestamp' : 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @IsDate()
  @IsNotEmpty()
  @IsDefined()
  chatEnd: Date;

  @ApiProperty({
    example: 'AI: Esta é a última resposta.',
    description: 'Última resposta do chat',
  })
  @Column('text')
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  newAnswer: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
