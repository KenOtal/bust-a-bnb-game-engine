"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_INITIALIZING_GAME_ROUND = exports.INVALID_TRANSITION = exports.CRASH_EVENT_TRANS = exports.START_ROUND_EVENT_TRANS = exports.TAKING_BETS_EVENT_TRANS = exports.START_EVENT_TRANS = exports.MULTIPLIER_INCREASE_INTERVAL = exports.SALT = exports.TIME_BETWEEN_STARTED_AND_BET = exports.TIME_BETWEEN_BETS_AND_RUNNING = exports.TIME_TO_CRASH = exports.TIME_BETWEEN_RUNNING_AND_BET = exports.TIME_BETWEEN_CRASH_AND_BET = exports.TIME_BETWEEN_CRASH_AND_NEW_ROUND = void 0;
const game_enum_1 = require("./game.enum");
exports.TIME_BETWEEN_CRASH_AND_NEW_ROUND = 2 * 1000;
exports.TIME_BETWEEN_CRASH_AND_BET = 5 * 1000;
exports.TIME_BETWEEN_RUNNING_AND_BET = 2 * 1000;
exports.TIME_TO_CRASH = 5 * 1000;
exports.TIME_BETWEEN_BETS_AND_RUNNING = 6 * 1000;
exports.TIME_BETWEEN_STARTED_AND_BET = 2 * 1000;
exports.SALT = 'SALT';
exports.MULTIPLIER_INCREASE_INTERVAL = 20;
exports.START_EVENT_TRANS = [game_enum_1.State.OFF, game_enum_1.State.CRASHED];
exports.TAKING_BETS_EVENT_TRANS = [game_enum_1.State.GAME_STARTED];
exports.START_ROUND_EVENT_TRANS = [game_enum_1.State.TAKING_BETS];
exports.CRASH_EVENT_TRANS = [game_enum_1.State.ROUND_IN_PROGRESS];
exports.INVALID_TRANSITION = 'INVALID STATE TRANSITION';
exports.ERROR_INITIALIZING_GAME_ROUND = 'ERROR_INITIALIZING_GAME_ROUND';
//# sourceMappingURL=game.constants.js.map