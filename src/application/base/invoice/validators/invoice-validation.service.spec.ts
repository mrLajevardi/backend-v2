import { Test, TestingModule } from '@nestjs/testing';
import { CrudModule } from '../../crud/crud.module';
import { ServiceItemTypesTreeService } from '../../crud/service-item-types-tree/service-item-types-tree.service';
import { ServiceItemTypesTree } from 'src/infrastructure/database/entities/views/service-item-types-tree';
import { FindManyOptions } from 'typeorm';
import { InvoiceValidationService } from './invoice-validation.service';
import { serviceItemTypeTreeMock } from '../mock/service-item-type-tree.mock';
import { InvoiceItemsDto } from '../dto/create-service-invoice.dto';

describe('InvoiceValidationServices', () => {
  let service: InvoiceValidationService;
  let module: TestingModule;
  function serviceTypeTreeMockGenerator(
    mockData: ServiceItemTypesTree[],
  ): Partial<ServiceItemTypesTreeService> {
    const mockService: Partial<ServiceItemTypesTreeService> = {
      async find(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _options?: FindManyOptions<ServiceItemTypesTree>,
      ): Promise<ServiceItemTypesTree[]> {
        return mockData;
      },
    };
    return mockService;
  }
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CrudModule],
      providers: [
        InvoiceValidationService,
        {
          provide: ServiceItemTypesTreeService,
          useValue: serviceTypeTreeMockGenerator(serviceItemTypeTreeMock),
        },
      ],
    }).compile();

    service = module.get<InvoiceValidationService>(InvoiceValidationService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  describe('generalInvoiceValidator', () => {
    it('should throw error if given item type does not exists', () => {
      const wrongItemType: InvoiceItemsDto = {
        itemTypeId: 0,
        value: 'da',
      };
      expect(service.generalInvoiceValidator(wrongItemType)).toThrowError();
    });
  });
});
