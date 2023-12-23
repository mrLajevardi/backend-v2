import { Test, TestingModule } from '@nestjs/testing';
import { DatacenterService } from './datacenter.service';
import { DatacenterTableModule } from '../../crud/datacenter-table/datacenter-table.module';
import { MainWrapperModule } from 'src/wrappers/main-wrapper/main-wrapper.module';
import { SessionsModule } from '../../sessions/sessions.module';
import { mockDatacenterMetadata } from '../mock/datacenter-metadata.mock';
import { AdminVdcWrapperService } from 'src/wrappers/main-wrapper/service/admin/vdc/admin-vdc-wrapper.service';
import { GetProviderVdcsDto } from 'src/wrappers/main-wrapper/service/admin/vdc/dto/get-provider-vdcs.dto';
import { GetProviderVdcsParams } from 'src/wrappers/vcloud-wrapper/services/admin/vdc/dto/get-provider-vdcs.dto';
import { mockProviderVdcs } from '../mock/providers-vdcs.mock';
import { GetProviderVdcsMetadataDto } from 'src/wrappers/main-wrapper/service/admin/vdc/dto/get-provider-vdcs-metadata.dto';
import { SessionsService } from '../../sessions/sessions.service';
import { cloneDeep } from 'lodash';
import { DatacenterFactoryService } from './datacenter.factory.service';
import { DatacenterConfigGenResultDto } from '../dto/datacenter-config-gen.result.dto';
import { FoundDatacenterMetadata } from '../dto/found-datacenter-metadata';
import { DatacenterDetails } from '../dto/datacenter-details.dto';
import { CrudModule } from '../../crud/crud.module';
import { DatabaseModule } from '@faker-js/faker';
import { DatacenterAdminService } from './datacenter.admin.service';
import { forwardRef } from '@nestjs/common';
import { InvoicesModule } from '../../invoice/invoices.module';
import { ServiceItemTypesTreeModule } from '../../crud/service-item-types-tree/service-item-types-tree.module';

