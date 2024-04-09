import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsDefined } from 'class-validator';

export class EmailDto {
  @ApiProperty({
    example: 'luizbelispetre@gmail.com',
    description: 'Email do usuário',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  email: string;
}
