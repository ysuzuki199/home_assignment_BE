import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { extractUserFromAuthHeader } from '../middlewares/auth.middleware';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { AuthGuard } from '../guards/auth.guard';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  @SubscribeMessage('message')
  @UseGuards(AuthGuard)
  handleMessage(
    @MessageBody() payload: string,
    @ConnectedSocket() client: Socket,
  ): string {
    console.log('received');
    client.emit('message', `Hello world!:  ${payload}`);
    return `Hello world!:  ${payload}`;
  }

  afterInit(server: Server) {
    //auth middleware for socket.io connection
    server.use(async (socket, next) => {
      console.log('websocket auth');

      const token = socket.handshake.headers.authorization;
      //request with no auth header can pass as public access
      if (!token) return next();

      const user = await extractUserFromAuthHeader(token, this.userRepo);
      //authorized and set user
      socket.user = user;
      next();
    });
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('@@handleConnection: ', client.id);
  }
  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('@@handleDisconnect: ', client.id);
  }
}
