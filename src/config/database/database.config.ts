import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

export const databaseConfig = (): TypeOrmModuleOptions => {
  const configService = new ConfigService();
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  return {
    type: isProduction ? 'postgres' : 'sqlite',
    host: isProduction ? configService.get<string>('DB_HOST') : undefined,
    port: isProduction
      ? parseInt(configService.get<string>('DB_PORT'), 10)
      : undefined,
    username: isProduction
      ? configService.get<string>('DB_USERNAME')
      : undefined,
    password: isProduction
      ? configService.get<string>('DB_PASSWORD')
      : undefined,
    database: isProduction
      ? configService.get<string>('DB_DATABASE')
      : 'dev.sqlite',
    entities: [
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        'src',
        'modules',
        '**',
        '*.entity.{ts,js}',
      ),
    ],
    migrations: [path.join(__dirname, '..', 'migrations', '*.{ts,js}')],
    synchronize: !isProduction, // Apenas para desenvolvimento
    logging: !isProduction,
  };
};

export default databaseConfig;
