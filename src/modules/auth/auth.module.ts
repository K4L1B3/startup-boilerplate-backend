import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { forwardRef, Module } from '@nestjs/common';
import { jwtConfig } from '../../config/security/jwt.config';
import { GoogleStrategy } from '../../config/security/strategies/google-atuh.strategy';
import { JwtStrategy } from '../../config/security/strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailMailerModule } from '../../config/mail/mailer.module';
import { CodePassService } from './codePass.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodePass } from './entity/codePass.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CodePass]),
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register(jwtConfig),
    EmailMailerModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    CodePassService],


  exports: [AuthService],
})
export class AuthModule {
  constructor() {
    console.log('AuthModule initialized');
  }
}
