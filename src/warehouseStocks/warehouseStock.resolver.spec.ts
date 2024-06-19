import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseStockResolver } from './warehouseStock.resolver';
import { WarehouseStockService } from './warehouseStock.service';

describe('WarehouseStockResolver', () => {
  let resolver: WarehouseStockResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WarehouseStockResolver, WarehouseStockService],
    }).compile();

    resolver = module.get<WarehouseStockResolver>(WarehouseStockResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
