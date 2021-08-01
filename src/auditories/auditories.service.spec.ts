import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuditoriesService } from './auditories.service';
import { GameHistory } from './schemas/game-history.schema';
import { GameHistoryRecord } from './interfaces/game-history.interfaces';
import { getModelToken } from '@nestjs/mongoose';

// having mockImplementation return a function than in turn returns
// an object will mock the class constructor
// this way jest can mock new GameHistory()
// the return object will act as an instance of GameHistory
const gameHistoryModel = jest.fn().mockImplementation(() => {
  return {
    save: jest.fn(),
  } as any;
});

describe('RoundService', () => {
  let service: AuditoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditoriesService,
        {
          provide: getModelToken(GameHistory.name),
          useValue: gameHistoryModel,
        },
      ],
      imports: [ConfigModule.forRoot()],
    }).compile();

    service = module.get<AuditoriesService>(AuditoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('given recordGameHistory', () => {
    it('should call save after creating a new record', async () => {
      await service.recordGameHistory({} as GameHistoryRecord);
      // we look at the result here because the result of new GameHistory is an instance of GameHistory
      // with the method 'save' which is a mock function
      expect(
        gameHistoryModel.mock.results[0]['value']['save'],
      ).toHaveBeenCalled();
    });
  });
});
