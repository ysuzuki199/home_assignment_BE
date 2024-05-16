import { Controller, Get, Body, Post, Req, UseGuards } from '@nestjs/common';
import { User } from './user.entity';
import { Request } from 'express';
import { CreateUserDto } from './dto/create_user.dto';
import { UserService } from './user.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private userSearvice: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    const user = await this.userSearvice.createUser(dto.nickname);
    return user;
  }
  @Get()
  @UseGuards(AuthGuard)
  async users(@Req() req: Request): Promise<User[]> {
    //can extract user injected in auth middleware from req
    console.log(req.user);
    const users = await this.userSearvice.users();
    return users;
  }
}
