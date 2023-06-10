import { Test, TestingModule } from '@nestjs/testing';
import { DiscountsController } from './discounts.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { DiscountsService } from './discounts.service';

describe('DiscountsController', () => {
  let controller: DiscountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [DiscountsService],
      controllers: [DiscountsController],
    }).compile();

    controller = module.get<DiscountsController>(DiscountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