describe('DatacenterService', () => {
  let service: DatacenterService;
  let module: TestingModule;

  function datacenterMetadataMockFactory(
    datacenter: string | null,
    generation: string | null,
    title: string | null,
    cpuSpeed: string | null,
    location: string | null,
    enabled: boolean | null,
  ): FoundDatacenterMetadata {
    return {
      datacenter,
      generation,
      datacenterTitle: title,
      cpuSpeed: cpuSpeed,
      location,
      enabled,
    };
  }
  function createWrapperMockService(
    mockProviderVdcs: GetProviderVdcsDto,
    mockDatacenterMetadata: GetProviderVdcsMetadataDto,
  ): Partial<AdminVdcWrapperService> {
    const mockAdminWrapperService: Partial<AdminVdcWrapperService> = {
      async getProviderVdcs(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _authToken: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _params: GetProviderVdcsParams,
      ): Promise<GetProviderVdcsDto> {
        return mockProviderVdcs;
      },
      async getProviderVdcMetadata(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _authToken: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _providerVdcId: string,
      ): Promise<GetProviderVdcsMetadataDto> {
        return mockDatacenterMetadata;
      },
    };
    return mockAdminWrapperService;
  }

  const mockSessionService: Partial<SessionsService> = {
    async checkAdminSession(): Promise<string> {
      return 'session';
    },
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatacenterTableModule,
        MainWrapperModule,
        SessionsModule,
        CrudModule,
        forwardRef(() => InvoicesModule),
        ServiceItemTypesTreeModule,
      ],
      providers: [
        DatacenterService,
        DatacenterFactoryService,
        DatacenterAdminService,
        {
          provide: AdminVdcWrapperService,
          useValue: createWrapperMockService(
            mockProviderVdcs,
            mockDatacenterMetadata,
          ),
        },
        {
          provide: SessionsService,
          useValue: mockSessionService,
        },
      ],
    }).compile();
    service = module.get<DatacenterService>(DatacenterService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('findTargetMetadata', () => {
  //   it('should return a correct object', async () => {
  //     const targetMetadata = service.findTargetMetadata(mockDatacenterMetadata);
  //     const correctObject = datacenterMetadataMockFactory(
  //       'amin',
  //       'g1',
  //       'امین',
  //       '2000',
  //       'ایران',
  //       true,
  //     );
  //     expect(targetMetadata).toStrictEqual(correctObject);
  //   });

  //   it('should return an object with null values with wrong key', async () => {
  //     const wrongMock = cloneDeep(mockDatacenterMetadata);
  //     wrongMock.metadataEntry[0].key = 'datacenterr';
  //     console.log(mockDatacenterMetadata.metadataEntry[0]);
  //     const targetMetadata = service.findTargetMetadata(wrongMock);
  //     const correctObject = datacenterMetadataMockFactory(
  //       null,
  //       'g1',
  //       'امین',
  //       '2000',
  //       'ایران',
  //       true,
  //     );
  //     expect(targetMetadata).toStrictEqual(correctObject);
  //   });

  //   it('should return an object with null values with empty metaEntry Array', async () => {
  //     const wrongMock = cloneDeep(mockDatacenterMetadata);
  //     wrongMock.metadataEntry = [];
  //     const targetMetadata = service.findTargetMetadata(wrongMock);
  //     const correctObject = datacenterMetadataMockFactory(
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //     );
  //     expect(targetMetadata).toStrictEqual(correctObject);
  //   });

  //   it('should not return a correct object with wrong key', async () => {
  //     const wrongMock = cloneDeep(mockDatacenterMetadata);
  //     wrongMock.metadataEntry = [];
  //     const targetMetadata = service.findTargetMetadata(wrongMock);
  //     const correctObject = datacenterMetadataMockFactory(
  //       'amin',
  //       'g1',
  //       'امین',
  //       '2000',
  //       'ایران',
  //       true,
  //     );
  //     expect(targetMetadata).not.toStrictEqual(correctObject);
  //   });
  // });

  // describe('getDatacenterConfigWithGen', () => {
  //   it('should return correct result with correct providerVdcList and metadata', async () => {
  //     const result = await service.getDatacenterConfigWithGen();
  //     const correctResult: DatacenterConfigGenResultDto[] = [
  //       {
  //         datacenter: 'amin',
  //         location: 'ایران',
  //         title: 'امین',
  //         gens: [
  //           {
  //             name: 'g1',
  //             id: mockProviderVdcs.values[0].id,
  //           },
  //         ],
  //       },
  //     ];
  //     expect(result).toStrictEqual(correctResult);
  //   });
  //   it('should return correct result with wrong metadata', async () => {
  //     const wrongMetadataMock = cloneDeep(mockDatacenterMetadata);
  //     wrongMetadataMock.metadataEntry[0].key = 'datacent';
  //     module = await Test.createTestingModule({
  //       imports: [
  //         DatacenterTableModule,
  //         MainWrapperModule,
  //         SessionsModule,
  //         CrudModule,
  //         forwardRef(() => InvoicesModule),
  //       ],
  //       providers: [
  //         DatacenterService,
  //         DatacenterFactoryService,
  //         DatacenterAdminService,
  //         {
  //           provide: AdminVdcWrapperService,
  //           useValue: createWrapperMockService(
  //             mockProviderVdcs,
  //             wrongMetadataMock,
  //           ),
  //         },
  //         {
  //           provide: SessionsService,
  //           useValue: mockSessionService,
  //         },
  //       ],
  //     }).compile();
  //     service = module.get<DatacenterService>(DatacenterService);
  //     const result = await service.getDatacenterConfigWithGen();
  //     const correctResult = [];
  //     expect(result).toStrictEqual(correctResult);
  //   });

  //   it('should return correct result with empty metadata', async () => {
  //     const emptyMetadataMock = cloneDeep(mockDatacenterMetadata);
  //     emptyMetadataMock.metadataEntry = [];
  //     module = await Test.createTestingModule({
  //       imports: [
  //         DatacenterTableModule,
  //         MainWrapperModule,
  //         SessionsModule,
  //         CrudModule,
  //         forwardRef(() => InvoicesModule),
  //       ],
  //       providers: [
  //         DatacenterService,
  //         DatacenterFactoryService,
  //         DatacenterAdminService,
  //         {
  //           provide: AdminVdcWrapperService,
  //           useValue: createWrapperMockService(
  //             mockProviderVdcs,
  //             emptyMetadataMock,
  //           ),
  //         },
  //         {
  //           provide: SessionsService,
  //           useValue: mockSessionService,
  //         },
  //       ],
  //     }).compile();
  //     service = module.get<DatacenterService>(DatacenterService);
  //     const result = await service.getDatacenterConfigWithGen();
  //     const correctResult = [];
  //     expect(result).toStrictEqual(correctResult);
  //   });
  //   it('should return nothing with empty providerList values', async () => {
  //     const emptyProviderList = cloneDeep(mockProviderVdcs);
  //     emptyProviderList.values = [];
  //     module = await Test.createTestingModule({
  //       imports: [
  //         DatacenterTableModule,
  //         MainWrapperModule,
  //         SessionsModule,
  //         CrudModule,
  //         forwardRef(() => InvoicesModule),
  //       ],
  //       providers: [
  //         DatacenterService,
  //         DatacenterFactoryService,
  //         DatacenterAdminService,
  //         {
  //           provide: AdminVdcWrapperService,
  //           useValue: createWrapperMockService(
  //             emptyProviderList,
  //             mockDatacenterMetadata,
  //           ),
  //         },
  //         {
  //           provide: SessionsService,
  //           useValue: mockSessionService,
  //         },
  //       ],
  //     }).compile();
  //     service = module.get<DatacenterService>(DatacenterService);
  //     const result = await service.getDatacenterConfigWithGen();
  //     const correctResult = [];
  //     expect(result).toStrictEqual(correctResult);
  //   });
  // });

  // describe('getDatacenterDetails', () => {
  //   it('should return the correct datacenter details', async () => {
  //     const datacenterName = 'arad';

  //     const res: DatacenterDetails = {
  //       title: 'امین',
  //       name: 'arad',
  //       diskList: [
  //         { itemTypeName: 'Archive-3000', enabled: true },
  //         { itemTypeName: 'Standard-7000', enabled: true },
  //         { itemTypeName: 'Fast-10000', enabled: true },
  //         { itemTypeName: 'VIP-12000', enabled: true },
  //       ],
  //       periodList: [
  //         { itemTypeName: '1', price: 0, unit: 'Month', enabled: true },
  //         { itemTypeName: '6', price: -0.05, unit: 'Month', enabled: true },
  //         { itemTypeName: '12', price: -0.1, unit: 'Month', enabled: true },
  //       ],
  //       enabled: true,
  //       location: 'example-location',
  //       gens: [
  //         { name: 'g2', enabled: true, cpuSpeed: 2500, id: 'd' },
  //         { name: 'g2', enabled: true, cpuSpeed: 2500, id: 'd' },
  //       ],
  //       providers: 'example-datacenter-(g2-2.5/g2-2.5)',
  //     };

  //     const myMock = jest
  //       .spyOn(service, 'getDatacenterDetails')
  //       .mockImplementation((datacenterName: string) => {
  //         if (datacenterName && datacenterName !== '') {
  //           return Promise.resolve(res);
  //         }
  //       });

  //     const model = await service.getDatacenterDetails(datacenterName);

  //     expect(model).toBe(res);
  //     expect(myMock).toHaveBeenCalledWith(datacenterName);
  //   });
  // });
  // describe('getDatacenterDetails', () => {
  //   it('should return invalid data', async () => {
  //     const datacenterName = '';

  //     const res: DatacenterDetails = {
  //       title: 'امین',
  //       name: 'null',
  //       diskList: [
  //         { itemTypeName: 'null', enabled: false },
  //         { itemTypeName: 'null', enabled: false },
  //         { itemTypeName: 'null', enabled: false },
  //         { itemTypeName: 'null', enabled: false },
  //       ],
  //       periodList: [
  //         { itemTypeName: 'null', price: 0, unit: 'false', enabled: false },
  //         { itemTypeName: 'null', price: 0, unit: 'false', enabled: false },
  //         { itemTypeName: 'null', price: 0, unit: 'false', enabled: false },
  //       ],
  //       enabled: false,
  //       location: 'null',
  //       gens: [
  //         { name: 'null', enabled: false, cpuSpeed: 0, id: 'd' },
  //         { name: 'null', enabled: false, cpuSpeed: 0, id: 'd' },
  //       ],
  //       providers: 'null',
  //     };

  //     const myMock = jest
  //       .spyOn(service, 'getDatacenterDetails')
  //       .mockImplementation((datacenterName: string) => {
  //         if (!datacenterName || datacenterName === '') {
  //           return Promise.resolve(res);
  //         }
  //       });

  //     const model = await service.getDatacenterDetails(datacenterName);

  //     expect(model).toBe(res);
  //     expect(myMock).toHaveBeenCalledWith(datacenterName);
  //   });
  // });
});
