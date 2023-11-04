import { Test, TestingModule } from '@nestjs/testing';
import { CrudModule } from '../../crud/crud.module';
import { ServiceItemTypesTreeService } from '../../crud/service-item-types-tree/service-item-types-tree.service';
import { ServiceItemTypesTree } from 'src/infrastructure/database/entities/views/service-item-types-tree';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { InvoiceValidationService } from './invoice-validation.service';
import { serviceItemTypeTreeMock } from '../mock/service-item-type-tree.mock';
import {
  CreateServiceInvoiceDto,
  InvoiceItemsDto,
} from '../dto/create-service-invoice.dto';
import { ItemNotExistsException } from '../exception/item-not-exists.exception';
import {
  BASE_DATACENTER_SERVICE,
  BaseDatacenterService,
} from '../../datacenter/interface/datacenter.interface';
import { ItemNotEnabledException } from '../exception/item-not-enabled.exception';
import { cloneDeep } from 'lodash';
import { ItemIsNotLastChildException } from '../exception/item-is-not-last-child.exception';
import { DatacenterConfigGenResultDto } from '../../datacenter/dto/datacenter-config-gen.result.dto';
import { InvalidDatacenterException } from '../exception/invalid-datacenter.exception';
import { DatacenterModule } from '../../datacenter/datacenter.module';
import { InvalidGenerationException } from '../exception/invalid-generation.exception';
import { NotInRangeException } from '../exception/not-in-range.exception';
import { InsufficientResourceException } from '../exception/insufficient-resources.exception';
import { NotCompatibleWithStepException } from '../exception/not-compatible-step.exception';
import { ServiceItemsSumService } from '../../crud/service-items-sum/service-items-sum.service';
import { InvoiceItemLimits } from '../enum/invoice-item-limits.enum';
import { NotCompatibleWithRuleException } from '../exception/not-compatible-with-rule.exception';
import { VdcParentType } from '../interface/vdc-item-parent-type.interface';
import { InvalidInvoiceItemsException } from '../exception/invalid-invoice-items.exception';
import { ServicePlanTypeEnum } from '../../service/enum/service-plan-type.enum';
import { InvoiceTypes } from '../enum/invoice-type.enum';
import { RequiredGenerationItemNotSatisfiedException } from '../exception/required-generation-item.exception';
import { RequiredItemNotSatisfiedException } from '../exception/required-items.exception';

