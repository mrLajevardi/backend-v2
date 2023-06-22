import { Test, TestingModule } from '@nestjs/testing';
import { InvoicePlansController } from './invoice-plans.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { InvoicePlansService } from './invoice-plans.service';

describe('InvoicePlansController', () => {
  let controller: InvoicePlansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [InvoicePlansService],
      controllers: [InvoicePlansController],
    }).compile();

    controller = module.get<InvoicePlansController>(InvoicePlansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
