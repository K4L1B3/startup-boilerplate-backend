import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsStrongPasswordConstraint } from 'src/config/decorators/strong.password';

export class userDto {
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
    example: 'asd!@#$%FSAD1253',
    description: 'Senha do usuário',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Validate(IsStrongPasswordConstraint)
  password: string;

  @ApiProperty({
    example: 'https://www.google.com/ProfilePicturePhoto',
    description: 'Url da foto de perfil do usuário',
  })
  @IsString()
  @IsOptional()
  profilePicture?: string;

  @ApiProperty({ example: 'active', description: 'Subscription status' })
  @IsString()
  @IsOptional()
  subscriptionStatus?: string;
}
