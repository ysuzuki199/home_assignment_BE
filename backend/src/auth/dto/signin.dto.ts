import { IsNotEmpty } from 'class-validator';

export class SigninDto {
  @IsNotEmpty()
  nickname: string;
}

export class SigninResponseDto {
  constructor(public accessToken: string) {}
}
