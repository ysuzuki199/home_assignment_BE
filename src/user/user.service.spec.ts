import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Room } from '../chat/room.entity';
import { TypeOrmTestConfig } from '../test/testconfig';
import { Repository } from 'typeorm';
import { ConsoleLogger } from '@nestjs/common';
import { async } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(TypeOrmTestConfig),
        TypeOrmModule.forFeature([User, Room]),
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });
  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

describe('users()', () => {
  let service: UserService;
  let module: TestingModule;
  let repo: Repository<User>;

  let users: User[];
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(TypeOrmTestConfig),
        TypeOrmModule.forFeature([User, Room]),
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
    console.log('beforeAll');
    console.log(repo);
    users = [
      repo.create({ nickname: 'mike' }),
      repo.create({ nickname: 'john' }),
    ];
    users = await repo.save(users);
  });
  afterAll(async () => {
    await repo.clear();
    await module.close();
  });
  const tests = [
    {
      name: '取得できること',
      want: users,
    },
  ];

  it('should be defined', async () => {
    const out = await service.users();
    expect(out).toMatchObject(users);
  });
});
