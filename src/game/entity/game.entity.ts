import { Subject } from 'rxjs';
import {
  CRASH_EVENT_TRANS,
  INVALID_TRANSITION,
  MULTIPLIER_INCREASE_INTERVAL,
  START_EVENT_TRANS,
  START_ROUND_EVENT_TRANS,
  TAKING_BETS_EVENT_TRANS,
  TIME_BETWEEN_BETS_AND_RUNNING,
} from '../constants/game.constants';
import { State } from '../constants/game.enum';
import { GameState } from '../interfaces/game.interface';
import { AppService } from '../../app.service';
import { AuditoriesService } from 'src/auditories/auditories.service';
import { GameHistoryRecord } from 'src/auditories/interfaces/game-history.interfaces';

class Game {
  roundNumber = 0;
  genesisSeed: string;
  salt: string;
  seed: string;
  state: State = State.OFF;
  currentMultiplier = 1.0;
  tickNumber = 0;
  crashingMultiplier: number;
  houseEdge: number;
  jackpotMultiplier: number = parseInt(process.env.JACKPOT_MULTIPLIER);

  public onStateChange: Subject<GameState> = new Subject();

  constructor(
    genesisSeed: string,
    salt: string,
    seed: string,
    houseEdge: number,
    private readonly appService: AppService,
    private readonly auditoriesService: AuditoriesService,
  ) {
    this.genesisSeed = genesisSeed;
    this.salt = salt;
    this.seed = seed;
    this.houseEdge = houseEdge;
  }

  setSeed(seed: string): void {
    this.seed = seed;
  }

  recordCurrentState(jackpot?: boolean) {
    const record: GameHistoryRecord = {
      state: this.state,
      roundNumber: this.roundNumber,
      genesisSeed: this.genesisSeed,
      salt: this.salt,
      seed: this.seed,
      crashingMultiplier: this.crashingMultiplier,
      houseEdge: this.houseEdge,
      jackpot,
    };

    this.auditoriesService.recordGameHistory(record);
  }

  start() {
    if (!START_EVENT_TRANS.includes(this.state)) {
      throw Error(INVALID_TRANSITION);
    }
    this.roundNumber++;
    this.currentMultiplier = 1.0;
    this.tickNumber = 0;
    this.state = State.GAME_STARTED;
    this.crashingMultiplier = this.appService.getGameResult(
      this.seed,
      this.salt,
      this.houseEdge,
    );

    this.onStateChange.next({
      state: this.state,
      data: {
        roundNumber: this.roundNumber,
        tickNumber: this.tickNumber,
        currentMultiplier: this.currentMultiplier,
      },
    });

    this.recordCurrentState();

    this.takingBets();
  }

  private takingBets() {
    if (!TAKING_BETS_EVENT_TRANS.includes(this.state)) {
      throw Error(INVALID_TRANSITION);
    }

    this.state = State.TAKING_BETS;

    this.onStateChange.next({
      state: this.state,
      data: {
        roundNumber: this.roundNumber,
      },
    });

    this.recordCurrentState();

    setTimeout(() => {
      this.startRound();
    }, TIME_BETWEEN_BETS_AND_RUNNING);
  }

  private startRound() {
    if (!START_ROUND_EVENT_TRANS.includes(this.state)) {
      throw Error(INVALID_TRANSITION);
    }
    this.state = State.ROUND_IN_PROGRESS;

    this.onStateChange.next({
      state: this.state,

      data: {
        roundNumber: this.roundNumber,
        tickNumber: this.tickNumber,
        currentMultiplier: this.currentMultiplier,
        timestamp: Date.now(),
      },
    });

    this.recordCurrentState();

    this.increaseMultiplier();
  }

  private increaseMultiplier() {
    const increaseIntervalId = setInterval(() => {
      this.tickNumber++;
      const r = 0.00007;
      const ms = this.tickNumber * 20;
      const multiplier = Math.floor(100 * Math.pow(Math.E, r * ms)) / 100;
      this.currentMultiplier = multiplier;

      this.onStateChange.next({
        state: this.state,
        data: {
          roundNumber: this.roundNumber,
          tickNumber: this.tickNumber,
          currentMultiplier: this.currentMultiplier,
        },
      });

      const isJackpot = this.currentMultiplier >= this.jackpotMultiplier;
      const isCrash =
        isJackpot || this.currentMultiplier >= this.crashingMultiplier;

      if (isCrash) {
        clearInterval(increaseIntervalId);
        this.crash(isJackpot);
      }
    }, MULTIPLIER_INCREASE_INTERVAL);
  }

  private crash(jackpot: boolean) {
    if (!CRASH_EVENT_TRANS.includes(this.state)) {
      throw Error(INVALID_TRANSITION);
    }
    this.state = State.CRASHED;

    this.onStateChange.next({
      state: this.state,
      data: {
        roundNumber: this.roundNumber,
        tickNumber: this.tickNumber,
        currentMultiplier: jackpot
          ? this.jackpotMultiplier
          : this.currentMultiplier,
        houseEdge: parseInt(process.env.HOUSE_EDGE),
        timestamp: Date.now(),
        seed: this.seed,
        salt: this.salt,
        jackpot,
      },
    });

    this.recordCurrentState(jackpot);
  }
}

export default Game;
