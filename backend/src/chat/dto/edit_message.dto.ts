import { IsNotEmpty, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';

export class EditMessageDto {
  @IsNumber()
  @IsNotEmpty()
  @Expose({ name: 'room_id' })
  roomId: number;

  @Expose({ name: 'message_id' })
  messageId: number;

  @IsNotEmpty()
  content: string;
}
