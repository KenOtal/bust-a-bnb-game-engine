import { State } from '../constants/game.enum';

export interface GameStateData {
  roundNumber: number;
  tickNumber?: number;
  timestamp?: number;
  currentMultiplier?: number;
  houseEdge?: number;
  seed?: string;
  salt?: string;
  jackpot?: boolean;
}

export interface GameState {
  state: State;
  data: GameStateData;
}

export interface GameReportData {
  type: string;
  state: State;
  timestamp: number;
  roundNumber: number;
  tickNumber?: number;
  currentMultiplier?: number;
  crashingMultiplier: number;
  seed: string;
  salt: string;
}
