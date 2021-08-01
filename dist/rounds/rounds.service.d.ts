import { Model } from 'mongoose';
import { GameHistoryDocument } from '../auditories/schemas/game-history.schema';
export declare class RoundService {
    private roundHistoryModel;
    constructor(roundHistoryModel: Model<GameHistoryDocument>);
    getLastRoundPlayed(): Promise<import("mongoose").LeanDocument<GameHistoryDocument>>;
}
