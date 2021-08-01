"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = exports.State = void 0;
var State;
(function (State) {
    State["GAME_STARTED"] = "GAME_STARTED";
    State["TAKING_BETS"] = "TAKING_BETS";
    State["ROUND_IN_PROGRESS"] = "ROUND_IN_PROGRESS";
    State["CRASHED"] = "GAME_CRASHED";
    State["OFF"] = "OFF";
})(State = exports.State || (exports.State = {}));
var EventType;
(function (EventType) {
    EventType["CHANGE_STATE"] = "CHANGE_STATE";
})(EventType = exports.EventType || (exports.EventType = {}));
//# sourceMappingURL=game.enum.js.map