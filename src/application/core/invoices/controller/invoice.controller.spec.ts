import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { TestDBProviders } from 'src/infrastructure/test-utils/providers';
import { AclService } from 'src/application/base/acl/acl.service';

describe('InvoiceController', () => {
  let controller: InvoiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestDBProviders.aclProvider,
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
