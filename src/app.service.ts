import { Injectable, Logger } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AppService {
  private logger: Logger = new Logger('AppService');

  getHello(): string {
    return 'Hello World!';
  }

  private hashSeed(seed: string): string {
    return CryptoJS.SHA256(seed).toString();
  }

  generateSeeds(
    genesisSeed: string,
    amount: number,
    logEvery = 1000,
  ): string[] {
    const seedList: string[] = [this.hashSeed(genesisSeed)];

    for (let counter = 0; counter < amount; counter++) {
      const newHash = this.hashSeed(seedList[counter]);

      if (counter % logEvery === 0) {
        this.logger.debug(`${counter} hashes generated`);
      }

      seedList.push(newHash);
    }

    return seedList;
  }

  getGameResult(seed: string, salt: string, houseEdge: number): number {
    const nBits = 52; // number of most significant bits to use
    const hex = CryptoJS.enc.Hex.parse(seed);
    // 1. HMAC_SHA256(key=salt, message=seed)
    const hmac = CryptoJS.HmacSHA256(hex, salt);
    seed = hmac.toString(CryptoJS.enc.Hex);

    // 2. r = 52 most significant bits
    seed = seed.slice(0, nBits / 4);
    const r = parseInt(seed, 16);

    // 3. X = r / 2^52
    let X = r / Math.pow(2, nBits); // uniformly distributed in [0; 1)

    // 4. X = 99 / (1-X)
    X = (100 - houseEdge) / (1 - X);

    // 5. return max(trunc(X), 100)
    const result = Math.floor(X);
    return Math.max(1, result / 100);
  }
}
