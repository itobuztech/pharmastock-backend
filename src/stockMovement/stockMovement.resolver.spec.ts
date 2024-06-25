import { Test, TestingModule } from '@nestjs/testing';
import { StockMovementResolver } from './stockMovement.resolver';
import { StockMovementService } from './stockMovement.service';

describe('StockMovementResolver', () => {
  let resolver: StockMovementResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockMovementResolver, StockMovementService],
    }).compile();

    resolver = module.get<StockMovementResolver>(StockMovementResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
