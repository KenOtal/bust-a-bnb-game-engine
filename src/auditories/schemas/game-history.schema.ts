import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { State } from '../../game/constants/game.enum';

export type GameHistoryDocument = GameHistory & Document;

@Schema()
export class GameHistory {
  @Prop()
  date: Date;

  @Prop({ required: true, enum: State })
  state: State;

  @Prop({ required: true })
  roundNumber: number;

  @Prop()
  salt: string;

  @Prop()
  seed: string;

  @Prop()
  genesisSeed: string;

  @Prop()
  crashingMultiplier: number;

  @Prop()
  houseEdge: number;
}

export const GameHistorySchema = SchemaFactory.createForClass(GameHistory);
