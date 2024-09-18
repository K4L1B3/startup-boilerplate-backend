// src/main.ts

import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import logger from './config/logs/logger';

// Captura de exceções não tratadas
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  logger.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  logger.error('Unhandled Rejection:', reason);
});

async function bootstrap() {
  try {
    logger.info('Iniciando a aplicação...');
    logger.info('Antes de NestFactory.create');

    const app = await NestFactory.create(AppModule, {
      logger: false,
    });
    logger.info('Depois de NestFactory.create');

    app.useLogger(logger);
    logger.info('Logger configurado.');

    // Configuração do Swagger
    logger.info('Configurando Swagger...');
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
    logger.info('Swagger configurado.');

    // Proteção para a aplicação
    app.use(helmet());
    logger.info('Helmet configurado.');

    // Habilitando o CORS
    app.enableCors();
    logger.info('CORS habilitado.');

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
    logger.info('Body parser configurado.');

    // Use ValidationPipe globalmente
    app.useGlobalPipes(new ValidationPipe());
    logger.info('ValidationPipe configurado.');

    const port = process.env.RUN_PORT || 3000;
    logger.info(`Iniciando a aplicação na porta ${port}...`);
    await app.listen(port);
    logger.info(`Aplicação está rodando na porta ${port}`);
  } catch (error) {
    console.error('Erro ao iniciar a aplicação:', error);
    logger.error('Erro ao iniciar a aplicação:', error);
  }

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });
}

bootstrap();
