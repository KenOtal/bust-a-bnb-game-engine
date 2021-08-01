export declare class AppService {
    private logger;
    getHello(): string;
    private hashSeed;
    generateSeeds(genesisSeed: string, amount: number, logEvery?: number): string[];
    getGameResult(seed: string, salt: string, houseEdge: number): number;
}
