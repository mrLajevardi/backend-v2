import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceItemsController } from './invoice-items.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { InvoiceItemsService } from './invoice-items.service';

describe('InvoiceItemsController', () => {
  let controller: InvoiceItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [InvoiceItemsService],
      controllers: [InvoiceItemsController],
    }).compile();

    controller = module.get<InvoiceItemsController>(InvoiceItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
