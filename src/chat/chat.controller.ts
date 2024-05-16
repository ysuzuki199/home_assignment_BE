import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChatService } from './chat.service';
import { Room } from './room.entity';
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
}
