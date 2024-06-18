import { Test, TestingModule } from '@nestjs/testing';
import { PharmacyResolver } from './pharmacy.resolver';
import { PharmacyService } from './pharmacy.service';

describe('PharmacyResolver', () => {
  let resolver: PharmacyResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PharmacyResolver, PharmacyService],
    }).compile();

    resolver = module.get<PharmacyResolver>(PharmacyResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
