import { Controller, Get, Body, Post } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create_user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userSearvice: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    const user = await this.userSearvice.createUser(dto.nickname);
    return user;
  }
  @Get()
  async users(): Promise<User[]> {
    const users = await this.userSearvice.users();
    return users;
  }
}
