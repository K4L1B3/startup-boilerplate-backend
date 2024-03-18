import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { LoggerModule } from '../../config/logs/logger.module';
import { jwtConfig } from '../../config/security/jwt.config';
import { GoogleStrategy } from '../../config/security/strategies/google-atuh.strategy';
import { JwtStrategy } from '../../config/security/strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register(jwtConfig),
    LoggerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
