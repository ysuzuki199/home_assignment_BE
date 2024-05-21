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
import {
  UseGuards,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { extractUserFromAuthHeader } from '../auth/auth.middleware';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChatService } from './chat.service';
import { JoinNewRoomDto } from './dto/join_new_room.dto';
import { JoinExistingRoomDto } from './dto/join_existing_room.dto';
import { PostMessageDto } from './dto/post_message.dto';
import { EditMessageDto } from './dto/edit_message.dto';

@WebSocketGateway({ cors: { origin: '*' } })
//memo: useGlobalPipes() doesn't work on gateways!!
//https://docs.nestjs.com/pipes#global-scoped-pipes
@UsePipes(
  new ValidationPipe({
    transform: true,
  }),
)
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

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('@@handleConnection: ', client.id);
  }
  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('@@handleDisconnect: ', client.id);
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

  @SubscribeMessage('join_existing_room')
  @UseGuards(AuthGuard)
  async joinExistingRoom(
    @MessageBody() dto: JoinExistingRoomDto,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    const room = await this.chatService.joinExistingRoom(
      client.user.id,
      dto.roomId,
    );
    //join room
    client.join(`${room.id}`);
    //emit some message to participants
    client.to(`${room.id}`).emit('join_user', `${client.user.nickname} joined`);
    return 'join_existing_room success';
  }

  @SubscribeMessage('post_message')
  @UseGuards(AuthGuard)
  async postMessage(
    @MessageBody() dto: PostMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    const message = await this.chatService.createMessage(
      client.user.id,
      dto.roomId,
      dto.content,
    );
    message.user = client.user;
    //emit message to participants
    this.server.to(`${dto.roomId}`).emit('post_message', message);
    return 'post_message success';
  }

  @SubscribeMessage('edit_message')
  @UseGuards(AuthGuard)
  async editMessage(
    @MessageBody() dto: EditMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    const message = await this.chatService.editMessage(
      client.user.id,
      dto.roomId,
      dto.messageId,
      dto.content,
    );
    message.user = client.user;
    this.server.to(`${dto.roomId}`).emit('edit_message', message);
    return 'edit_message success';
  }
}
