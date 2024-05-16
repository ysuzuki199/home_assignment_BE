import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { Participant, ParticipantStatus } from './patricipant.entity';
import { User } from 'src/user/user.entity';
import moment from 'moment';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Room) private roomRepo: Repository<Room>,
    @InjectRepository(Participant)
    private participantRepo: Repository<Participant>,
  ) {}

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
  async joinNewRoom(userId: number, roomTitle: string): Promise<Room> {
    const now = moment();
    //create room
    const user = new User();
    user.id = userId;
    const room = this.roomRepo.create({
      title: roomTitle,
      createdBy: user,
      createdAt: now.toDate(),
    });
    const _room = await this.roomRepo.save(room);

    //create participant
    const participant = this.participantRepo.create({
      roomID: _room.id,
      userID: userId,
      status: ParticipantStatus.ONLINE,
    });
    await this.participantRepo.save(participant);
    return _room;
  }
}
