import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoundHistoryDocument = RoundHistory & Document;

export interface IRoundHistory {
  type: string;
  timestamp: number;
  roundNumber: number;
  seed: string;
  salt: string;
  genesisSeed: string;
  houseEdge: number;
}

@Schema()
export class RoundHistory {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  timestamp: number;

  @Prop({ required: true })
  roundNumber: number;

  @Prop({ required: true })
  seed: string;

  @Prop({ require: true })
  salt: string;

  @Prop({ require: true })
  genesisSeed: string;

  @Prop({ require: true })
  houseEdge: number;
}

export const RoundHistorySchema = SchemaFactory.createForClass(RoundHistory);
