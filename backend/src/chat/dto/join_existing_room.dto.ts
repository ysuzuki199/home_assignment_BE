import { IsNotEmpty, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';

//TODO: DTO validation and transformation not functioning
export class JoinExistingRoomDto {
  @IsNumber()
  @Expose({ name: 'room_id' })
  roomId: number;
}
