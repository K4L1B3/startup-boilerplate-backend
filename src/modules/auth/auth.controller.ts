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
import { AuthenticatedRequest } from '../user/repository/authenticated-request';
import { Request, Response } from 'express';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    return this.authService.verificationCode(verifyCode);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Patch('/updatePass')
  @ApiOperation({ summary: 'Update password' })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiBody({ type: ResetPassDto, description: 'New password details' })
  async updatePass(@Body() resetPassDto: ResetPassDto) {
    return this.authService.updatePass(
      resetPassDto.token,
      resetPassDto.newPass,
    );
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth(@Req() req: Request, @Res() res: Response) {
    res.redirect('/auth/google/callback');
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: AuthenticatedRequest) {
    return this.authService.googleLogin(req);
  }
}
