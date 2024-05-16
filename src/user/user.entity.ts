import { Room } from 'src/chat/room.entity';
import { Message } from 'src/chat/message.entity';
import { Participant } from 'src/chat/patricipant.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
} from 'typeorm';

@Entity('users')
@Unique(['nickname'])
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
