import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity('CodePass')
export class CodePass {
  @IsNumber()
  @IsNotEmpty()
  @IsDefined()
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  @IsDefined()
  @Column()
  userId: number;

  //FK - User
  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @Column()
  code: string;

  @IsNotEmpty()
  @IsDefined()
  @Column({ type: 'timestamp' })
  expirationDate: Date;

  @IsNotEmpty()
  @IsDefined()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
