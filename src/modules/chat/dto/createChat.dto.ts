import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    example: 'Qual é a constante de Kepler?',
    description: 'A mensagem inicial do chat',
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiProperty({
    example: true,
    description: 'Status inicial do chat (ativo/inativo)',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  chatStatus?: boolean;
}
