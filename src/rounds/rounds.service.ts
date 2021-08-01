import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  GameHistory,
  GameHistoryDocument,
} from '../auditories/schemas/game-history.schema';

@Injectable()
export class RoundService {
  constructor(
    @InjectModel(GameHistory.name)
    private roundHistoryModel: Model<GameHistoryDocument>,
  ) {}

  async getLastRoundPlayed() {
    const lastRecord = await this.roundHistoryModel
      .find()
      .sort({ date: -1 })
      .limit(1)
      .lean();

    return lastRecord[0];
  }
}
