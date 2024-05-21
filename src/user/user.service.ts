import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async createUser(nickname: string): Promise<User> {
    const exists = await this.repo.existsBy({ nickname: nickname });
    if (exists) {
      throw new Error('user already exists');
    }
    const _user = this.repo.create({ nickname: nickname });
    const user = await this.repo.save(_user);
    return user;
  }
  async users(): Promise<User[]> {
    const users = this.repo.find();
    return users;
  }
  async user(userId: number): Promise<User> {
    const user = await this.repo.findOne({
      where: {
        id: userId,
      },
    });
    return user;
  }
}
