import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { HttpModule } from './config/axios/http.module';
import databaseConfig from './config/database/database.config';
import { jwtConfig } from './config/security/jwt.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ChatModule } from './modules/chat/chat.module';

const isProduction = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '..', 'src/config/i18n/'),
        filePattern: '*.json',
        watch: true,
      },
      resolvers: [
        { use: AcceptLanguageResolver, options: ['en', 'pt-BR'] }, // Lista de idiomas suportados
      ],
    }),
    TypeOrmModule.forRoot({
      ...databaseConfig,
      entities: [
        path.join(
          __dirname,
          isProduction ? '**/*.entity.js' : '**/*.entity.ts',
        ),
      ],
    }),
    JwtModule.register(jwtConfig),
    HttpModule.forRoot(),
    UserModule,
    AuthModule,
    MailerModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
