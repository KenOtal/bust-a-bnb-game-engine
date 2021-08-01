import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  describe('should always return the correct game crash multiplier', () => {
    const salt =
      '0000000000000000004d6ec16dafe9d8370958664c1dc422f452892264c59526';

    it('returns correct value with low multiplier', () => {
      const expectedResult = 1.3;
      const seed =
        'a3ed38cf229845070d3151b57115d2b76470067134ed1af49a51b187b0235590';
      const result = service.getGameResult(seed, salt, 1);
      expect(result).toBe(expectedResult);
    });

    it('returns correct value with high multiplier', () => {
      const expectedResult = 133.13;
      const seed =
        'c026372cac27e731cdc340051281f76b404c9353a143fa5aa543e2415c72a306';
      const result = service.getGameResult(seed, salt, 1);
      expect(result).toBe(expectedResult);
    });

    it('returns correct value with medium multiplier', () => {
      const expectedResult = 16.14;
      const seed =
        'f83b730e04121bc767818ec8dc6ed7da2b24fd798401a184861e1f29850bb1ce';
      const result = service.getGameResult(seed, salt, 1);
      expect(result).toBe(expectedResult);
    });
  });

  describe('generateSeeds, hashSeed', () => {
    it('generates seeds', () => {
      const seed =
        'f83b730e04121bc767818ec8dc6ed7da2b24fd798401a184861e1f29850bb1ce';
      const result = service.generateSeeds(seed, 0);
      const expectedResult = [
        '762c9141f5d4a1daaf000a9c8e5412baa19954a5c5ff338e11db3b37c104248e',
      ];
      expect(result).toEqual(expect.arrayContaining(expectedResult));
    });
  });
});
