import { Test, TestingModule } from '@nestjs/testing';
import { InvoicePropertiesController } from './invoice-properties.controller';

describe('InvoicePropertiesController', () => {
  let controller: InvoicePropertiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicePropertiesController],
    }).compile();

    controller = module.get<InvoicePropertiesController>(InvoicePropertiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
