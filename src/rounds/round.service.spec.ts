import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { GameHistory } from '../auditories/schemas/game-history.schema';
import { RoundService } from './rounds.service';

// need to do this so that the mock can handle function chaining then return a mocked value
const gameHistoryModel = {
  find: jest.fn().mockImplementationOnce(() => gameHistoryModel),
  sort: jest.fn().mockImplementationOnce(() => gameHistoryModel),
  limit: jest.fn().mockResolvedValueOnce([{ test: 'test' }]),
};

describe('RoundService', () => {
  let service: RoundService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoundService,
        {
          provide: getModelToken(GameHistory.name),
          useValue: gameHistoryModel,
        },
      ],
      imports: [ConfigModule.forRoot()],
    }).compile();

    service = module.get<RoundService>(RoundService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
