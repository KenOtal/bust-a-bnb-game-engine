import { Subject } from 'rxjs';
import { State } from '../constants/game.enum';
import { GameState } from '../interfaces/game.interface';
import { AppService } from '../../app.service';
import { AuditoriesService } from 'src/auditories/auditories.service';
declare class Game {
    private readonly appService;
    private readonly auditoriesService;
    roundNumber: number;
    genesisSeed: string;
    salt: string;
    seed: string;
    state: State;
    currentMultiplier: number;
    tickNumber: number;
    crashingMultiplier: number;
    houseEdge: number;
    jackpotMultiplier: number;
    onStateChange: Subject<GameState>;
    constructor(genesisSeed: string, salt: string, seed: string, houseEdge: number, appService: AppService, auditoriesService: AuditoriesService);
    setSeed(seed: string): void;
    recordCurrentState(jackpot?: boolean): void;
    start(): void;
    private takingBets;
    private startRound;
    private increaseMultiplier;
    private crash;
}
export default Game;
