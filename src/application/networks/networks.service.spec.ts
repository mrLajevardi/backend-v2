import { NetworksService } from './networks.service';
import { SessionsService } from '../base/sessions/sessions.service';
import { ServicePropertiesService } from '../base/service-properties/service-properties.service';
import { NetworkWrapperService } from 'src/wrappers/main-wrapper/service/user/network/network-wrapper.service';
import { VdcProperties } from '../vdc/interface/vdc-properties.interface';
import { VcloudTask } from 'src/infrastructure/dto/vcloud-task.dto';
import { NetworkDto } from './dto/network.dto';
import { NetworksTypesEnum } from 'src/wrappers/main-wrapper/service/user/network/enum/network-types.enum';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { TaskReturnDto } from 'src/infrastructure/dto/task-return.dto';
import { CreateNetworkDto } from 'src/wrappers/main-wrapper/service/user/network/dto/create-network.dto';
import { vcdConfig } from 'src/wrappers/mainWrapper/vcdConfig';
import { generateNetworkMock } from './mock/networks.mock';
import { TestBed } from '@automock/jest';
import { UnitReference } from '@automock/core';

describe('NetworksService', () => {
  let service: NetworksService;
  let sessionService: SessionsService;
  let servicePropertiesService: ServicePropertiesService;
  let networkWrapperService: NetworkWrapperService;
  let module: UnitReference;
  let options: SessionRequest;
  const taskId = 'a7bbd087-0ed0-42f3-9380-a4ac3deb381b';
  const vcloudTask =
    'https://labvpc.aradcloud.com/api/task/a7bbd087-0ed0-42f3-9380-a4ac3deb381b';
  const vdcInstanceId = 'vdcServiceInstance';
  const vdcProps: VdcProperties = {
    name: 'name',
    orgId: '22',
    edgeName: 'edgeName',
    genId: 'genId',
    vdcId: 'vdcId',
  };
  const authToken = 'jwt';
  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(NetworksService).compile();
    service = unit;
    module = unitRef;
    sessionService = module.get<SessionsService>(SessionsService);
    servicePropertiesService = module.get<ServicePropertiesService>(
      ServicePropertiesService,
    );
    networkWrapperService = module.get<NetworkWrapperService>(
      NetworkWrapperService,
    );

    jest
      .spyOn(sessionService, 'checkUserSession')
      .mockImplementation(async () => Promise.resolve(authToken));
    jest
      .spyOn(servicePropertiesService, 'getAllServiceProperties')
      .mockImplementation(async () => {
        return vdcProps;
      });
    options = {
      user: {
        userId: 26,
      },
    } as SessionRequest;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNetwork', () => {
    it('should return taskId if request is ok', async () => {
      jest
        .spyOn(networkWrapperService, 'createNetwork')
        .mockImplementation(async () => {
          const output: VcloudTask = {
            __vcloudTask: vcloudTask,
          };
          return output;
        });
      const dto: NetworkDto = {
        description: 'description',
        dnsServer1: '8.8.8.8',
        dnsServer2: null,
        gateway: '192.168.1.1',
        name: 'test',
        networkType: NetworksTypesEnum.Isolated,
        prefixLength: 24,
        dnsSuffix: 'google.com',
      };
      const expectedResult: TaskReturnDto = {
        taskId,
      };
      const result = await service.createNetwork(dto, options, vdcInstanceId);
      expect(result).toStrictEqual(expectedResult);
    });

    it('should call wrapper with correct parameters', async () => {
      const mockNetworkWrapper = jest
        .spyOn(networkWrapperService, 'createNetwork')
        .mockImplementation(async () => {
          const output: VcloudTask = {
            __vcloudTask: vcloudTask,
          };
          return output;
        });
      const dto: NetworkDto = {
        description: 'description',
        dnsServer1: '8.8.8.8',
        dnsServer2: null,
        gateway: '192.168.1.1',
        name: 'test',
        networkType: NetworksTypesEnum.Isolated,
        prefixLength: 24,
        dnsSuffix: 'google.com',
      };
      await service.createNetwork(dto, options, vdcInstanceId);
      const wrapperConfig: CreateNetworkDto = {
        authToken,
        connectionType: vcdConfig.user.network.connectionType,
        connectionTypeValue: vcdConfig.user.network.connectionTypeValue,
        vdcId: vdcProps.vdcId,
        ...dto,
      };
      expect(mockNetworkWrapper).toHaveBeenCalledWith(
        wrapperConfig,
        vdcProps.edgeName,
      );
    });
  });

  describe('deleteNetwork', () => {
    it('should return taskId if request is ok', async () => {
      jest
        .spyOn(networkWrapperService, 'deleteNetwork')
        .mockImplementation(async () => {
          const output: VcloudTask = {
            __vcloudTask: vcloudTask,
          };
          return output;
        });
      const expectedResult: TaskReturnDto = {
        taskId,
      };
      const networkId = 'networkId';
      const result = await service.deleteNetwork(
        options,
        vdcInstanceId,
        networkId,
      );
      expect(result).toStrictEqual(expectedResult);
    });

    it('should call wrapper with correct parameters', async () => {
      const mockNetworkWrapper = jest
        .spyOn(networkWrapperService, 'deleteNetwork')
        .mockImplementation(async () => {
          const output: VcloudTask = {
            __vcloudTask: vcloudTask,
          };
          return output;
        });
      const networkId = 'networkId';
      await service.deleteNetwork(options, vdcInstanceId, networkId);
      expect(mockNetworkWrapper).toHaveBeenCalledWith(authToken, networkId);
    });
  });

  describe('getNetworks', () => {
    it('should return correct response', async () => {
      jest
        .spyOn(networkWrapperService, 'getNetwork')
        .mockImplementation(async () => generateNetworkMock());

      // const
    });
  });
});