describe('InvoiceValidationServices', () => {
  let service: InvoiceValidationService;
  let serviceItemTypeTreeService: ServiceItemTypesTreeService;
  let datacenterService: BaseDatacenterService;
  let serviceItemsSumService: ServiceItemsSumService;
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
        console.log('🍳');
        return data.id === id;
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
      imports: [CrudModule, DatacenterModule],
      providers: [InvoiceValidationService],
    })
      .useMocker((token) => {
        console.log(token);
        if (token === ServiceItemTypesTreeService) {
          return mockService;
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
    serviceItemsSumService = module.get<ServiceItemsSumService>(
      ServiceItemsSumService,
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
      const result: DatacenterConfigGenResultDto[] = [
        {
          datacenter: 'asia',
          gens: [{ id: '1234', name: 'g1' }],
          title: 'asia',
        },
      ];
      jest
        .spyOn(datacenterService, 'getDatacenterConfigWithGen')
        .mockResolvedValue(result);
      const testFunction = async (): Promise<void> => {
        return service.checkVdcDatacenterState('amin', 'g1');
      };
      await expect(testFunction).rejects.toThrow(InvalidDatacenterException);
    });

    it('should throw Error if item generation does not exist in generations list', async () => {
      const result: DatacenterConfigGenResultDto[] = [
        {
          datacenter: 'amin',
          gens: [{ id: '1234', name: 'g2' }],
          title: 'amin',
        },
      ];
      jest
        .spyOn(datacenterService, 'getDatacenterConfigWithGen')
        .mockResolvedValue(result);
      const testFunction = async (): Promise<void> => {
        return service.checkVdcDatacenterState('amin', 'g1');
      };
      await expect(testFunction).rejects.toThrow(InvalidGenerationException);
    });
  });

  describe('checkNumericItemTypeValue', () => {
    it('should throw NotInRangeException if value is higher than item max', async () => {
      const itemType = cloneDeep(
        serviceItemTypeTreeMock.find((item) => item.id === 184),
      );
      const invoiceItemType = {
        itemTypeId: 184,
        value: '19',
      };
      const testFunction = async (): Promise<void> => {
        return service.checkNumericItemTypeValue(
          invoiceItemType,
          itemType as ServiceItemTypesTree,
        );
      };
      await expect(testFunction).rejects.toThrow(NotInRangeException);
    });

    it('should throw NotInRangeException if value is lower than item min', async () => {
      const itemType = cloneDeep(
        serviceItemTypeTreeMock.find((item) => item.id === 184),
      );
      const invoiceItemType = {
        itemTypeId: 184,
        value: '7',
      };
      const testFunction = async (): Promise<void> => {
        return service.checkNumericItemTypeValue(
          invoiceItemType,
          itemType as ServiceItemTypesTree,
        );
      };
      await expect(testFunction).rejects.toThrow(NotInRangeException);
    });

    it('should throw InsufficientResourceException if value is higher than item maxAvailable', async () => {
      jest
        .spyOn(serviceItemsSumService, 'findOne')
        .mockResolvedValue({ id: 'vdc', sum: 1 });
      const itemType = cloneDeep(
        serviceItemTypeTreeMock.find((item) => item.id === 184),
      );
      itemType.maxAvailable = 0;
      const invoiceItemType = {
        itemTypeId: 184,
        value: '9',
      };
      const testFunction = async (): Promise<void> => {
        return service.checkNumericItemTypeValue(
          invoiceItemType,
          itemType as ServiceItemTypesTree,
        );
      };
      await expect(testFunction).rejects.toThrow(InsufficientResourceException);
    });

    it('should throw NotCompatibleWithStepException If the remainder of dividing value by step is not zero', async () => {
      const itemType = cloneDeep(
        serviceItemTypeTreeMock.find((item) => item.id === 184),
      );
      itemType.step = 5;
      const invoiceItemType = {
        itemTypeId: 184,
        value: '13',
      };
      const testFunction = async (): Promise<void> => {
        return service.checkNumericItemTypeValue(
          invoiceItemType,
          itemType as ServiceItemTypesTree,
        );
      };
      await expect(testFunction).rejects.toThrow(
        NotCompatibleWithStepException,
      );
    });

    it('should not throw NotInRangeException if item min is unlimited', async () => {
      const itemType = cloneDeep(
        serviceItemTypeTreeMock.find((item) => item.id === 184),
      );
      itemType.minPerRequest = InvoiceItemLimits.UnlimitedMinValue;
      const invoiceItemType = {
        itemTypeId: 184,
        value: '-1',
      };
      const result = await service.checkNumericItemTypeValue(
        invoiceItemType,
        itemType as ServiceItemTypesTree,
      );
      expect(result).toBeUndefined();
    });

    it('should not throw NotInRangeException if item max is unlimited', async () => {
      const itemType = cloneDeep(
        serviceItemTypeTreeMock.find((item) => item.id === 184),
      );
      itemType.maxPerRequest = InvoiceItemLimits.UnlimitedMaxValue;
      const invoiceItemType = {
        itemTypeId: 184,
        value: '1000',
      };
      const result = await service.checkNumericItemTypeValue(
        invoiceItemType,
        itemType as ServiceItemTypesTree,
      );
      expect(result).toBeUndefined();
    });

    it('should not throw InsufficientResourceException if item maxAvailable is unlimited', async () => {
      jest
        .spyOn(serviceItemsSumService, 'findOne')
        .mockResolvedValue({ id: 'vdc', sum: 1 });
      const itemType = cloneDeep(
        serviceItemTypeTreeMock.find((item) => item.id === 184),
      );
      itemType.maxPerRequest = InvoiceItemLimits.UnlimitedMaxAvailableValue;
      const invoiceItemType = {
        itemTypeId: 184,
        value: '1000',
      };
      const result = await service.checkNumericItemTypeValue(
        invoiceItemType,
        itemType as ServiceItemTypesTree,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('checkItemTypeRule', () => {
    it('should throw NotCompatibleWithRuleException if value does not match rule', async () => {
      const itemType = cloneDeep(
        serviceItemTypeTreeMock.find((item) => item.id === 184),
      );
      itemType.rule = '^test$';
      const invoiceItemType = {
        itemTypeId: 184,
        value: 'string',
      };
      const testFunction = async (): Promise<void> => {
        return service.checkItemTypeRule(
          invoiceItemType,
          itemType as ServiceItemTypesTree,
        );
      };
      await expect(testFunction).rejects.toThrow(
        NotCompatibleWithRuleException,
      );
    });
  });

  describe('checkItemsHasSameParents', () => {
    it('should throw InvalidInvoiceItemsException if items have different parents', async () => {
      const mock: VdcParentType = {
        generation: ['1_2_3_4', '1_10_11'],
        cpuReservation: [],
        guaranty: [],
        period: [],
        memoryReservation: [],
      };
      const testFunction = async (): Promise<void> => {
        return service.checkItemsHasSameParents(mock);
      };
      await expect(testFunction).rejects.toThrow(InvalidInvoiceItemsException);
    });

    it('should return undefined if items have same parents', async () => {
      const mock: VdcParentType = {
        generation: ['1_2_3_4', '1_2_11'],
        cpuReservation: [],
        guaranty: [],
        period: [],
        memoryReservation: [],
      };
      const result = await service.checkItemsHasSameParents(mock);
      expect(result).toBeUndefined();
    });
  });

  describe('compareVdcDefaultGeneration', () => {
    it('should throw RequiredGenerationItemNotSatisfiedException when all default items not provided', async () => {
      jest
        .spyOn(serviceItemTypeTreeService, 'findById')
        .mockImplementation(async (id: number) => {
          return cloneDeep(
            serviceItemTypeTreeMock.find((item) => item.id === id),
          ) as ServiceItemTypesTree;
        });
      let items = cloneDeep(
        serviceItemTypeTreeMock.filter((item) => {
          return [184, 183, 127, 1].includes(item.id);
        }),
      ) as ServiceItemTypesTree[];
      jest
        .spyOn(serviceItemTypeTreeService, 'find')
        .mockResolvedValueOnce(items);
      items = cloneDeep(
        serviceItemTypeTreeMock.filter((item) => {
          return item.id === 43;
        }),
      ) as ServiceItemTypesTree[];
      console.log(items, '🍜');
      jest
        .spyOn(serviceItemTypeTreeService, 'find')
        .mockResolvedValueOnce(items);
      const testFunction = async (): Promise<void> => {
        return service.compareVdcDefaultGeneration(['184_183_127_1']);
      };
      await expect(testFunction).rejects.toThrow(
        RequiredGenerationItemNotSatisfiedException,
      );
    });
  });

  describe('compareWithVdcDefaultService', () => {
    it('should throw RequiredItemNotSatisfiedException if default items not provided', async () => {
      jest
        .spyOn(service, 'compareVdcDefaultGeneration')
        .mockResolvedValue(undefined);
      jest.spyOn(serviceItemTypeTreeService, 'find').mockResolvedValueOnce([]);
      const items = cloneDeep(
        serviceItemTypeTreeMock.filter((item) => {
          return item.id === 214;
        }),
      ) as ServiceItemTypesTree[];
      jest
        .spyOn(serviceItemTypeTreeService, 'find')
        .mockResolvedValueOnce(items);
      const testFunction = async (): Promise<void> => {
        return service.compareWithVdcDefaultService({
          cpuReservation: [],
          generation: [],
          memoryReservation: [],
          guaranty: [],
          period: [],
        });
      };
      await expect(testFunction).rejects.toThrow(
        RequiredItemNotSatisfiedException,
      );
    });
  });

  describe('vdcInvoiceValidator', () => {
    it('should call checkVdcDatacenterState if there is generation item', async () => {
      jest
        .spyOn(serviceItemTypeTreeService, 'findById')
        .mockImplementation(async (id: number) => {
          const t = cloneDeep(
            serviceItemTypeTreeMock.find((item) => item.id === id),
          ) as ServiceItemTypesTree;
          console.log(t, '🍕');
          return t;
        });
      const checkVdcDatacenterState = jest
        .spyOn(service, 'checkVdcDatacenterState')
        .mockResolvedValue(undefined);
      jest
        .spyOn(service, 'compareVdcDefaultGeneration')
        .mockResolvedValue(undefined);
      jest
        .spyOn(service, 'checkItemsHasSameParents')
        .mockReturnValue(undefined);
      jest
        .spyOn(service, 'generalInvoiceValidator')
        .mockResolvedValue(undefined);
      const invoice: CreateServiceInvoiceDto = {
        itemsTypes: [
          { itemTypeId: 184, value: '8' },
          { itemTypeId: 153, value: '8' },
        ],
        serviceInstanceId: null,
        servicePlanTypes: ServicePlanTypeEnum.Static,
        type: InvoiceTypes.Create,
      };
      await service.vdcInvoiceValidator(invoice);
      expect(checkVdcDatacenterState).toHaveBeenCalledTimes(2);
    });
  });
});
