import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path'; // Garanta que está importando o módulo 'path'

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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
  synchronize: false, // Lembre-se, isso deve ser 'false' em produção!
};

console.log(__dirname, '..', 'migrations', '*.{ts,js}');

export default databaseConfig;
