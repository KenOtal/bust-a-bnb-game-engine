import Game from './game.entity';
import {
  INVALID_TRANSITION,
  TIME_BETWEEN_BETS_AND_RUNNING,
  TIME_BETWEEN_RUNNING_AND_BET,
} from '../constants/game.constants';
import * as sinon from 'sinon';
import { AppService } from '../../app.service';
import { State } from '../constants/game.enum';
import { AuditoriesService } from '../../auditories/auditories.service';

jest.useFakeTimers();

const setCrashingMultiplier = (game: Game, multiplierValue: number) => {
  game.crashingMultiplier = multiplierValue;
};

describe('GameEntity starts and crashes at correct times', () => {
  let service: AppService;
  let auditoryService: AuditoriesService;
  let game: Game;
  let clock;

  beforeAll(() => {
    service = new AppService();
    auditoryService = new AuditoriesService(null);
    jest
      .spyOn(auditoryService, 'recordGameHistory')
      .mockImplementation(() => null);
    game = new Game('GEN_SEED', 'SaLty', 'seed', 1, service, auditoryService);
    clock = sinon.useFakeTimers();
    game.start();
    setCrashingMultiplier(game, 2.33);
  });

  afterAll(() => {
    clock.restore();
  });

  it('Should throw an error if the state is not valid for that function', () => {
    const newGame = new Game(
      'GEN_SEED',
      'SaLty',
      'seed',
      1,
      service,
      auditoryService,
    );
    try {
      newGame.state = State.OFF;
      newGame.start();
    } catch (error) {
      expect(error.message).toBe(INVALID_TRANSITION);
    }
  });

  it('should start the game with the tick = 0 and multiplier = 1.0, state', () => {
    expect(game.tickNumber).toBe(0);
    expect(game.currentMultiplier).toBe(1.0);
  });

  it('should start taking bets', () => {
    clock.tick(TIME_BETWEEN_RUNNING_AND_BET);
    expect(game.state).toBe('TAKING_BETS');
    expect(game.tickNumber).toBe(0);
    expect(game.currentMultiplier).toBe(1.0);
  });

  it('TIME_BETWEEN_BETS_AND_RUNNING after starting the round the tick should be 1 and the multiplier 1', () => {
    clock.tick(TIME_BETWEEN_BETS_AND_RUNNING);
    expect(game.state).toBe('ROUND_IN_PROGRESS');
    expect(game.tickNumber).toBe(100);
    expect(game.currentMultiplier).toBe(1.15);
  });

  it('1000ms after starting the round the tick should be 50 and the multiplier 1.07', () => {
    clock.tick(1000);
    expect(game.state).toBe('ROUND_IN_PROGRESS');
    expect(game.tickNumber).toBe(150);
    expect(game.currentMultiplier).toBe(1.23);
  });

  it('2000ms after starting the round the tick should be 150 and the multiplier 1.23', () => {
    clock.tick(2000);
    expect(game.state).toBe('ROUND_IN_PROGRESS');
    expect(game.tickNumber).toBe(250);
    expect(game.currentMultiplier).toBe(1.41);
  });

  it('10000ms after starting the round the tick should be 500 and the multiplier 2.01', () => {
    clock.tick(7000);
    expect(game.state).toBe('ROUND_IN_PROGRESS');
    expect(game.tickNumber).toBe(600);
    expect(game.currentMultiplier).toBe(2.31);
  });

  it('10185ms the game should crash', () => {
    clock.tick(2100);
    expect(game.state).toBe('GAME_CRASHED');
    expect(game.currentMultiplier).toBe(2.33);
  });
});

// describe('Game ends with FINISHED state when multiplier hits 1000', () => {
//   let service: AppService;
//   let auditoryService: AuditoriesService;
//   let game: Game;
//   let clock;

//   beforeEach(() => {
//     service = new AppService();

//     auditoryService = new AuditoriesService(null);
//     jest
//       .spyOn(auditoryService, 'recordGameHistory')
//       .mockImplementation(() => null);

//     game = new Game('GEN_SEED', 'SaLty', 'seed', 1, service, auditoryService); //this will crash at 2.04
//     clock = sinon.useFakeTimers();
//     game.start();
//     game.crashingMultiplier = 1122.49;
//     game.maxMultiplier = 1000;
//   });

//   afterEach(() => {
//     clock.restore();
//   });
//   it('should start the game with the tick = 0 and multiplier = 1.0, state', () => {
//     expect(game.tickNumber).toBe(0);
//     expect(game.currentMultiplier).toBe(1.0);
//   });

//   it('Game should hit jackpot at after 300000ms', () => {
//     clock.tick(300000);
//     expect(game.state).toBe('GAME_FINISHED');
//   });
// });
