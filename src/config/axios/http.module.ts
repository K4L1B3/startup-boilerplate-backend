// src/http/http.module.ts
import { Module, Global, DynamicModule } from '@nestjs/common';
import { HttpService } from '../axios/http.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({})
export class HttpModule {
  static forRoot(): DynamicModule {
    return {
      module: HttpModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: 'CHATGPT_HTTP_SERVICE',
          useFactory: (configService: ConfigService) => {
            const baseURL = configService.get<string>('API_BASE_URL_CHATGPT');
            return new HttpService(baseURL);
          },
          inject: [ConfigService],
        },
        {
          provide: 'WHATSAPP_HTTP_SERVICE',
          useFactory: (configService: ConfigService) => {
            const baseURL = configService.get<string>('API_BASE_URL_WHATSAPP');
            return new HttpService(baseURL);
          },
          inject: [ConfigService],
        },
        {
          provide: 'STRIPE_HTTP_SERVICE',
          useFactory: (configService: ConfigService) => {
            const baseURL = configService.get<string>('API_BASE_URL_STRIPE');
            return new HttpService(baseURL);
          },
          inject: [ConfigService],
        },
      ],
      exports: [
        'CHATGPT_HTTP_SERVICE',
        'WHATSAPP_HTTP_SERVICE',
        'STRIPE_HTTP_SERVICE',
      ],
    };
  }
}
