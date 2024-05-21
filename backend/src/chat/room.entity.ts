import { User } from 'src/user/user.entity';
import { Message } from 'src/chat/message.entity';
import { Participant } from './patricipant.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('rooms')
export class Room {
  //columns
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
  @Column({ name: 'created_by' })
  createdBy: number;

  @Column({ name: 'created_at' })
  createdAt: Date;

  //relations
  @ManyToOne(() => User, (user) => user.rooms, {
    nullable: false,
  })
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;

  @OneToMany(() => Message, (message) => message.room, {
    nullable: false,
  })
  messages: Message[];

  @OneToMany(() => Participant, (participant) => participant.room, {
    nullable: false,
  })
  participants: Participant[];
}
