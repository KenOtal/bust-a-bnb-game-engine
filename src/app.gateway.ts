import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from './app.service';
import { AuditoriesService } from './auditories/auditories.service';
import {
  CLIENT_CONNECTED,
  CLIENT_DISCONNECTED,
} from './constants/message.constant';
import {
  ERROR_INITIALIZING_GAME_ROUND,
  TIME_BETWEEN_CRASH_AND_NEW_ROUND,
} from './game/constants/game.constants';
import { State } from './game/constants/game.enum';
import Game from './game/entity/game.entity';
import { GameState } from './game/interfaces/game.interface';
import { RoundService } from './rounds/rounds.service';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');
  private game: Game;
  private seedsList: string[] = [];
  private roundNumber = 0;
  private houseEdge = parseInt(process.env.HOUSE_EDGE);

  constructor(
    private readonly appService: AppService,
    private readonly roundService: RoundService,
    private readonly auditoriesService: AuditoriesService,
  ) {}

  async afterInit() {
    this.logger.log('Gateway ready');
    const { SALT, GENESIS_SEED, SEED_CHAIN_LENGTH } = process.env;

    const chainLength = Number(SEED_CHAIN_LENGTH || '1000000');

    try {
      this.logger.debug('Obtaining last round played from db...');
      const lastRound = await this.roundService.getLastRoundPlayed();

      if (
        lastRound?.genesisSeed === GENESIS_SEED &&
        lastRound?.roundNumber >= chainLength
      ) {
        this.logger.error('All rounds already played for this GENESIS_SEED');
        throw ERROR_INITIALIZING_GAME_ROUND;
      }

      if (lastRound?.genesisSeed !== GENESIS_SEED) {
        this.logger.debug(`Generating entire seed list of ${chainLength}`);
        this.seedsList = this.appService.generateSeeds(
          GENESIS_SEED,
          chainLength,
        );
        this.logger.debug('Seed list ready');
      } else {
        this.logger.debug(
          `Regenarting seed list from round number ${lastRound.roundNumber}`,
        );
        this.roundNumber = lastRound.roundNumber;
        this.seedsList = this.appService.generateSeeds(
          GENESIS_SEED,
          chainLength - this.roundNumber,
        );
        this.logger.debug(
          `Seed list with ${this.seedsList.length} seeds generated`,
        );
      }
    } catch (err) {
      console.error(err);
      throw ERROR_INITIALIZING_GAME_ROUND;
    }

    this.game = new Game(
      GENESIS_SEED,
      SALT,
      this.seedsList.pop(),
      this.houseEdge,
      this.appService,
      this.auditoriesService,
    );
    this.game.roundNumber = this.roundNumber;
    this.subscribeToGameEntityEvents();
    this.game.start();
  }

  public subscribeToGameEntityEvents() {
    this.game.onStateChange.subscribe((newState: GameState) => {
      this.logger.log('Game state change', JSON.stringify(newState));

      this.server.emit(newState.state, newState.data);

      if (newState.state === State.CRASHED) {
        setTimeout(() => {
          if (this.seedsList.length) {
            this.game.setSeed(this.seedsList.pop());
            this.game.start();
          } else {
            this.logger.log('No more seeds to start new round');
          }
        }, TIME_BETWEEN_CRASH_AND_NEW_ROUND);
      }
    });
  }

  handleConnection(client: Socket) {
    this.logger.log(`Player ops connected: ${client.id}`);
    this.server.emit(CLIENT_CONNECTED, client.id);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Player ops disconnected: ${client.id}`);
    this.server.emit(CLIENT_DISCONNECTED, client.id);
  }
}
