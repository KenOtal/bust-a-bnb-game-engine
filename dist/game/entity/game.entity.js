"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const game_constants_1 = require("../constants/game.constants");
const game_enum_1 = require("../constants/game.enum");
const auditories_service_1 = require("../../auditories/auditories.service");
const game_history_interfaces_1 = require("../../auditories/interfaces/game-history.interfaces");
class Game {
    constructor(genesisSeed, salt, seed, houseEdge, appService, auditoriesService) {
        this.appService = appService;
        this.auditoriesService = auditoriesService;
        this.roundNumber = 0;
        this.state = game_enum_1.State.OFF;
        this.currentMultiplier = 1.0;
        this.tickNumber = 0;
        this.jackpotMultiplier = parseInt(process.env.JACKPOT_MULTIPLIER);
        this.onStateChange = new rxjs_1.Subject();
        this.genesisSeed = genesisSeed;
        this.salt = salt;
        this.seed = seed;
        this.houseEdge = houseEdge;
    }
    setSeed(seed) {
        this.seed = seed;
    }
    recordCurrentState(jackpot) {
        const record = {
            state: this.state,
            roundNumber: this.roundNumber,
            genesisSeed: this.genesisSeed,
            salt: this.salt,
            seed: this.seed,
            crashingMultiplier: this.crashingMultiplier,
            houseEdge: this.houseEdge,
            jackpot,
        };
        this.auditoriesService.recordGameHistory(record);
    }
    start() {
        if (!game_constants_1.START_EVENT_TRANS.includes(this.state)) {
            throw Error(game_constants_1.INVALID_TRANSITION);
        }
        this.roundNumber++;
        this.currentMultiplier = 1.0;
        this.tickNumber = 0;
        this.state = game_enum_1.State.GAME_STARTED;
        this.crashingMultiplier = this.appService.getGameResult(this.seed, this.salt, this.houseEdge);
        this.onStateChange.next({
            state: this.state,
            data: {
                roundNumber: this.roundNumber,
                tickNumber: this.tickNumber,
                currentMultiplier: this.currentMultiplier,
            },
        });
        this.recordCurrentState();
        this.takingBets();
    }
    takingBets() {
        if (!game_constants_1.TAKING_BETS_EVENT_TRANS.includes(this.state)) {
            throw Error(game_constants_1.INVALID_TRANSITION);
        }
        this.state = game_enum_1.State.TAKING_BETS;
        this.onStateChange.next({
            state: this.state,
            data: {
                roundNumber: this.roundNumber,
            },
        });
        this.recordCurrentState();
        setTimeout(() => {
            this.startRound();
        }, game_constants_1.TIME_BETWEEN_BETS_AND_RUNNING);
    }
    startRound() {
        if (!game_constants_1.START_ROUND_EVENT_TRANS.includes(this.state)) {
            throw Error(game_constants_1.INVALID_TRANSITION);
        }
        this.state = game_enum_1.State.ROUND_IN_PROGRESS;
        this.onStateChange.next({
            state: this.state,
            data: {
                roundNumber: this.roundNumber,
                tickNumber: this.tickNumber,
                currentMultiplier: this.currentMultiplier,
                timestamp: Date.now(),
            },
        });
        this.recordCurrentState();
        this.increaseMultiplier();
    }
    increaseMultiplier() {
        const increaseIntervalId = setInterval(() => {
            this.tickNumber++;
            const r = 0.00007;
            const ms = this.tickNumber * 20;
            const multiplier = Math.floor(100 * Math.pow(Math.E, r * ms)) / 100;
            this.currentMultiplier = multiplier;
            this.onStateChange.next({
                state: this.state,
                data: {
                    roundNumber: this.roundNumber,
                    tickNumber: this.tickNumber,
                    currentMultiplier: this.currentMultiplier,
                },
            });
            const isJackpot = this.currentMultiplier >= this.jackpotMultiplier;
            const isCrash = isJackpot || this.currentMultiplier >= this.crashingMultiplier;
            if (isCrash) {
                clearInterval(increaseIntervalId);
                this.crash(isJackpot);
            }
        }, game_constants_1.MULTIPLIER_INCREASE_INTERVAL);
    }
    crash(jackpot) {
        if (!game_constants_1.CRASH_EVENT_TRANS.includes(this.state)) {
            throw Error(game_constants_1.INVALID_TRANSITION);
        }
        this.state = game_enum_1.State.CRASHED;
        this.onStateChange.next({
            state: this.state,
            data: {
                roundNumber: this.roundNumber,
                tickNumber: this.tickNumber,
                currentMultiplier: jackpot
                    ? this.jackpotMultiplier
                    : this.currentMultiplier,
                houseEdge: parseInt(process.env.HOUSE_EDGE),
                timestamp: Date.now(),
                seed: this.seed,
                salt: this.salt,
                jackpot,
            },
        });
        this.recordCurrentState(jackpot);
    }
}
exports.default = Game;
//# sourceMappingURL=game.entity.js.map