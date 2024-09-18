import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { EmailDto } from './dto/email.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthenticatedRequest } from '../user/interfaces/authenticated-request';
import { EmailMailerService } from '../../config/mail/mailer.service';
import { CodePassService } from './codePass.service';
import { verificationCodeDto } from './dto/VerificationCode.dto';
import { RequestWithUser } from '../../config/common/interfaces/request-with-user.interface';
import * as winston from 'winston';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: EmailMailerService,
    private readonly codePassService: CodePassService,
    @Inject('winston') 
private readonly logger: winston.Logger,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    this.logger.info(`Login attempt for user: ${loginUserDto.username}`);
    const user = await this.validateUser(
      loginUserDto.username,
      loginUserDto.password,
    );
    if (!user) {
      this.logger.error('Invalid username or password');
      throw new Error('Invalid username or password');
    }
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(username: string, passwordInput: string): Promise<any> {
    const user = await this.userService.getUserByEmail(username);
    if (user && (await bcrypt.compare(passwordInput, user.password))) {
      this.logger.info(`User validated: ${username}`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    this.logger.warn(`Validation failed for user: ${username}`);
    return null;
  }

  async register(registerUserDto: RegisterUserDto) {
    this.logger.info(`Registration attempt for user: ${registerUserDto.email}`);
    const verifyEmail = await this.userService.getUserByEmail(
      registerUserDto.email,
    );

    if (verifyEmail) {
      this.logger.error('Email already exists');
      throw new Error('Email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(registerUserDto.password, salt);
    const user = {
      ...registerUserDto,
      password: hashedPassword,
    };
    return this.userService.createUser(user);
  }

  async googleLogin(req: AuthenticatedRequest) {
    const userFromGoogle = req.user;
    if (!userFromGoogle) {
      this.logger.error('No user from Google');
      throw new Error('No user from Google');
    }

    const { name, email, profilePicture, googleId, authType } = userFromGoogle;

    let user = await this.userService.getUserByEmail(email);

    if (user) {
      if (user.authType !== 'google') {
        this.logger.error(
          'User with this email already exists and is linked to another account type',
        );
        throw new Error(
          'User with this email already exists and is linked to another account type',
        );
      }
    } else {
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
    const accessToken = this.jwtService.sign(payload);
    return {
      access_token: accessToken,
    };
  }

  async requestPass(email: EmailDto) {
    this.logger.info(`Password reset request for email: ${email.email}`);
    const verifyEmail = await this.userService.getRequestUserByEmail(email);

    if (verifyEmail !== null) {
      const verificationCode = Math.floor(
        1000 + Math.random() * 9000,
      ).toString();

      await this.codePassService.saveCode(verifyEmail.id, verificationCode);
      await this.mailerService.sendVerifyEmail(email.email, verificationCode);
    } else {
      this.logger.warn('Email not found in the database');
      return {
        success: false,
        message: 'Email não existe na base de dados',
      };
    }
  }

  async verificationCode(code: verificationCodeDto) {
    try {
      this.logger.info(`Verification code attempt for email: ${code.email}`);
      const getUserIdByCode = await this.codePassService.checkUserByCode(code);

      if (!getUserIdByCode) {
        this.logger.error('Invalid verification code');
        return;
      }

      const isValidateCode =
        await this.codePassService.validateVerificationCode(
          getUserIdByCode.userId,
          code,
        );

      if (isValidateCode.success) {
        const token = this.jwtService.sign({ userId: getUserIdByCode.userId });
        this.logger.info('Verification code validated successfully');
        return {
          success: true,
          message: 'Código verificado com sucesso.',
          token,
        };
      } else {
        this.logger.warn('Verification code validation failed');
        return {
          success: false,
          message: 'Falha na validação do código: Código inválido ou expirado',
        };
      }
    } catch (error) {
      this.logger.error(`Error during code verification: ${error.message}`);
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
      this.logger.info(`Password update attempt for user ID: ${userId}`);
      const user = await this.userService.getUserById(userId);
      if (!user) {
        this.logger.error('User not found');
        throw new NotFoundException('Usuário não encontrado!');
      }
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      await this.userService.patchUser(userId, { password: hashedPassword });

      this.logger.info('Password updated successfully');
      return { success: true, message: 'Senha atualizada com sucesso.' };
    } catch (error) {
      this.logger.error(`Error updating password: ${error.message}`);
      throw new Error('Token inválido ou expirado.');
    }
  }

  async logout(req: RequestWithUser) {
    this.logger.info(`User logout attempt for user ID: ${req.user.userId}`);
    req.logout();
    return { message: 'Logged out successfully' };
  }
}
