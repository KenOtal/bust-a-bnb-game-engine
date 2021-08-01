import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameHistoryRecord } from './interfaces/game-history.interfaces';
import {
  GameHistory,
  GameHistoryDocument,
} from './schemas/game-history.schema';

@Injectable()
export class AuditoriesService {
  constructor(
    @InjectModel(GameHistory.name)
    private historyModel: Model<GameHistoryDocument>,
  ) {}

  recordGameHistory(
    gameHistory: GameHistoryRecord,
  ): Promise<GameHistoryDocument> {
    const record = new this.historyModel({
      date: Date.now(),
      ...gameHistory,
    });

    return record.save();
  }
}
