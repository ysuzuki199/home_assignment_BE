import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './chat/chat.module';
import { User } from './user/user.entity';
import { AuthMiddleware } from './middlewares/auth.middleware';
@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: ['**/*.entity.js'],
      synchronize: true, //migrate automatically, not recommended in production/staging environment
    }),
    TypeOrmModule.forFeature([User]), //DI user repository
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  //apply auth middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
