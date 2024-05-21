import { Controller, Post, Body } from '@nestjs/common';
import { SigninDto, SigninResponseDto } from './dto/signin.dto';
import { AuthService } from './auth.service';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signin(@Body() dto: SigninDto): Promise<SigninResponseDto> {
    const acccessToken = await this.authService.signin(dto.nickname);

    return new SigninResponseDto(acccessToken);
  }
}
