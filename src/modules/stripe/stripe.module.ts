import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { User } from '../user/entity/user.entity';
import { json } from 'express';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule],
  providers: [StripeService],
  controllers: [StripeController],
})
export class StripeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        json({
          verify: (req: any, res, buf: Buffer) => {
            if (req.originalUrl.startsWith('/stripe/webhook')) {
              req.rawBody = buf;
            }
          },
        }),
      )
      .forRoutes('stripe/webhook');
  }
}
