import { State } from './game.enum';

export const TIME_BETWEEN_CRASH_AND_NEW_ROUND = 2 * 1000;
export const TIME_BETWEEN_CRASH_AND_BET = 5 * 1000;
export const TIME_BETWEEN_RUNNING_AND_BET = 2 * 1000;
export const TIME_TO_CRASH = 5 * 1000;
export const TIME_BETWEEN_BETS_AND_RUNNING = 6 * 1000;
export const TIME_BETWEEN_STARTED_AND_BET = 2 * 1000;
export const SALT = 'SALT';
export const MULTIPLIER_INCREASE_INTERVAL = 20;
// TRANSITIONS
export const START_EVENT_TRANS = [State.OFF, State.CRASHED];
export const TAKING_BETS_EVENT_TRANS = [State.GAME_STARTED];
export const START_ROUND_EVENT_TRANS = [State.TAKING_BETS];
export const CRASH_EVENT_TRANS = [State.ROUND_IN_PROGRESS];
// Errors
export const INVALID_TRANSITION = 'INVALID STATE TRANSITION';
export const ERROR_INITIALIZING_GAME_ROUND = 'ERROR_INITIALIZING_GAME_ROUND';
