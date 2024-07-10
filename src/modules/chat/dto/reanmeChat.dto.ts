import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RenameChatDto {
  @ApiProperty({
    example: 'Meu novo chat',
    description: 'O novo nome do chat',
  })
  @IsString()
  @IsNotEmpty()
  newName: string;
}
