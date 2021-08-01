"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const CryptoJS = require("crypto-js");
let AppService = class AppService {
    constructor() {
        this.logger = new common_1.Logger('AppService');
    }
    getHello() {
        return 'Hello World!';
    }
    hashSeed(seed) {
        return CryptoJS.SHA256(seed).toString();
    }
    generateSeeds(genesisSeed, amount, logEvery = 1000) {
        const seedList = [this.hashSeed(genesisSeed)];
        for (let counter = 0; counter < amount; counter++) {
            const newHash = this.hashSeed(seedList[counter]);
            if (counter % logEvery === 0) {
                this.logger.debug(`${counter} hashes generated`);
            }
            seedList.push(newHash);
        }
        return seedList;
    }
    getGameResult(seed, salt, houseEdge) {
        const nBits = 52;
        const hex = CryptoJS.enc.Hex.parse(seed);
        const hmac = CryptoJS.HmacSHA256(hex, salt);
        seed = hmac.toString(CryptoJS.enc.Hex);
        seed = seed.slice(0, nBits / 4);
        const r = parseInt(seed, 16);
        let X = r / Math.pow(2, nBits);
        X = (100 - houseEdge) / (1 - X);
        const result = Math.floor(X);
        return Math.max(1, result / 100);
    }
};
AppService = __decorate([
    common_1.Injectable()
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map