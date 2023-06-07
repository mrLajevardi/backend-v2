import { Test, TestingModule } from '@nestjs/testing';
import { InvoicePropertiesController } from './invoice-properties.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { InvoicePropertiesService } from './invoice-properties.service';

describe('InvoicePropertiesController', () => {
  let controller: InvoicePropertiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      controllers: [InvoicePropertiesController],
      providers: [InvoicePropertiesService],
    }).compile();

    controller = module.get<InvoicePropertiesController>(
      InvoicePropertiesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
