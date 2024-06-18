import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseResolver } from './warehouse.resolver';
import { WarehouseService } from './warehouse.service';

describe('WarehouseResolver', () => {
  let resolver: WarehouseResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WarehouseResolver, WarehouseService],
    }).compile();

    resolver = module.get<WarehouseResolver>(WarehouseResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
