import { Injectable } from '@nestjs/common';
import { CodePass } from './entity/codePass.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { verificationCodeDto } from './dto/VerificationCode.dto';

@Injectable()
export class CodePassService {
  constructor(
    @InjectRepository(CodePass)
    private codePassRepository: Repository<CodePass>,
  ) {}

  async saveCode(userId: number, code: string) {
    const codePassExists = await this.codePassRepository.findOne({
      where: { userId },
    });

    if (!codePassExists) {
      const codePass = this.codePassRepository.create({ userId, code });
      codePass.expirationDate = new Date(
        new Date().getTime() + 5 * (60 * 1000),
      );
      codePass.createdAt = new Date();
      return this.codePassRepository.save(codePass);
    } else {
      codePassExists.code = code;
    }

    codePassExists.expirationDate = new Date(
      new Date().getTime() + 5 * (60 * 1000),
    );
    codePassExists.createdAt = new Date();

    return await this.codePassRepository.save(codePassExists);
  }

  async checkUserByCode(code: verificationCodeDto) {
    try {
      console.log('code checkUserByCode param - ', code);
      const checkUser = await this.codePassRepository.findOne({
        where: { code: code.code },
      });
      console.log(
        'checkUser await codePassRepository findOne RESULT - ',
        checkUser,
      );

      if (!checkUser) {
        console.log('Usuário não encontrado para o código: ', code.code);
        return {
          success: false,
          message: 'Usuário não encontrado.',
        };
      }

      console.log('Usuário encontrado: ', checkUser);
      return {
        success: true,
        message: 'Usuário encontrado com sucesso!',
        userId: checkUser.userId,
      };
    } catch (error) {
      console.error('Erro ao verificar o código', error);
      return {
        success: false,
        message: 'Erro ao verificar o código. Tente novamente.',
      };
    }
  }

  async validateVerificationCode(userId: number, code: verificationCodeDto) {
    try {
      const inputCheckCode = code.code;
      const userCheckCode = await this.codePassRepository.findOne({
        where: { userId, code: inputCheckCode },
      });

      if (!userCheckCode || inputCheckCode !== userCheckCode.code) {
        console.log('código invalido');
        return {
          success: false,
          message: 'Código inválido. Tente novamente.',
        };
      } else {
        if (new Date() > userCheckCode.expirationDate) {
          await this.codePassRepository.delete(userCheckCode.id);

          return {
            success: false,
            message: 'Código expirado. Tente novamente.',
          };
        } else {
          await this.codePassRepository.delete(userCheckCode.id);

          return {
            success: true,
            message: 'Código verificado com sucesso.',
          };
        }
      }
    } catch (error) {
      console.error('Erro ao verificar o código', error);
      return {
        success: false,
        message: 'Erro ao verificar o código. Tente novamente.',
      };
    }
  }
}
