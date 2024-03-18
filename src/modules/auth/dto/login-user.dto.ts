import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  Validate,
} from 'class-validator';
import { IsStrongPasswordConstraint } from 'src/config/decorators/strong.password';

export class LoginUserDto {
  @ApiProperty({
    example: 'luizbelispetre@gmail.com',
    description: 'Email do usuário',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  username: string;

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
