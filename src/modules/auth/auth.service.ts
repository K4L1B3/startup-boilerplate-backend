import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { EmailDto } from './dto/email.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthenticatedRequest } from '../user/repository/authenticated-request';
import { EmailMailerService } from '../../config/mail/mailer.service';
import { CodePassService } from './codePass.service';
import { verificationCodeDto } from './dto/VerificationCode.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: EmailMailerService,
    private readonly codePassService: CodePassService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(
      loginUserDto.username,
      loginUserDto.password,
    );
    if (!user) {
      throw new Error('Invalid username or password');
    }
    const payload = { username: user.username, sub: user.id };
    return {
      acess_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(username: string, passwordInput: string): Promise<any> {
    const user = await this.userService.getUserByEmail(username);
    if (user && (await bcrypt.compare(passwordInput, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(registerUserDto: RegisterUserDto) {
    // Gerar um salt aleatório para o hash
    const salt = await bcrypt.genSalt();
    // Criptografar a senha usando o salt
    const hashedPassword = await bcrypt.hash(registerUserDto.password, salt);
    // Substituir a senha no DTO com a senha criptografada
    const user = {
      ...registerUserDto,
      password: hashedPassword,
    };
    // Usar o UserService para criar um novo usuário
    return this.userService.createUser(user);
  }

  async googleLogin(req: AuthenticatedRequest) {
    const userFromGoogle = req.user;
    if (!userFromGoogle) {
      throw new Error('No user from google!');
    }

    const { name, email, profilePicture, googleId, authType } = userFromGoogle;

    let user = await this.userService.getUserByEmail(email);

    if (!user) {
      const newUser = {
        name,
        email,
        profilePicture: profilePicture,
        authType: authType,
        googleId: googleId,
        // A senha não é necessária aqui, já que o login é via Google
      };
      user = await this.userService.createGoogleLogin(newUser);
    }
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async requestPass(email: EmailDto) {
    const verifyEmail = await this.userService.getRequestUserByEmail(email);

    if (verifyEmail !== null) {
      const verificationCode = Math.floor(
        1000 + Math.random() * 9000,
      ).toString();

      await this.codePassService.saveCode(verifyEmail.id, verificationCode);
      await this.mailerService.sendVerifyEmail(email.email, verificationCode);
    } else {
      return {
        success: false,
        message: 'Email não existe na base de dados',
      };
    }
  }

  async verificationCode(code: verificationCodeDto) {
    try {
      const getUserIdByCode = await this.codePassService.checkUserByCode(code);

      if (!getUserIdByCode) {
        console.log(getUserIdByCode.message);
        return;
      }

      const isValidateCode =
        await this.codePassService.validateVerificationCode(
          getUserIdByCode.userId,
          code,
        );

      if (isValidateCode.success) {
        const token = this.jwtService.sign({ userId: getUserIdByCode.userId });
        return {
          success: true,
          message: 'Código verificado com sucesso.',
          token,
        };
      } else {
        return {
          success: false,
          message: 'Falha na validação do código: Código inválido ou expirado',
        };
      }
    } catch (error) {
      console.error('Ocorreu um erro durante a verificação do código:', error);
      return {
        success: false,
        message: 'Erro ao verificar o código. Tente novamente.',
      };
    }
  }

  async updatePass(token: string, newPassword: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const userId = decoded.userId;
      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new NotFoundException('Usuário não encontrado!');
      }
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      await this.userService.patchUser(userId, { password: hashedPassword });

      return { success: true, message: 'Senha atualizada com sucesso.' };
    } catch (error) {
      console.error('Erro ao atualizar a senha:', error.message);
      throw new Error('Token inválido ou expirado.');
    }
  }
}
