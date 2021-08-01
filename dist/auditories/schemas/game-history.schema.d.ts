import { Document } from 'mongoose';
import { State } from '../../game/constants/game.enum';
export declare type GameHistoryDocument = GameHistory & Document;
export declare class GameHistory {
    date: Date;
    state: State;
    roundNumber: number;
    salt: string;
    seed: string;
    genesisSeed: string;
    crashingMultiplier: number;
    houseEdge: number;
}
export declare const GameHistorySchema: import("mongoose").Schema<Document<GameHistory, any>, import("mongoose").Model<any, any, any>, undefined>;
