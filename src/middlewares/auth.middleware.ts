import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'] as string;
    if (!authHeader) {
      //request with no auth header can pass as public access
      next();
      return;
    }

    const splitted = authHeader.split(' ');
    if (splitted[0] !== 'Bearer') {
      throw new Error('invalid auth token');
    }
    const token = splitted[1];

    if (!token) {
      throw new Error('token is missing');
    }

    const userID = this.decodeAndExtractUserID(token);
    const user = await this.userService.user(userID);
    if (!user) {
      throw new Error('user not found');
    }
    //authorized and set user
    req.user = user;
    next();
  }

  //auth header is defined as "Bearer {user_id}" to simplify authentication process
  decodeAndExtractUserID(token: string): number {
    const id = Number(token);
    if (isNaN(id)) {
      throw new Error('token is not numeric');
    }
    return Number(token);
  }
}
