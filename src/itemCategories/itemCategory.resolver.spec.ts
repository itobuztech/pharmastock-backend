import { Test, TestingModule } from '@nestjs/testing';
import { ItemCategoryResolver } from './itemCategory.resolver';
import { ItemCategoryService } from './itemCategory.service';

describe('ItemCategoryResolver', () => {
  let resolver: ItemCategoryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemCategoryResolver, ItemCategoryService],
    }).compile();

    resolver = module.get<ItemCategoryResolver>(ItemCategoryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
