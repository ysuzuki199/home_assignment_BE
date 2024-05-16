export class SigninDto {
  nickname: string;
}

export class SigninResponseDto {
  constructor(public accessToken: string) {}
}
