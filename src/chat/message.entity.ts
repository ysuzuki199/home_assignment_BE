import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Room } from './room.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Room, (room) => room.messages, {
    nullable: false,
  })
  @JoinColumn()
  room: Room;

  @Column()
  content: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.messages, {
    nullable: false,
  })
  @JoinColumn()
  user: User;

  @Column()
  updatedAt: Date;
}
