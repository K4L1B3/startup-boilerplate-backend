import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDefined, IsDate } from 'class-validator';
export class CreateChatDto {
  @ApiProperty({
    example: 'Qual é a constante de Kepler?',
    description: 'A mensagem inicial do chat',
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsString()
  @IsNotEmpty()
  newAnswer: string;

  @IsDate()
  @IsNotEmpty()
  @IsDefined()
  chatStart: Date;

  @IsDate()
  @IsNotEmpty()
  @IsDefined()
  chatEnd: Date;
}
