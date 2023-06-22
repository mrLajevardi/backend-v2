import { Test, TestingModule } from '@nestjs/testing';
import { DiscountsService } from './discounts.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { DiscountsTableService } from '../../crud/discounts-table/discounts-table.service';

describe('DiscountsService', () => {
  let service: DiscountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        DiscountsService,
        DiscountsTableService
      ],
    }).compile();

    service = module.get<DiscountsService>(DiscountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
