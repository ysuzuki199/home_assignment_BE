import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Room } from './room.entity';
import internal from 'stream';

@Entity('messages')
export class Message {
  //columns
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'room_id' })
  roomId: number;

  @Column()
  content: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  //relations
  @ManyToOne(() => Room, (room) => room.messages, {
    nullable: false,
  })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne(() => User, (user) => user.messages, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
