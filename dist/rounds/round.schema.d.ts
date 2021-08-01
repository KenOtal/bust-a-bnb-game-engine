import { Document } from 'mongoose';
export declare type RoundHistoryDocument = RoundHistory & Document;
export interface IRoundHistory {
    type: string;
    timestamp: number;
    roundNumber: number;
    seed: string;
    salt: string;
    genesisSeed: string;
    houseEdge: number;
}
export declare class RoundHistory {
    type: string;
    timestamp: number;
    roundNumber: number;
    seed: string;
    salt: string;
    genesisSeed: string;
    houseEdge: number;
}
export declare const RoundHistorySchema: import("mongoose").Schema<Document<RoundHistory, any>, import("mongoose").Model<any, any, any>, undefined>;
