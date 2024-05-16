import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from './room.entity';
import { User } from 'src/user/user.entity';

enum ParticipantStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
}
@Entity()
export class Participant {
  @PrimaryColumn()
  roomID: number;

  @ManyToOne(() => Room, (room) => room.participants, {
    nullable: false,
  })
  @JoinColumn({ name: 'roomID' })
  room: Room;

  @PrimaryColumn()
  userID: number;

  @ManyToOne(() => User, (user) => user.participants, {
    nullable: false,
  })
  @JoinColumn({ name: 'userID' })
  user: User;

  @Column()
  status: ParticipantStatus;
}
