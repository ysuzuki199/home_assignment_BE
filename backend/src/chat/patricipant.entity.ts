import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from './room.entity';
import { User } from 'src/user/user.entity';

export enum ParticipantStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
}
@Entity('participants')
export class Participant {
  //columns
  @PrimaryColumn({ name: 'room_id' })
  roomId: number;

  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @Column()
  status: ParticipantStatus;

  //relations
  @ManyToOne(() => Room, (room) => room.participants, {
    nullable: false,
  })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne(() => User, (user) => user.participants, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
