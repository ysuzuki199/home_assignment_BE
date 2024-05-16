import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { Participant, ParticipantStatus } from './patricipant.entity';
import { User } from 'src/user/user.entity';
import { Message } from './message.entity';
import moment from 'moment';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Room) private roomRepo: Repository<Room>,
    @InjectRepository(Participant)
    private participantRepo: Repository<Participant>,
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
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

  async joinExistingRoom(userId: number, roomId: number): Promise<Room> {
    //find room
    const existingRoom = await this.roomRepo.findOne({ where: { id: roomId } });
    if (!existingRoom) throw new Error('room does not exist');
    //find participant
    const existingParticipant = await this.participantRepo.findOne({
      where: { roomID: roomId, userID: userId },
    });
    console.log(existingParticipant);
    if (!existingParticipant) {
      //create participant
      const participant = this.participantRepo.create({
        roomID: existingRoom.id,
        userID: userId,
        status: ParticipantStatus.ONLINE,
      });
      await this.participantRepo.save(participant);
    } else {
      //update participant
      existingParticipant.status = ParticipantStatus.ONLINE;
      await this.participantRepo.save(existingParticipant);
    }

    return existingRoom;
  }

  async messages(userId: number, roomId: number): Promise<Message[]> {
    //check if the user is participating
    const exists = await this.participantRepo.exists({
      where: {
        roomID: roomId,
        userID: userId,
        status: ParticipantStatus.ONLINE,
      },
    });

    if (!exists)
      throw new Error(
        'cannot get messages of a room if the user is not participated in it',
      );
    //get messages
    const messages = await this.messageRepo.find({
      where: {
        room: {
          id: roomId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['user'],
    });
    return messages;
  }
  async participants(userId: number, roomId: number): Promise<Participant[]> {
    //check if the user is participating
    const exists = await this.participantRepo.exists({
      where: {
        roomID: roomId,
        userID: userId,
        status: ParticipantStatus.ONLINE,
      },
    });

    if (!exists)
      throw new Error(
        'cannot get messages of a room if the user is not participated in it',
      );
    //get participants
    const participants = await this.participantRepo.find({
      where: {
        room: {
          id: roomId,
        },
      },
      relations: ['user'],
    });
    return participants;
  }
}
