import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'] as string;

    //request with no auth header can pass as public access
    if (!authHeader) return next();

    const user = await extractUserFromAuthHeader(authHeader, this.userRepo);
    //authorized and set user
    req.user = user;
    next();
  }
}

export const extractUserFromAuthHeader = async (
  authHeader: string,
  repo: Repository<User>,
): Promise<User> => {
  const splitted = authHeader.split(' ');
  if (splitted[0] !== 'Bearer') {
    throw new Error('invalid auth token');
  }
  const token = splitted[1];

  if (!token) {
    throw new Error('token is missing');
  }

  const userId = decodeTokenAndExtractUserId(token);
  const user = await repo.findOne({ where: { id: userId } });
  if (!user) {
    throw new Error('user not found');
  }
  return user;
};

const decodeTokenAndExtractUserId = (token: string): number => {
  //auth header is defined as "Bearer {user_id}" to simplify authentication process
  const id = Number(token);
  if (isNaN(id)) {
    throw new Error('token is not numeric');
  }
  return Number(token);
};
