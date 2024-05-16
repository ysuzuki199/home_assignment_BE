import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';

@Injectable()
export class ChatService {
  constructor(@InjectRepository(Room) private roomRepo: Repository<Room>) {}

  async room(roomID: number): Promise<Room> {
    const room = await this.roomRepo.findOne({
      where: {
        id: roomID,
      },
      relations: ['participants.user'],
    });
    if (!room) throw new Error('room not found');

    return room;
  }
}
