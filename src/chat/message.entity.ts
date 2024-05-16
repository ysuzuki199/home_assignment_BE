import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Room } from './room.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Room, (room) => room.messages, {
    nullable: false,
  })
  room: number;

  @Column()
  content: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.messages, {
    nullable: false,
  })
  createdBy: number;

  @Column()
  updatedAt: Date;
}
