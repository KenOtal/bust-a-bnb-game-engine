import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { AuditoriesService } from './auditories/auditories.service';
import {
  GameHistory,
  GameHistorySchema,
} from './auditories/schemas/game-history.schema';
import Game from './game/entity/game.entity';
import { RoundService } from './rounds/rounds.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3033),
        MONGODB_URI: Joi.required(),
        SALT: Joi.required(),
        GENESIS_SEED: Joi.required(),
        HOUSE_EDGE: Joi.number().default(1),
        SEED_CHAIN_LENGTH: Joi.required(),
        JACKPOT_MULTIPLIER: Joi.required(),
      }),
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([
      { name: GameHistory.name, schema: GameHistorySchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway, Game, RoundService, AuditoriesService],
})
export class AppModule {}
