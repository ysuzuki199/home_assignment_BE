import { IsNotEmpty, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';

export class PostMessageDto {
  @IsNumber()
  @IsNotEmpty()
  @Expose({ name: 'room_id' })
  roomId: number;
  @IsNotEmpty()
  content: string;
}
