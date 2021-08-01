import { State } from 'src/game/constants/game.enum';

export interface GameHistoryRecord {
  state: State;
  roundNumber: number;
  genesisSeed: string;
  salt: string;
  seed: string;
  crashingMultiplier?: number;
  houseEdge?: number;
  jackpot?: boolean;
}
