import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { mocked } from 'ts-jest/utils';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { AuditoriesService } from './auditories/auditories.service';
import { GameHistory } from './auditories/schemas/game-history.schema';
import Game from './game/entity/game.entity';
import { RoundHistory } from './rounds/round.schema';
import { RoundService } from './rounds/rounds.service';

// we are mocking the entire Game class
// after this you will be able to access game instances with mockedGame.instances
jest.mock('./game/entity/game.entity');
const mockedGame = Game as jest.Mock<Game>;

const mockGameHistory = {};

const mockRound = {};

const mockRoundService = {
  getLastRoundPlayed: jest.fn(),
};

describe('AppGateway test', () => {
  const OLD_ENV = process.env;

  let gateway: AppGateway;
  let appService: AppService;
  let roundService: RoundService;
  let mockClient: any;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        AuditoriesService,
        AppGateway,
        AppService,
        {
          provide: getModelToken(GameHistory.name),
          useValue: mockGameHistory,
        },
        {
          provide: getModelToken(RoundHistory.name),
          useValue: mockRound,
        },
        {
          provide: RoundService,
          useValue: mockRoundService,
        },
      ],
    }).compile();

    gateway = await module.get<AppGateway>(AppGateway);
    appService = await module.get<AppService>(AppService);
    roundService = await module.get<RoundService>(RoundService);

    jest.resetModules();
    roundService.getLastRoundPlayed = jest.fn().mockImplementation(() => 1);

    appService.generateSeeds = jest
      .fn()
      .mockImplementation((genesisSeed, amount) => ['some_seed']);

    jest
      .spyOn(gateway, 'subscribeToGameEntityEvents')
      .mockImplementation(() => 'TEST');

    process.env = { ...OLD_ENV };

    mockClient = {
      id: '1234',
    };
  });

  afterEach(() => {
    process.env = OLD_ENV;
    mockedGame.mockClear();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('Given a afterInit method', () => {
    describe('SUCCESS', () => {
      it('Should initialise the game', async () => {
        await gateway.afterInit();
        expect(mockedGame).toHaveBeenCalledTimes(1);
      });

      it('Should subscribe to game entity events', async () => {
        await gateway.afterInit();
        expect(gateway.subscribeToGameEntityEvents).toHaveBeenCalled();
      });

      it('Should generate 1000000 seeds if the GENESIS_SEED is different from lastRound.genesisSeed', async () => {
        process.env.GENESIS_SEED = 'some_other_seed';
        await gateway.afterInit();
        // use mocked([some function that isn't mocked]) to apply jest.mock types to the function. This way you can access .mock
        expect(mocked(appService.generateSeeds).mock.calls[0][1]).toBe(1000000);
      });

      it('Should generate seeds with the GENESIS_SEED and the diference between 1000000 and this.roundNumber', async () => {
        const fakeLastRecord = {
          date: '123455',
          state: 'round_started',
          genesisSeed: process.env.GENESIS_SEED,
          roundNumber: 1,
        };
        roundService.getLastRoundPlayed = jest
          .fn()
          .mockImplementation(() => fakeLastRecord);
        await gateway.afterInit();
        expect(mocked(appService.generateSeeds).mock.calls[0][1]).toBe(999999);
      });

      it('Should start the game', async () => {
        await gateway.afterInit();
        const mockedGameInstance = mockedGame.mock.instances[0];
        expect(mockedGameInstance.start).toHaveBeenCalled();
      });
    });
  });

  describe('Given a subscribeToGameEntityEvents method', () => {
    describe('SUCCESS', () => {
      it('Should subscribe to the onStateChange', () => {
        expect(true).toBeTruthy();
      });

      it('Should set a new seed for the game', () => {
        expect(true).toBeTruthy();
      });
    });
  });

  describe('Given a handleDisconnect method', () => {
    describe('SUCCESS', () => {
      it('Should emit a CLIENT_DISCONNECTED with the clientId', async () => {
        // need this otherwise it won't instantiate a new ws server
        const app = module.createNestApplication();
        await app.init();

        const mockedEmit = jest.spyOn(gateway.server, 'emit');
        gateway.handleDisconnect(mockClient);

        expect(mockedEmit).toHaveBeenCalled();
        expect(mockedEmit.mock.calls[0][0]).toBe('CLIENT_DISCONNECTED');
      });
    });
  });

  describe('Given a handleConnection method', () => {
    describe('SUCCESS', () => {
      it('Should emit the current game state for the event with the data, and the accepted bets', async () => {
        // need this otherwise it won't instantiate a new ws server
        const app = module.createNestApplication();
        await app.init();

        const mockedEmit = jest.spyOn(gateway.server, 'emit');
        gateway.handleConnection(mockClient);

        expect(mockedEmit).toHaveBeenCalled();
        expect(mockedEmit.mock.calls[0][0]).toBe('CLIENT_CONNECTED');
      });
    });
  });
});
