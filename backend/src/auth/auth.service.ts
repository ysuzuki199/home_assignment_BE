import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async signin(nickname: string): Promise<string> {
    if (!nickname) throw new Error('nickname should not be empty'); //TODO: validate input with class-validator
    //find existing user by nickname
    const existingUser = await this.repo.findOne({
      where: {
        nickname,
      },
    });
    //login by nickname and token is "Bearer {user_id}" for this assignment
    let token = '';
    if (!existingUser) {
      //create user and signin as the user
      const newUser = this.repo.create({ nickname });
      const _newUser = await this.repo.save(newUser);
      token = `Bearer ${_newUser.id}`;
    } else {
      //sign in as the existing user
      token = `Bearer ${existingUser.id}`;
    }

    return token;
  }
}
