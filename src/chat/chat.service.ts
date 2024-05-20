import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { Participant, ParticipantStatus } from './patricipant.entity';
import { User } from 'src/user/user.entity';
import { Message } from './message.entity';
import moment, { now } from 'moment';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Room) private roomRepo: Repository<Room>,
    @InjectRepository(Participant)
    private participantRepo: Repository<Participant>,
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
  ) {}

  async rooms(): Promise<Room[]> {
    const rooms = await this.roomRepo.find({
      //TODO: add soft delete flag column to rooms table and select only non-deleted rooms
      order: {
        createdAt: 'DESC',
      },
    });

    return rooms;
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
    const participating = await isUserParticipating(
      this.participantRepo,
      userId,
      roomId,
    );

    if (!participating)
      throw new Error(
        'cannot get messages of a room if the user is not participating in it',
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
    const participating = await isUserParticipating(
      this.participantRepo,
      userId,
      roomId,
    );

    if (!participating)
      throw new Error(
        'cannot get participants of a room if the user is not participating in it',
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
  async createMessage(
    userId: number,
    roomId: number,
    content: string,
  ): Promise<Message> {
    const now = moment();
    //check if the user is participating
    const participating = await isUserParticipating(
      this.participantRepo,
      userId,
      roomId,
    );
    if (!participating) throw new Error('user is not participating');

    //create message
    const message = this.messageRepo.create({
      room: {
        id: roomId,
      },
      content: content, //need some word filtering and sanitization
      user: {
        id: userId,
      },
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    });
    //memo: need rate limit?
    const _message = await this.messageRepo.save(message);
    return _message;
  }
}

const isUserParticipating = async (
  participantRepo: Repository<Participant>,
  userId: number,
  roomId: number,
) => {
  return await participantRepo.exists({
    where: {
      roomID: roomId,
      userID: userId,
      status: ParticipantStatus.ONLINE,
    },
  });
};
