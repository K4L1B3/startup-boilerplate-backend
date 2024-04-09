import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDefined } from 'class-validator';

export class verificationCodeDto {
  @ApiProperty({
    example: '1383',
    description:
      'Código de verificação que foi enviado para o email do usuário',
  })
  @IsNotEmpty()
  @IsDefined()
  code: string;
}
