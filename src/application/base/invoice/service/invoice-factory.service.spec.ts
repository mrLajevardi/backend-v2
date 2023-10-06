import { Test, TestingModule } from '@nestjs/testing';
import { CrudModule } from '../../crud/crud.module';
import { InvoiceFactoryService } from './invoice-factory.service';
import { ServiceItemTypesTreeService } from '../../crud/service-item-types-tree/service-item-types-tree.service';
import { ServiceItemTypesTree } from 'src/infrastructure/database/entities/views/service-item-types-tree';
import { FindManyOptions } from 'typeorm';
import { CreateServiceInvoiceDto } from '../dto/create-service-invoice.dto';
import { InvoiceTypes } from '../enum/invoice-type.enum';
import { ServicePlanTypeEnum } from '../../service/enum/service-plan-type.enum';
import { TotalInvoiceItemCosts } from '../interface/invoice-item-cost.interface';
import { VdcItemGroup } from '../interface/vdc-item-group.interface.dto';
import { addMonths } from 'src/infrastructure/helpers/date-time.helper';
import { CreateInvoicesDto } from '../../crud/invoices-table/dto/create-invoices.dto';

describe('InvoicesFactoryService', () => {
  let service: InvoiceFactoryService;
  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CrudModule],
      providers: [InvoiceFactoryService],
    }).compile();

    service = module.get<InvoiceFactoryService>(InvoiceFactoryService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });
  describe('createInvoiceDto', () => {
    it('should return correct result', () => {
      const random = jest
        .spyOn(global.Math, 'random')
        .mockReturnValue(0.123456789);
      const data: CreateServiceInvoiceDto = {
        itemsTypes: [],
        serviceInstanceId: null,
        type: InvoiceTypes.Create,
        servicePlanTypes: ServicePlanTypeEnum.Static,
      };
      const invoiceCost: TotalInvoiceItemCosts = {
        itemsSum: [],
        itemsTotalCosts: 13,
        totalCost: 19,
      };
      const groupedItems: VdcItemGroup = {
        generation: {
          ip: [{ serviceTypeId: 'vdc' }],
        },
        period: { value: '6' },
      } as VdcItemGroup;
      const result = service.createInvoiceDto(
        12,
        data,
        invoiceCost,
        groupedItems,
        null,
      );
      const correctResult: CreateInvoicesDto = {
        userId: 12,
        servicePlanType: data.servicePlanTypes,
        rawAmount: invoiceCost.totalCost,
        finalAmount: invoiceCost.totalCost,
        type: data.type,
        endDateTime: addMonths(new Date(), 6),
        dateTime: new Date(),
        serviceTypeId: 'vdc',
        name: 'invoice' + Math.floor(Math.random() * 100),
        planAmount: 0,
        planRatio: 0,
        payed: false,
        voided: false,
        serviceInstanceId: null,
        description: '',
      };
      random.mockRestore();
      expect(result).toStrictEqual(correctResult);
    });
  });

  describe('groupVdcItems', () => {
    it('should return correct result', async () => {
      
    });
  });
  // it('should return correct result', async () => {
  //   const mockData: ServiceItemTypesTree[] = [{
  //       code:
  //   }];
  //   module = await Test.createTestingModule({
  //     imports: [CrudModule],
  //     providers: [
  //       InvoiceFactoryService,
  //       {
  //         provide: ServiceItemTypesTreeService,
  //         useValue: serviceTypeTreeMockGenerator({}),
  //       },
  //     ],
  //   }).compile();

  //   service = module.get<InvoiceFactoryService>(InvoiceFactoryService);
  // });
});
