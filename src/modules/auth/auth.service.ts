/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthenticatedRequest } from '../user/repository/authenticated-request';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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
    return this.userService.create(user);
  }

  async googleLogin(req: AuthenticatedRequest) {
    // console.log(req.user);
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
        googleId: googleId, // Este campo deve corresponder à coluna na sua entidade User
        // A senha não é necessária aqui, já que o login é via Google
      };
      user = await this.userService.createGoogleLogin(newUser);
    }
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
