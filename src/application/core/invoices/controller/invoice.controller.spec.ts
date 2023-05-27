import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { AclService } from 'src/application/base/acl/acl.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('InvoiceController', () => {
  let controller: InvoiceController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        AclService,
      ],
      controllers: [
        InvoiceController
      ],
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
