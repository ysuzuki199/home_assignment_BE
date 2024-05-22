import { IsNotEmpty, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';

export class DeleteRoomDto {
  @IsNumber()
  @IsNotEmpty()
  @Expose({ name: 'room_id' })
  roomId: number;
}
