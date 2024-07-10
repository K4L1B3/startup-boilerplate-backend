import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateChatDto {
  @ApiProperty({
    example: 'O que é a constante de Planck?',
    description: 'A nova mensagem para adicionar ao chat',
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;
}
