import { Room } from '../chat/room.entity';
import { Message } from '../chat/message.entity';
import { Participant } from '../chat/patricipant.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  //TODO: when adding secret-like columns, find a way to omit these values from API response.

  @OneToMany(() => Room, (room) => room.createdBy, {
    nullable: false,
  })
  rooms: Room[];

  @OneToMany(() => Message, (message) => message.createdBy, {
    nullable: false,
  })
  messages: Message[];

  @OneToMany(() => Participant, (participant) => participant.user, {
    nullable: false,
  })
  //TODO: consider appropriate field name
  participants: Participant[];
}
