import { Entity, Column, PrimaryColumn } from 'typeorm';

enum ParticipantStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
}
@Entity()
export class Participant {
  @PrimaryColumn()
  roomID: number;
  @PrimaryColumn()
  userID: number;
  @Column()
  status: ParticipantStatus;
}
