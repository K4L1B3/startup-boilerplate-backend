import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  LoggerService,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiOperation,
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/createChat.dto';
import { UpdateChatDto } from './dto/updateChat.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../config/security/guards/jwt-auth.guard';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Chat } from './entity/chat.entity';
import { RenameChatDto } from './dto/reanmeChat.dto';
import { RequestWithUser } from '../../config/common/interfaces/request-with-user.interface';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@ApiBearerAuth('access-token')
@ApiTags('Chat')
@Controller('Chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('api/chat')
  @ApiBody({ type: CreateChatDto })
  async createChat(
    @Body() createChatDto: CreateChatDto,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    try {
      const userId = req.user.userId;
      this.logger.log(`Creating chat for user ID: ${userId}`);
      const chat = await this.chatService.createChat(createChatDto, userId);
      return res.status(201).json({ chat });
    } catch (error) {
      this.logger.error(`Error creating chat: ${error.message}`);
      return res.status(500).json({ message: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('api/chat/:id')
  @ApiParam({ name: 'id', description: 'ID do chat' })
  @ApiBody({ type: UpdateChatDto })
  async updateChat(
    @Param('id') chatId: number,
    @Body() updateChatDto: UpdateChatDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      this.logger.log(`Updating chat with ID: ${chatId}`);
      const chat = await this.chatService.updateChat(
        chatId,
        updateChatDto.prompt,
      );
      return res.status(200).json({ chat });
    } catch (error) {
      this.logger.error(
        `Error updating chat with ID ${chatId}: ${error.message}`,
      );
      return res.status(500).json({ message: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/chats')
  @ApiOperation({ summary: 'Get all chats' })
  async getAllChats(@Req() req: Request, @Res() res: Response) {
    try {
      this.logger.log('Retrieving all chats');
      const chats = await this.chatService.getAllChats();
      return res.status(200).json({ chats });
    } catch (error) {
      this.logger.error(`Error retrieving all chats: ${error.message}`);
      return res.status(500).json({ message: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/chat/:id')
  @ApiParam({ name: 'id', description: 'ID do chat' })
  @ApiOperation({ summary: 'Get chat by ID' })
  async getChat(
    @Param('id') chatId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      this.logger.log(`Retrieving chat with ID: ${chatId}`);
      const chat = await this.chatService.getChat(chatId);
      if (!chat) {
        this.logger.warn(`Chat with ID ${chatId} not found`);
        return res.status(404).json({ message: 'Chat not found' });
      }
      return res.status(200).json({ chat });
    } catch (error) {
      this.logger.error(
        `Error retrieving chat with ID ${chatId}: ${error.message}`,
      );
      return res.status(500).json({ message: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('api/chat/:id')
  @ApiParam({ name: 'id', description: 'ID do chat' })
  @ApiOperation({ summary: 'Delete chat by ID' })
  async deleteChat(
    @Param('id') chatId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      this.logger.log(`Deleting chat with ID: ${chatId}`);
      await this.chatService.deleteChat(chatId);
      return res.status(200).json({ message: 'Chat deleted successfully' });
    } catch (error) {
      this.logger.error(
        `Error deleting chat with ID ${chatId}: ${error.message}`,
      );
      return res.status(500).json({ message: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('api/chat/:id/rename')
  @ApiParam({ name: 'id', description: 'ID do chat' })
  @ApiBody({ type: RenameChatDto })
  @ApiOperation({ summary: 'Rename chat by ID' })
  async renameChat(
    @Param('id') chatId: number,
    @Body() renameChatDto: RenameChatDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      this.logger.log(
        `Renaming chat with ID: ${chatId} to ${renameChatDto.newName}`,
      );
      const chat = await this.chatService.renameChat(
        chatId,
        renameChatDto.newName,
      );
      return res.status(200).json({ chat });
    } catch (error) {
      this.logger.error(
        `Error renaming chat with ID ${chatId}: ${error.message}`,
      );
      return res.status(500).json({ message: error.message });
    }
  }
}
