import { Controller, Get, UseGuards, Param, Req } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChatService } from './chat.service';
import { Room } from './room.entity';
import { Message } from './message.entity';
import { Request } from 'express';
@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('/:roomID/')
  @UseGuards(AuthGuard)
  async roomParticipants(@Param('roomID') roomID: string): Promise<Room> {
    const idNumber = Number(roomID);
    if (isNaN(idNumber)) throw new Error('invalid room id');

    const participants = await this.chatService.room(idNumber);
    return participants;
  }

  @Get('/:roomID/messages')
  @UseGuards(AuthGuard)
  async messages(
    @Param('roomID') roomID: string,
    @Req() req: Request,
  ): Promise<Message[]> {
    const idNumber = Number(roomID);
    if (isNaN(idNumber)) throw new Error('invalid room id');

    const messages = await this.chatService.messages(req.user.id, idNumber);
    return messages;
  }
}
