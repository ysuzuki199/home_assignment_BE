import { TypeOrmModuleOptions } from '@nestjs/typeorm';

//database for testing

export const TypeOrmTestConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: 3306,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['**/*.entity.ts'],
  synchronize: true,
};
