import { Test, TestingModule } from '@nestjs/testing';
import { CrudModule } from '../../crud/crud.module';
import { InvoiceFactoryService } from './invoice-factory.service';
import { ServiceItemTypesTreeService } from '../../crud/service-item-types-tree/service-item-types-tree.service';
import { ServiceItemTypesTree } from 'src/infrastructure/database/entities/views/service-item-types-tree';
import { FindManyOptions } from 'typeorm';

describe('InvoicesFactoryService', () => {
  let service: InvoiceFactoryService;
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
  //   beforeEach(async () => {});

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', async () => {
    module = await Test.createTestingModule({
      imports: [CrudModule],
      providers: [
        InvoiceFactoryService,
        {
          provide: ServiceItemTypesTreeService,
          useValue: serviceTypeTreeMockGenerator({}),
        },
      ],
    }).compile();

    service = module.get<InvoiceFactoryService>(InvoiceFactoryService);
    expect(service).toBeDefined();
  });

  it('should return correct result', async () => {
    const mockData: ServiceItemTypesTree[] = [{
        code: 
    }];
    module = await Test.createTestingModule({
      imports: [CrudModule],
      providers: [
        InvoiceFactoryService,
        {
          provide: ServiceItemTypesTreeService,
          useValue: serviceTypeTreeMockGenerator({}),
        },
      ],
    }).compile();

    service = module.get<InvoiceFactoryService>(InvoiceFactoryService);
  });
});
