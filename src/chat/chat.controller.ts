import { Controller, Get, UseGuards, Param, Req } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChatService } from './chat.service';
import { Room } from './room.entity';
import { Message } from './message.entity';
import { Request } from 'express';
import { Participant } from './patricipant.entity';
@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  async rooms(): Promise<Room[]> {
    const rooms = await this.chatService.rooms();
    return rooms;
  }

  @Get('/:roomId/messages')
  @UseGuards(AuthGuard)
  async messages(
    @Param('roomId') roomId: string,
    @Req() req: Request,
  ): Promise<Message[]> {
    const idNumber = Number(roomId);
    if (isNaN(idNumber)) throw new Error('invalid room id');

    const messages = await this.chatService.messages(req.user.id, idNumber);
    return messages;
  }

  @Get('/:roomId/participants')
  @UseGuards(AuthGuard)
  async participants(
    @Param('roomId') roomId: string,
    @Req() req: Request,
  ): Promise<Participant[]> {
    const idNumber = Number(roomId);
    if (isNaN(idNumber)) throw new Error('invalid room id');

    const participants = await this.chatService.participants(
      req.user.id,
      idNumber,
    );
    return participants;
  }
}
