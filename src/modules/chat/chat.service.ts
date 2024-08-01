import {
  Inject,
  Injectable,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entity/chat.entity';
import { CreateChatDto } from './dto/createChat.dto';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async createChat(
    createChatDto: CreateChatDto,
    userId: number,
  ): Promise<Chat> {
    const { prompt } = createChatDto;

    try {
      this.logger.log(`Creating chat for user ID: ${userId}`);
      const response = await this.ChatGenerateResponse(prompt);

      const chat = this.chatRepository.create({
        userId,
        name: this.generateChatName(prompt),
        menssageHistory: `User: ${prompt} AI: ${response}`,
        newAnswer: `AI: ${response}`,
        chatStart: new Date(),
        chatEnd: new Date(),
      });

      const savedChat = await this.chatRepository.save(chat);
      this.logger.log(`Chat created with ID: ${savedChat.id}`);
      return savedChat;
    } catch (error) {
      this.logger.error(
        `Error saving chat for user ID ${userId}: ${error.message}`,
      );
      throw new NotFoundException('Failed to create a chat');
    }
  }

  async getChat(id: number): Promise<Chat> {
    this.logger.log(`Fetching chat with ID: ${id}`);
    return this.chatRepository.findOne({ where: { id } });
  }

  async getAllChats(): Promise<Chat[]> {
    this.logger.log('Fetching all chats');
    return this.chatRepository.find();
  }

  async updateChat(chatId: number, newPrompt: string): Promise<Chat> {
    this.logger.log(`Updating chat with ID: ${chatId}`);
    const chat = await this.getChat(chatId);
    if (!chat) {
      this.logger.warn(`Chat with ID ${chatId} not found`);
      throw new Error('Chat not found');
    }

    chat.menssageHistory += `\nUser: ${newPrompt}`;

    const response = await this.ChatGenerateResponse(chat.menssageHistory);

    chat.menssageHistory += `\nAI: ${response}`;

    chat.newAnswer = `\nAI: ${response}`;

    const updatedChat = await this.chatRepository.save(chat);
    this.logger.log(`Chat with ID ${chatId} updated successfully`);
    return updatedChat;
  }

  async deleteChat(id: number): Promise<void> {
    this.logger.log(`Deleting chat with ID: ${id}`);
    const chat = await this.getChat(id);
    if (!chat) {
      this.logger.warn(`Chat with ID ${id} not found`);
      throw new NotFoundException('Chat not found');
    }
    await this.chatRepository.delete(id);
    this.logger.log(`Chat with ID ${id} deleted successfully`);
  }

  async renameChat(id: number, newName: string): Promise<Chat> {
    this.logger.log(`Renaming chat with ID: ${id} to ${newName}`);
    const chat = await this.getChat(id);
    if (!chat) {
      this.logger.warn(`Chat with ID ${id} not found`);
      throw new NotFoundException('Chat not found');
    }
    chat.name = newName;
    const renamedChat = await this.chatRepository.save(chat);
    this.logger.log(`Chat with ID ${id} renamed successfully`);
    return renamedChat;
  }

  async ChatGenerateResponse(prompt: string): Promise<string> {
    try {
      this.logger.log(`Generating response for prompt: ${prompt}`);
      const messages = prompt.split('\n').map((line) => {
        if (line.startsWith('User:')) {
          return { role: 'user', content: line.replace('User: ', '') };
        } else if (line.startsWith('AI:')) {
          return { role: 'assistant', content: line.replace('AI: ', '') };
        } else {
          return { role: 'system', content: line };
        }
      });

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages as ChatCompletionMessageParam[],
        max_tokens: 150,
      });

      this.logger.log('Response generated successfully');
      return response.choices[0].message.content.trim();
    } catch (error) {
      this.logger.error(
        'Error generating response from OpenAI: ',
        error.message,
      );
      throw new Error('Failed to generate response from OpenAI');
    }
  }

  private generateChatName(prompt: string): string {
    const maxLength = 25;
    const cleanPrompt = prompt.replace(/[^\w\s]/g, '');
    let chatName = cleanPrompt.substring(0, maxLength).trim();
    if (cleanPrompt.length > maxLength) {
      chatName += '...';
    }
    this.logger.log(`Generated chat name: ${chatName}`);
    return chatName;
  }
}
