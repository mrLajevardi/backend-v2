import { Test, TestingModule } from '@nestjs/testing';
import { DiscountsTableService } from './discounts-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('DiscountsTableService', () => {
  let service: DiscountsTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [DiscountsTableService, TestDataService],
    }).compile();

    service = module.get<DiscountsTableService>(DiscountsTableService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
