import { Model } from 'mongoose';
import { GameHistoryRecord } from './interfaces/game-history.interfaces';
import { GameHistoryDocument } from './schemas/game-history.schema';
export declare class AuditoriesService {
    private historyModel;
    constructor(historyModel: Model<GameHistoryDocument>);
    recordGameHistory(gameHistory: GameHistoryRecord): Promise<GameHistoryDocument>;
}
