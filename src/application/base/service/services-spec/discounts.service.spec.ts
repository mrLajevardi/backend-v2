import { Test, TestingModule } from '@nestjs/testing';
import { DiscountsService } from '../services/discounts.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { DiscountsTableService } from '../../crud/discounts-table/discounts-table.service';

describe('DiscountsService', () => {
  let service: DiscountsService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [DiscountsService, DiscountsTableService],
    }).compile();

    service = module.get<DiscountsService>(DiscountsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
