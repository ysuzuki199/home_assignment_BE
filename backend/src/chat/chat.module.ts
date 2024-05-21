import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Room } from './room.entity';
import { Participant } from './patricipant.entity';
import { ChatController } from './chat.controller';
import { Message } from './message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Room]),
    TypeOrmModule.forFeature([Participant]),
    TypeOrmModule.forFeature([Message]),
  ],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
