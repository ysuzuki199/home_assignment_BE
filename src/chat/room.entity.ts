import { User } from '../user/user.entity';
import { Message } from '../chat/message.entity';
import { Participant } from './patricipant.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => User, (user) => user.rooms, {
    nullable: false,
  })
  createdBy: User;

  @OneToMany(() => Message, (message) => message.room, {
    nullable: false,
  })
  messages: Message[];

  @OneToMany(() => Participant, (participant) => participant.room, {
    nullable: false,
  })
  participants: Participant[];

  @Column()
  createdAt: Date;
}
