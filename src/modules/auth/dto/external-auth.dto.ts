import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsDefined,
} from 'class-validator';

export class externalAuthDto {
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
  @IsNotEmpty()
  @IsDefined()
  email: string;

  @ApiProperty({
    example: 'https://www.google.com/ProfilePicturePhoto',
    description: 'Url da foto de perfil do usuário',
  })
  @IsString()
  @IsOptional()
  profilePicture?: string;

  @ApiProperty({
    example: 'google',
    description: 'Tipo de login do usuário se é direto ou pelo google',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  authType: string; // 'google' or 'direct'
}
