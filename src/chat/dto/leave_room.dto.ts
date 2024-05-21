import { IsNotEmpty, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';

export class LeaveRoomDto {
  @IsNumber()
  @IsNotEmpty()
  @Expose({ name: 'room_id' })
  roomId: number;
}
