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
import { extractUserFromAuthHeader } from '../auth/auth.middleware';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChatService } from './chat.service';
import { JoinNewRoomDto } from './dto/join_new_room.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private chatService: ChatService,
  ) {}

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

  @SubscribeMessage('join_new_room')
  @UseGuards(AuthGuard)
  async joinNewRoom(
    @MessageBody() dto: JoinNewRoomDto,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    const room = await this.chatService.joinNewRoom(client.user.id, dto.title);
    //join room
    client.join(`${room.id}`);
    //emit some message to participants
    client.to(`${room.id}`).emit('join_user', `${client.user.nickname} joined`);
    return 'join_new_room success';
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('@@handleConnection: ', client.id);
  }
  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('@@handleDisconnect: ', client.id);
  }
}
