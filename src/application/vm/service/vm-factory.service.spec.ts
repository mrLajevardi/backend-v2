import { ServicePropertiesService } from 'src/application/base/service-properties/service-properties.service';
import { VmFactoryService } from './vm-factory.service';
import { TestBed } from '@automock/jest';
import { VdcProperties } from 'src/application/vdc/interface/vdc-properties.interface';
import { SessionsService } from 'src/application/base/sessions/sessions.service';
import { VdcWrapperService } from 'src/wrappers/main-wrapper/service/user/vdc/vdc-wrapper.service';
import { VmList } from '../dto/get-vm-list.dto';
import { GetVMQueryDto } from 'src/wrappers/main-wrapper/service/user/vdc/dto/get-vm-query.dto';
import { AxiosResponse } from 'axios';
import { VmStateStringEnum } from 'src/wrappers/main-wrapper/service/user/vm/enum/vm-state-string.enum';
import { VmStatusEnum } from '../enums/vm-status.enum';

describe('VmFactoryService', () => {
  let service: VmFactoryService;
  let servicePropertiesService: ServicePropertiesService;
  let sessionService: SessionsService;
  let vdcWrapperService: VdcWrapperService;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(VmFactoryService).compile();
    servicePropertiesService = unitRef.get<ServicePropertiesService>(
      ServicePropertiesService,
    );
    sessionService = unitRef.get(SessionsService);
    vdcWrapperService = unitRef.get(VdcWrapperService);

    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getVmList', () => {
    it('should return correct result if props.vdcId is not set', async () => {
      jest
        .spyOn(servicePropertiesService, 'getAllServiceProperties')
        .mockImplementation(async () => {
          return {};
        });

      const expectedResult = {
        values: [],
        page: 0,
        pageSize: 0,
        pageCount: 0,
        total: 0,
      };
      const result = await service.getVmList('', 0, '');
      expect(result).toStrictEqual(expectedResult);
    });
    it('should call vcloudQuery with correct values', async () => {
      const session = '';
      const props = {
        name: 'test',
        orgId: '22',
        vdcId: 'test',
      };
      jest
        .spyOn(servicePropertiesService, 'getAllServiceProperties')
        .mockImplementation(async (): Promise<VdcProperties> => {
          return props;
        });
      jest
        .spyOn(sessionService, 'checkUserSession')
        .mockImplementation(async (): Promise<string> => {
          return session;
        });
      const preFilter = 'test';
      const filter =
        `(isVAppTemplate==false;vdc==${props.vdcId});` + `(${preFilter})`;
      const vcloudQuery = jest
        .spyOn(vdcWrapperService, 'vcloudQuery')
        .mockImplementation(async (): Promise<any> => {
          return {
            data: {
              record: [],
            },
          };
        });
      await service.getVmList('te', 0, 'test');
      expect(vcloudQuery).toBeCalledWith(session, { type: 'vm', filter });
    });
    it('should return correct result if there is no vm', async () => {
      const session = '';
      const props = {
        name: 'test',
        orgId: '22',
        vdcId: 'test',
      };
      const vcloudQueryResult = {
        data: {
          page: 0,
          pageSize: 0,
          record: [],
          total: 0,
        },
      };
      jest
        .spyOn(servicePropertiesService, 'getAllServiceProperties')
        .mockImplementation(async (): Promise<VdcProperties> => {
          return props;
        });
      jest
        .spyOn(sessionService, 'checkUserSession')
        .mockImplementation(async (): Promise<string> => {
          return session;
        });
      jest
        .spyOn(vdcWrapperService, 'vcloudQuery')
        .mockImplementation(async (): Promise<AxiosResponse<GetVMQueryDto>> => {
          return vcloudQueryResult as any;
        });
      const expectedResult: VmList = {
        page: vcloudQueryResult.data.page,
        pageCount: 0,
        pageSize: vcloudQueryResult.data.pageSize,
        total: vcloudQueryResult.data.total,
        values: [],
      };
      const result = await service.getVmList('', 0, '');
      expect(result).toStrictEqual(expectedResult);
    });
    it('should return correct result if there is a vm', async () => {
      const session = '';
      const props = {
        name: 'test',
        orgId: '22',
        vdcId: 'test',
      };
      const id = 'test';
      const vcloudQueryResult: Partial<AxiosResponse<GetVMQueryDto>> = {
        data: {
          page: 0,
          pageSize: 0,
          record: [
            {
              href: `vApp/${id}`,
              name: 'test',
              otherAttributes: {
                vmToolsVersion: null,
              },
              guestOs: 'test',
              description: null,
              numberOfCpus: 0,
              totalStorageAllocatedMb: 10,
              memoryMB: 4,
              status: VmStateStringEnum.Unresolved,
              container: `vApp/${id}`,
              snapshot: true,
            },
          ],
          total: 0,
        },
      } as any;
      jest
        .spyOn(servicePropertiesService, 'getAllServiceProperties')
        .mockImplementation(async (): Promise<VdcProperties> => {
          return props;
        });
      jest
        .spyOn(sessionService, 'checkUserSession')
        .mockImplementation(async (): Promise<string> => {
          return session;
        });
      jest
        .spyOn(vdcWrapperService, 'vcloudQuery')
        .mockImplementation(async (): Promise<AxiosResponse<GetVMQueryDto>> => {
          return vcloudQueryResult as any;
        });
      const expectedResult: VmList = {
        page: vcloudQueryResult.data.page,
        pageCount: 0,
        pageSize: vcloudQueryResult.data.pageSize,
        total: vcloudQueryResult.data.total,
        values: [
          {
            containerId: id,
            cpu: vcloudQueryResult.data.record[0].numberOfCpus,
            description: vcloudQueryResult.data.record[0].description,
            id,
            memory: vcloudQueryResult.data.record[0].memoryMB,
            name: vcloudQueryResult.data.record[0].name,
            os: vcloudQueryResult.data.record[0].guestOs,
            snapshot: vcloudQueryResult.data.record[0].snapshot,
            status: VmStatusEnum.UNRESOLVED,
            storage:
              vcloudQueryResult.data.record[0].totalStorageAllocatedMb -
              vcloudQueryResult.data.record[0].memoryMB,
            vmToolsVersion:
              vcloudQueryResult.data.record[0].otherAttributes.vmToolsVersion,
          },
        ],
      };
      const result = await service.getVmList('', 0, '');
      expect(result).toStrictEqual(expectedResult);
    });
  });
});
