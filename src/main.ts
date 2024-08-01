import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import {
  WINSTON_MODULE_NEST_PROVIDER,
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import { AllExceptionsFilter } from './config/logs/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.json(),
            nestWinstonModuleUtilities.format.nestLike(), // Formato estilo NestJS
          ),
        }),
        new winston.transports.File({
          filename: 'combined.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.json(),
          ),
        }),
      ],
    }),
  });
  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Startup API')
    .setDescription('API de boilerplate para iniciar projetos de startups')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  //Proteção para a aplicação
  app.use(helmet());

  //Habilitando o CORS
  app.enableCors();

  // Middleware para capturar o raw body necessário para a verificação do webhook
  app.use(
    bodyParser.json({
      verify: (req: any, res, buf: Buffer) => {
        if (req.originalUrl.startsWith('/stripe/webhook')) {
          req.rawBody = buf;
        }
      },
    }),
  );

  // Use ValidationPipe globally
  app.useGlobalPipes(new ValidationPipe());

  // Adicionando o filtro global de exceções
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  await app.listen(process.env.RUN_PORT);
}

bootstrap();
