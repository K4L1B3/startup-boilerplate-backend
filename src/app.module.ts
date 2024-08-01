import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { databaseConfig } from './config/database/database.config';
import { jwtConfig } from './config/security/jwt.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ChatModule } from './modules/chat/chat.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { AuthMiddleware } from './modules/auth/auth.middleware';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './config/security/guards/roles.guard';
import { winstonConfig } from './config/logs/logger';
import { AxiosModule } from './config/axios/axios.module';

const isProduction = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../.env'),
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '..', 'src/config/i18n/'),
        filePattern: '*.json',
        watch: true,
      },
      resolvers: [{ use: AcceptLanguageResolver, options: ['en', 'pt-BR'] }],
    }),
    TypeOrmModule.forRoot({
      ...databaseConfig(),
      entities: [
        path.join(
          __dirname,
          isProduction ? '**/*.entity.js' : '**/*.entity.ts',
        ),
      ],
    }),
    JwtModule.register(jwtConfig),
    UserModule,
    AuthModule,
    MailerModule,
    ChatModule,
    StripeModule,
    winstonConfig,
    AxiosModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.ALL },
        { path: 'auth/register', method: RequestMethod.ALL },
        { path: 'auth/requestPassByEmail', method: RequestMethod.ALL },
        { path: '/auth/google/callback', method: RequestMethod.ALL },
        { path: '/auth/google', method: RequestMethod.ALL },
        { path: 'auth/verify-code', method: RequestMethod.ALL },
        { path: 'stripe/create-checkout-session', method: RequestMethod.ALL },
        { path: 'stripe/create-customer', method: RequestMethod.ALL },
        { path: 'stripe/webhook', method: RequestMethod.ALL },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
