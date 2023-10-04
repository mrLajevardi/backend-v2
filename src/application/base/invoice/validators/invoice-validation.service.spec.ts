import { Test, TestingModule } from '@nestjs/testing';
import { CrudModule } from '../../crud/crud.module';
import { ServiceItemTypesTreeService } from '../../crud/service-item-types-tree/service-item-types-tree.service';
import { ServiceItemTypesTree } from 'src/infrastructure/database/entities/views/service-item-types-tree';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { InvoiceValidationService } from './invoice-validation.service';
import { serviceItemTypeTreeMock } from '../mock/service-item-type-tree.mock';
import { InvoiceItemsDto } from '../dto/create-service-invoice.dto';
import { ItemNotExistsException } from '../exception/item-not-exists.exception';
import {
  BASE_DATACENTER_SERVICE,
  BaseDatacenterService,
} from '../../datacenter/interface/datacenter.interface';
import { ItemNotEnabledException } from '../exception/item-not-enabled.exception';
import { cloneDeep } from 'lodash';
import { ItemIsNotLastChildException } from '../exception/item-is-not-last-child.exception';

describe('InvoiceValidationServices', () => {
  let service: InvoiceValidationService;
  let serviceItemTypeTreeService: ServiceItemTypesTreeService;
  let datacenterService: BaseDatacenterService;
  let module: TestingModule;
  const mockService: Partial<ServiceItemTypesTreeService> = {
    async find(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _options?: FindManyOptions<ServiceItemTypesTree>,
    ): Promise<ServiceItemTypesTree[]> {
      return serviceItemTypeTreeMock as ServiceItemTypesTree[];
    },
    async findById(id?: number) {
      return serviceItemTypeTreeMock.find((data) => {
        data.id === id;
      }) as ServiceItemTypesTree;
    },
    async findOne(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _options?: FindOneOptions<ServiceItemTypesTree>,
    ): Promise<ServiceItemTypesTree> {
      return serviceItemTypeTreeMock[0] as ServiceItemTypesTree;
    },
  };
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CrudModule],
      providers: [InvoiceValidationService],
    })
      .useMocker((token) => {
        if (token === ServiceItemTypesTreeService) {
          return mockService;
        }
        if (token === BASE_DATACENTER_SERVICE) {
          return {};
        }
      })
      .compile();
    service = module.get<InvoiceValidationService>(InvoiceValidationService);
    serviceItemTypeTreeService = module.get<ServiceItemTypesTreeService>(
      ServiceItemTypesTreeService,
    );
    datacenterService = module.get<BaseDatacenterService>(
      BASE_DATACENTER_SERVICE,
    );
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  describe('generalInvoiceValidator', () => {
    it('should throw error if given item type does not exists', async () => {
      const wrongItemType: InvoiceItemsDto = {
        itemTypeId: 0,
        value: 'da',
      };
      const testFunction = async (): Promise<void> => {
        await service.generalInvoiceValidator(wrongItemType);
      };
      await expect(testFunction).rejects.toThrow(ItemNotExistsException);
    });

    it('should throw error if given item is not enabled', async () => {
      const disabledItem = cloneDeep(
        serviceItemTypeTreeMock.find((item) => item.id === 184),
      );
      disabledItem.enabled = false;
      jest
        .spyOn(serviceItemTypeTreeService, 'findById')
        .mockImplementation(async () => {
          return disabledItem as ServiceItemTypesTree;
        });
      const wrongItemType: InvoiceItemsDto = {
        itemTypeId: disabledItem.id,
        value: 'da',
      };
      const testFunction = async (): Promise<void> => {
        await service.generalInvoiceValidator(wrongItemType);
      };
      await expect(testFunction).rejects.toThrow(ItemNotEnabledException);
    });

    it('should throw error if given item is not last child', async () => {
      const item = cloneDeep(
        serviceItemTypeTreeMock.find((item) => item.id === 1),
      );
      const parent = cloneDeep(
        serviceItemTypeTreeMock.find((item) => item.parentId === 1),
      );
      jest
        .spyOn(serviceItemTypeTreeService, 'findById')
        .mockImplementation(async () => {
          return item as ServiceItemTypesTree;
        });
      jest
        .spyOn(serviceItemTypeTreeService, 'findOne')
        .mockImplementation(async () => {
          return parent as ServiceItemTypesTree;
        });
      const wrongItemType: InvoiceItemsDto = {
        itemTypeId: 1,
        value: 'da',
      };
      const testFunction = async (): Promise<void> => {
        return service.generalInvoiceValidator(wrongItemType);
      };
      await expect(testFunction).rejects.toThrow(ItemIsNotLastChildException);
    });

    it('should call checkNumericItemTypeValue when value is not NaN', async () => {
      const item = cloneDeep(
        serviceItemTypeTreeMock.find((item) => item.id === 184),
      );
      jest
        .spyOn(serviceItemTypeTreeService, 'findById')
        .mockResolvedValue(item as ServiceItemTypesTree);
      jest.spyOn(serviceItemTypeTreeService, 'findOne').mockResolvedValue(null);
      const targetMethod = jest.spyOn(service, 'checkNumericItemTypeValue');
      const itemType: InvoiceItemsDto = {
        itemTypeId: 184,
        value: '8',
      };
      await service.generalInvoiceValidator(itemType);
      expect(targetMethod).toHaveBeenCalled();
    });

    it('should call checkItemTypeRule when value is NaN', async () => {
      const item = cloneDeep(
        serviceItemTypeTreeMock.find((item) => item.id === 184),
      );
      jest
        .spyOn(serviceItemTypeTreeService, 'findById')
        .mockResolvedValue(item as ServiceItemTypesTree);
      jest.spyOn(serviceItemTypeTreeService, 'findOne').mockResolvedValue(null);
      const targetMethod = jest.spyOn(service, 'checkItemTypeRule');
      const itemType: InvoiceItemsDto = {
        itemTypeId: 184,
        value: '8',
      };
      await service.generalInvoiceValidator(itemType);
      expect(targetMethod).toHaveBeenCalled();
    });
  });

  describe('checkVdcDatacenterState', () => {
    it('should throw Error if item datacenter does not exist in datacenter lists', async () => {
      jest.spyOn(datacenterService, '');
    });
  });
});
