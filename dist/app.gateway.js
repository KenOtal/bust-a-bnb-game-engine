"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const app_service_1 = require("./app.service");
const auditories_service_1 = require("./auditories/auditories.service");
const message_constant_1 = require("./constants/message.constant");
const game_constants_1 = require("./game/constants/game.constants");
const game_enum_1 = require("./game/constants/game.enum");
const game_entity_1 = require("./game/entity/game.entity");
const rounds_service_1 = require("./rounds/rounds.service");
let AppGateway = class AppGateway {
    constructor(appService, roundService, auditoriesService) {
        this.appService = appService;
        this.roundService = roundService;
        this.auditoriesService = auditoriesService;
        this.logger = new common_1.Logger('AppGateway');
        this.seedsList = [];
        this.roundNumber = 0;
        this.houseEdge = parseInt(process.env.HOUSE_EDGE);
    }
    async afterInit() {
        this.logger.log('Gateway ready');
        const { SALT, GENESIS_SEED, SEED_CHAIN_LENGTH } = process.env;
        const chainLength = Number(SEED_CHAIN_LENGTH || '1000000');
        try {
            this.logger.debug('Obtaining last round played from db...');
            const lastRound = await this.roundService.getLastRoundPlayed();
            if ((lastRound === null || lastRound === void 0 ? void 0 : lastRound.genesisSeed) === GENESIS_SEED &&
                (lastRound === null || lastRound === void 0 ? void 0 : lastRound.roundNumber) >= chainLength) {
                this.logger.error('All rounds already played for this GENESIS_SEED');
                throw game_constants_1.ERROR_INITIALIZING_GAME_ROUND;
            }
            if ((lastRound === null || lastRound === void 0 ? void 0 : lastRound.genesisSeed) !== GENESIS_SEED) {
                this.logger.debug(`Generating entire seed list of ${chainLength}`);
                this.seedsList = this.appService.generateSeeds(GENESIS_SEED, chainLength);
                this.logger.debug('Seed list ready');
            }
            else {
                this.logger.debug(`Regenarting seed list from round number ${lastRound.roundNumber}`);
                this.roundNumber = lastRound.roundNumber;
                this.seedsList = this.appService.generateSeeds(GENESIS_SEED, chainLength - this.roundNumber);
                this.logger.debug(`Seed list with ${this.seedsList.length} seeds generated`);
            }
        }
        catch (err) {
            console.error(err);
            throw game_constants_1.ERROR_INITIALIZING_GAME_ROUND;
        }
        this.game = new game_entity_1.default(GENESIS_SEED, SALT, this.seedsList.pop(), this.houseEdge, this.appService, this.auditoriesService);
        this.game.roundNumber = this.roundNumber;
        this.subscribeToGameEntityEvents();
        this.game.start();
    }
    subscribeToGameEntityEvents() {
        this.game.onStateChange.subscribe((newState) => {
            this.logger.log('Game state change', JSON.stringify(newState));
            this.server.emit(newState.state, newState.data);
            if (newState.state === game_enum_1.State.CRASHED) {
                setTimeout(() => {
                    if (this.seedsList.length) {
                        this.game.setSeed(this.seedsList.pop());
                        this.game.start();
                    }
                    else {
                        this.logger.log('No more seeds to start new round');
                    }
                }, game_constants_1.TIME_BETWEEN_CRASH_AND_NEW_ROUND);
            }
        });
    }
    handleConnection(client) {
        this.logger.log(`Player ops connected: ${client.id}`);
        this.server.emit(message_constant_1.CLIENT_CONNECTED, client.id);
    }
    handleDisconnect(client) {
        this.logger.log(`Player ops disconnected: ${client.id}`);
        this.server.emit(message_constant_1.CLIENT_DISCONNECTED, client.id);
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", Object)
], AppGateway.prototype, "server", void 0);
AppGateway = __decorate([
    websockets_1.WebSocketGateway(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        rounds_service_1.RoundService,
        auditories_service_1.AuditoriesService])
], AppGateway);
exports.AppGateway = AppGateway;
//# sourceMappingURL=app.gateway.js.map