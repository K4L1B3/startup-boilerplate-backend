import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDefined } from 'class-validator';

export class ResetPassDto {
  @ApiProperty({
    example:
      'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imx1aXpiZWxpc3BldHJlQGdtYWlsLmNvbSIsInN1YiI6MSwiaWF0IjoxNzEyNjA5MDc1LCJleHAiOjE3MTI2MTI2NzV9.syv1b1VGbqx05F6rwZsJqDHxo9EVG7wp0hpQBoepT3w',
    description: 'Token do usuário',
  })
  @IsNotEmpty()
  @IsDefined()
  token: string;

  @ApiProperty({
    example: '13#@adsd@d2',
    description: 'nova senha do usuário',
  })
  @IsNotEmpty()
  @IsDefined()
  newPass: string;
}
