import {
  Body,
  Controller,
  Get,
  Inject,
  LoggerService,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailDto } from './dto/email.dto';
import { verificationCodeDto } from './dto/VerificationCode.dto';
import { ResetPassDto } from './dto/resetPass.dto';
import { AuthenticatedRequest } from '../user/interfaces/authenticated-request';
import { Request, Response } from 'express';
import { RequestWithUser } from 'src/config/common/interfaces/request-with-user.interface';
import * as winston from 'winston';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('winston')
    private readonly logger: winston.Logger,
  ) { }

  @Post('/login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    schema: {
      example: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTcyMTkxMzMwMywiZXhwIjoxNzIxOTE2OTAzfQ.rKIAz4bGPCysDMAwMXgusUW3fdIePcNGBgJbE3f7uII',
      },
    },
  })
  @ApiBody({ type: LoginUserDto, description: 'User login details' })
  async login(@Body() loginUserDto: LoginUserDto) {
    this.logger.info(`User login attempt with email: ${loginUserDto.email}`);
    return this.authService.login(loginUserDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        name: 'Luiz',
        email: 'luizhlimagomes28@gmail.com',
        phone: '+5511999999999',
        password:
          '$2b$10$bUpDSd5QLDWo.dbq3ir1cuN6AlxvIDy5l4vz7SGCgZmNB6FcfzCbC',
        location: null,
        profilePicture: 'assets/ProfilePictureDefault/profile.png',
        googleId: null,
        stripeCustomerId: null,
        id: 2,
        role: 'User',
        plan: 'Trial',
        authType: 'direct',
      },
    },
  })
  @ApiBody({ type: RegisterUserDto, description: 'User registration details' })
  async register(@Body() registerUserDto: RegisterUserDto) {
    this.logger.info(
      `User registration attempt with email: ${registerUserDto.email}`,
    );
    return this.authService.register(registerUserDto);
  }

  @Post('/requestPassByEmail')
  @ApiOperation({ summary: 'Request password reset via email' })
  @ApiResponse({
    status: 200,
    description: 'Password reset request sent successfully',
  })
  @ApiBody({ type: EmailDto, description: 'Email for password reset request' })
  async requestPassword(@Body() email: EmailDto) {
    this.logger.info(`Password reset request for email: ${email.email}`);
    return this.authService.requestPass(email);
  }

  @Post('/verify-code')
  @ApiOperation({ summary: 'Verify password reset code' })
  @ApiResponse({
    status: 200,
    description: 'Code verified successfully',
    schema: {
      example: {
        success: true,
        message: 'Código verificado com sucesso.',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcyMTkxMzUwNiwiZXhwIjoxNzIxOTE3MTA2fQ.nu_zwMSD7I2AdF9Ho-MCZliB_vkP6G_blf5GElhQsmg',
      },
    },
  })
  @ApiBody({
    type: verificationCodeDto,
    description: 'Verification code details',
  })
  async VerifyCode(@Body() verifyCode: verificationCodeDto) {
    this.logger.info(
      `Verification code attempt with email: ${verifyCode.email}`,
    );
    return this.authService.verificationCode(verifyCode);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Patch('/updatePass')
  @ApiOperation({ summary: 'Update password' })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiBody({ type: ResetPassDto, description: 'New password details' })
  async updatePass(@Body() resetPassDto: ResetPassDto) {
    this.logger.info(`Password update attempt for token: ${resetPassDto.token}`);
    return this.authService.updatePass(
      resetPassDto.token,
      resetPassDto.newPass,
    );
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth(@Req() req: Request, @Res() res: Response) {
    this.logger.info('Google auth request');
    res.redirect('/auth/google/callback');
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: AuthenticatedRequest) {
    this.logger.info('Google auth callback');
    return this.authService.googleLogin(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req: RequestWithUser) {
    this.logger.info(`User logout attempt for user ID: ${req.user.userId}`);
    return this.authService.logout(req);
  }
}
