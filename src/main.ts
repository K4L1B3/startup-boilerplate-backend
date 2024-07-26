import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(process.env.RUN_PORT);
}

bootstrap();
