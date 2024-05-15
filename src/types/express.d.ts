import * as express from 'express';
import { User } from 'src/user/user.entity';

// extend Request type of express to inject authenticated user info
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
