import { Socket } from 'socket.io';
import { User } from '../user/user.entity';

// extend Socket type of socket.io to inject authenticated user info
declare module 'socket.io' {
  interface Socket {
    user?: User;
  }
}
