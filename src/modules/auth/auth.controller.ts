/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../user/repository/authenticated-request';
import { EmailDto } from './dto/email.dto';
import { verificationCodeDto } from './dto/VerificationCode.dto';
import { ResetPassDto } from './dto/resetPass.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('/requestPassByEmail')
  async requestPassword(@Body() email: EmailDto) {
    return this.authService.requestPass(email);
  }

  @Post('/verify-code')
  async VerifyCode(@Body() verifyCode: verificationCodeDto) {
    return this.authService.verificationCode(verifyCode);
  }

  @Patch('/updatePass')
  async updatePass(@Body() resetPassDto: ResetPassDto) {
    return this.authService.updatePass(
      resetPassDto.token,
      resetPassDto.newPass,
    );
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth(@Req() req: Request, @Res() res: Response) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: AuthenticatedRequest) {
    return this.authService.googleLogin(req);
  }
}
