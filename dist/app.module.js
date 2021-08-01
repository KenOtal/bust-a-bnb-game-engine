"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const Joi = require("joi");
const app_controller_1 = require("./app.controller");
const app_gateway_1 = require("./app.gateway");
const app_service_1 = require("./app.service");
const auditories_service_1 = require("./auditories/auditories.service");
const game_history_schema_1 = require("./auditories/schemas/game-history.schema");
const game_entity_1 = require("./game/entity/game.entity");
const rounds_service_1 = require("./rounds/rounds.service");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            config_1.ConfigModule.forRoot({
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
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI),
            mongoose_1.MongooseModule.forFeature([
                { name: game_history_schema_1.GameHistory.name, schema: game_history_schema_1.GameHistorySchema },
            ]),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, app_gateway_1.AppGateway, game_entity_1.default, rounds_service_1.RoundService, auditories_service_1.AuditoriesService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map