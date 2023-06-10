import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceDiscountsController } from './invoice-discounts.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { InvoiceDiscountsService } from './invoice-discounts.service';

describe('InvoiceDiscountsController', () => {
  let controller: InvoiceDiscountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [InvoiceDiscountsService],
      controllers: [InvoiceDiscountsController],
    }).compile();

    controller = module.get<InvoiceDiscountsController>(
      InvoiceDiscountsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
