import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPasswordConstraint } from 'src/config/decorators/strong.password';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  Validate,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    example: 'Luiz Belispetre',
    description: 'Nome de usuário',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name: string;

  @ApiProperty({
    example: 'luizbelispetre@gmail.com',
    description: 'Email do usuário',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  email: string;

  @ApiProperty({
    example: '+5511999999999',
    description: 'Número de telefone do usuário',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'asd!@#$%FSAD1253',
    description: 'Senha do usuário',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Validate(IsStrongPasswordConstraint)
  password: string;
}
