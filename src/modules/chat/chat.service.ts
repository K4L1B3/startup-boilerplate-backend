import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entity/chat.entity';
import { CreateChatDto } from './dto/createChat.dto';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
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
      const response = await this.ChatGenerateResponse(prompt);

      const chat = this.chatRepository.create({
        userId,
        name: this.generateChatName(prompt),
        menssageHistory: `User: ${prompt} AI: ${response}`,
        newAnswer: `AI: ${response}`,
        chatStart: new Date(),
        chatEnd: new Date(),
      });

      return await this.chatRepository.save(chat);
    } catch (error) {
      console.error('Error saving chat: ', error);
      throw new NotFoundException('Failed to create a chat');
    }
  }

  async getChat(id: number): Promise<Chat> {
    return this.chatRepository.findOne({ where: { id } });
  }

  async getAllChats(): Promise<Chat[]> {
    return this.chatRepository.find();
  }

  async updateChat(chatId: number, newPrompt: string): Promise<Chat> {
    const chat = await this.getChat(chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }

    chat.menssageHistory += `\nUser: ${newPrompt}`;

    const response = await this.ChatGenerateResponse(chat.menssageHistory);

    chat.menssageHistory += `\nAI: ${response}`;

    chat.newAnswer = `\nAI: ${response}`;

    return await this.chatRepository.save(chat);
  }

  async deleteChat(id: number): Promise<void> {
    const chat = await this.getChat(id);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    await this.chatRepository.delete(id);
  }

  async renameChat(id: number, newName: string): Promise<Chat> {
    const chat = await this.getChat(id);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    chat.name = newName;
    return this.chatRepository.save(chat);
  }

  async ChatGenerateResponse(prompt: string): Promise<string> {
    try {
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

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating response from OpenAI: ', error);
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
    return chatName;
  }
}
