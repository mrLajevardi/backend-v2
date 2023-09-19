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

describe('DatacenterService', () => {
  let service: DatacenterService;

  let module: TestingModule;
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
      imports: [DatacenterTableModule, MainWrapperModule, SessionsModule],
      providers: [
        DatacenterService,
        DatacenterFactoryService,
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
  describe('findTargetMetadata', () => {
    it('should return a correct object', async () => {
      const targetMetadata = service.findTargetMetadata(mockDatacenterMetadata);
      const correctObject = {
        datacenterName: 'Amin',
        generation: 'G1',
      };
      expect(targetMetadata).toStrictEqual(correctObject);
    });

    it('should return an object with null values with wrong key', async () => {
      const wrongMock = cloneDeep(mockDatacenterMetadata);
      wrongMock.metadataEntry[0].key = 'datacenterr';
      console.log(mockDatacenterMetadata.metadataEntry[0]);
      const targetMetadata = service.findTargetMetadata(wrongMock);
      const correctObject = {
        datacenterName: null,
        generation: 'G1',
      };
      expect(targetMetadata).toStrictEqual(correctObject);
    });

    it('should return an object with null values with empty metaEntry Array', async () => {
      const wrongMock = cloneDeep(mockDatacenterMetadata);
      wrongMock.metadataEntry = [];
      const targetMetadata = service.findTargetMetadata(wrongMock);
      const correctObject = {
        datacenterName: null,
        generation: null,
      };
      expect(targetMetadata).toStrictEqual(correctObject);
    });

    it('should not return a correct object with wrong key', async () => {
      const wrongMock = cloneDeep(mockDatacenterMetadata);
      wrongMock.metadataEntry = [];
      const targetMetadata = service.findTargetMetadata(wrongMock);
      const correctObject = {
        datacenterName: 'Amin',
        generation: 'G1',
      };
      expect(targetMetadata).not.toStrictEqual(correctObject);
    });
  });

  describe('getDatacenterConfigWithGen', () => {
    it('should return correct result with correct providerVdcList and metadata', async () => {
      const result = await service.getDatacenterConfigWithGen();
      const correctResult = [
        {
          name: 'Amin',
          gens: [
            {
              name: 'G1',
              id: 'urn:vcloud:providervdc:a5946545-eaee-4475-970b-35ecb54a0e9b',
            },
          ],
        },
      ];
      expect(result).toStrictEqual(correctResult);
    });
    it('should return correct result with wrong metadata', async () => {
      const wrongMetadataMock = cloneDeep(mockDatacenterMetadata);
      wrongMetadataMock.metadataEntry[0].key = 'datacent';
      module = await Test.createTestingModule({
        imports: [DatacenterTableModule, MainWrapperModule, SessionsModule],
        providers: [
          DatacenterService,
          DatacenterFactoryService,
          {
            provide: AdminVdcWrapperService,
            useValue: createWrapperMockService(
              mockProviderVdcs,
              wrongMetadataMock,
            ),
          },
          {
            provide: SessionsService,
            useValue: mockSessionService,
          },
        ],
      }).compile();
      service = module.get<DatacenterService>(DatacenterService);
      const result = await service.getDatacenterConfigWithGen();
      const correctResult = [];
      expect(result).toStrictEqual(correctResult);
    });

    it('should return correct result with empty metadata', async () => {
      const emptyMetadataMock = cloneDeep(mockDatacenterMetadata);
      emptyMetadataMock.metadataEntry = [];
      module = await Test.createTestingModule({
        imports: [DatacenterTableModule, MainWrapperModule, SessionsModule],
        providers: [
          DatacenterService,
          DatacenterFactoryService,
          {
            provide: AdminVdcWrapperService,
            useValue: createWrapperMockService(
              mockProviderVdcs,
              emptyMetadataMock,
            ),
          },
          {
            provide: SessionsService,
            useValue: mockSessionService,
          },
        ],
      }).compile();
      service = module.get<DatacenterService>(DatacenterService);
      const result = await service.getDatacenterConfigWithGen();
      const correctResult = [];
      expect(result).toStrictEqual(correctResult);
    });
    it('should return nothing with empty providerList values', async () => {
      const emptyProviderList = cloneDeep(mockProviderVdcs);
      emptyProviderList.values = [];
      module = await Test.createTestingModule({
        imports: [DatacenterTableModule, MainWrapperModule, SessionsModule],
        providers: [
          DatacenterService,
          DatacenterFactoryService,
          {
            provide: AdminVdcWrapperService,
            useValue: createWrapperMockService(
              emptyProviderList,
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
      const result = await service.getDatacenterConfigWithGen();
      const correctResult = [];
      expect(result).toStrictEqual(correctResult);
    });
  });
});
