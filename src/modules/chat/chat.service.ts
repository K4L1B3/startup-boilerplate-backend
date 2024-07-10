import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entity/chat.entity';
import { CreateChatDto } from './dto/createChat.dto';
import OpenAI from 'openai';

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
    const { prompt, chatStatus } = createChatDto;

    const response = await this.ChatGenerateResponse(prompt);

    const chat = this.chatRepository.create({
      userId,
      name: this.generateChatName(prompt),
      menssageHistory: `User: ${prompt}\nAI: ${response}`,
      chatStatus: chatStatus ?? true,
    });

    return await this.chatRepository.save(chat);
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

    const response = await this.ChatGenerateResponse(newPrompt);

    // Adicionar a nova mensagem ao histórico de mensagens
    chat.menssageHistory += `\nUser: ${newPrompt}\nAI: ${response}`;

    return this.chatRepository.save(chat);
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
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 150,
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating response from OpenAI: ', error);
      throw new Error('Failed to generate response from OpenAI');
    }
  }

  // async ChatGenerateResponse(prompt: string): Promise<string> {
  //   try {
  //     const response = await this.openai.completions.create({
  //       model: 'gpt-4',
  //       prompt: prompt,
  //       max_tokens: 150,
  //     });
  //     return response.choices[0].text.trim();
  //   } catch (error) {
  //     console.error('Error generating response from OpenAI: ', error);
  //     throw new Error('Failed to generate response from OpenAI');
  //   }
  // }

  private generateChatName(prompt: string): string {
    const maxLength = 25;
    const cleanPrompt = prompt.replace(/[^\w\s]/g, '');
    return cleanPrompt.substring(0, maxLength).trim();
  }
}
