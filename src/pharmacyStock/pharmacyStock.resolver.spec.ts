import { Test, TestingModule } from '@nestjs/testing';
import { PharmacyStockResolver } from './pharmacyStock.resolver';
import { PharmacyStockService } from './pharmacyStock.service';

describe('PharmacyStockResolver', () => {
  let resolver: PharmacyStockResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PharmacyStockResolver, PharmacyStockService],
    }).compile();

    resolver = module.get<PharmacyStockResolver>(PharmacyStockResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
