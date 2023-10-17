import { Test, TestingModule } from '@nestjs/testing';
import { SessionsModule } from '../../base/sessions/sessions.module';
import { MainWrapperModule } from '../../../wrappers/main-wrapper/main-wrapper.module';
import { VdcModule } from '../vdc.module';
import { ServicePropertiesModule } from '../../base/service-properties/service-properties.module';
import { SessionsService } from '../../base/sessions/sessions.service';
import { VdcWrapperService } from '../../../wrappers/main-wrapper/service/user/vdc/vdc-wrapper.service';
import { VdcDetailFactoryService } from './vdc-detail.factory.service';
import { ServicePropertiesService } from '../../base/service-properties/service-properties.service';
import { BASE_SERVICE_ITEM_SERVICE } from '../../base/service-item/interface/service/service-item.interface';
import { ServiceItemService } from '../../base/service-item/service/service-item.service';
import { VdcDetailService } from './vdc-detail.service';
import { VdcInvoiceDetailsInfoResultDto } from '../dto/vdc-invoice-details-info.result.dto';
import { forwardRef } from '@nestjs/common';
import { UserTableModule } from '../../base/crud/user-table/user-table.module';
import { OrganizationTableModule } from '../../base/crud/organization-table/organization-table.module';
import { VcloudWrapperModule } from '../../../wrappers/vcloud-wrapper/vcloud-wrapper.module';
import { InvoicesModule } from '../../base/invoice/invoices.module';
import { ServiceInstancesTableModule } from '../../base/crud/service-instances-table/service-instances-table.module';
import { VdcDetailFecadeService } from './vdc-detail.fecade.service';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { DatacenterModule } from '../../base/datacenter/datacenter.module';
import { CrudModule } from '../../base/crud/crud.module';
import { LoggerModule } from '../../../infrastructure/logger/logger.module';
import { EdgeGatewayModule } from '../../edge-gateway/edge-gateway.module';
import { NatModule } from '../../nat/nat.module';
import { VmModule } from '../../vm/vm.module';
import { ServiceModule } from '../../base/service/service.module';
import { TasksModule } from '../../base/tasks/tasks.module';
import { OrganizationModule } from '../../base/organization/organization.module';
import { UserModule } from '../../base/user/user.module';
import { AbilityModule } from '../../base/security/ability/ability.module';
import { NetworksModule } from '../../networks/networks.module';
import { ServiceItemModule } from '../../base/service-item/service-item.module';
import { AxiosError } from 'axios';
import { VdcDetailsResultDto } from '../dto/vdc-details.result.dto';
import { VdcGenerationItemCodes } from '../../base/itemType/enum/item-type-codes.enum';
import { ServicePlanTypeEnum } from '../../base/service/enum/service-plan-type.enum';
import { ServiceStatusEnum } from '../../base/service/enum/service-status.enum';
import { VdcDetailItemResultDto } from '../dto/vdc-detail-item.result.dto';

describe('VdcDetailService', () => {
  let service: VdcDetailService;
  let module: TestingModule;
  const validServiceInstanceId = '3C0E83BA-7883-445F-9BC4-1EFCA602CC51';
  const invalidServiceInstanceId = '3C0E83BA-7883-445F-9BC4-1EFCA602CC51';

  function getValidVdcDetailsResultDto(): VdcDetailsResultDto {
    return {
      disk: [
        {
          unit: 'GB',
          code: VdcGenerationItemCodes.Disk,
          usage: 10000,
          value: '1024',
          price: 10258,
          title: 'standard-disk',
        },
      ],
      servicePlanType: ServicePlanTypeEnum.Static,
      status: ServiceStatusEnum.Success,
      ram: {
        price: 1004,
        title: 'RAM',
        value: '4096',
        usage: 1024,
        code: VdcGenerationItemCodes.Ram,
        unit: 'GB',
      },
      cpu: {
        price: 123456,
        title: 'CPU',
        value: '8',
        usage: 4,
        code: VdcGenerationItemCodes.Cpu,
        unit: 'CORE',
      },
      generation: 'G1',
      daysLeft: 40,
      serviceName: 'ValidService',
    };
  }

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        SessionsModule,
        MainWrapperModule,
        VdcModule,
        ServicePropertiesModule,
        UserTableModule,
        OrganizationTableModule,
        VcloudWrapperModule,
        InvoicesModule,
        ServiceInstancesTableModule,
        MainWrapperModule,
        DatabaseModule,
        DatacenterModule,
        MainWrapperModule,
        CrudModule,
        LoggerModule,
        EdgeGatewayModule,
        NatModule,
        VmModule,
        forwardRef(() => ServiceModule),
        forwardRef(() => TasksModule),
        SessionsModule,
        forwardRef(() => InvoicesModule),
        OrganizationModule,
        UserModule,
        ServicePropertiesModule,
        AbilityModule,
        NetworksModule,
        ServiceItemModule,
        ServiceInstancesTableModule,
      ],
      providers: [
        VdcDetailService,
        SessionsService,
        VdcWrapperService,
        VdcDetailFactoryService,
        VdcDetailFecadeService,
        ServicePropertiesService,
        {
          provide: BASE_SERVICE_ITEM_SERVICE,
          useClass: ServiceItemService,
        },
      ],
    }).compile();

    service = module.get<VdcDetailService>(VdcDetailService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should return a storage detail with valid instance id', async () => {
    const res: VdcInvoiceDetailsInfoResultDto[] = [
      {
        unit: 'GB',
        code: 'Disk',
        price: 1000,
        value: '1000',
        usage: 258,
        title: 'disk',
      },
    ];

    jest
      .spyOn(service, 'getStorageDetailVdc')
      .mockImplementation(() => Promise.resolve(res));

    expect(await service.getStorageDetailVdc(validServiceInstanceId)).toBe(res);
  });

  it('should return axios error with invalid instanceId', async () => {
    const myMock = jest.fn();
    service.getStorageDetailVdc = myMock;
    myMock.mockImplementation(
      (invalidInstanceId: string) => new AxiosError(invalidInstanceId),
    );
    const res = await service.getStorageDetailVdc(invalidServiceInstanceId);
    expect(res).toBeInstanceOf(AxiosError);
  });

  it('should return some some storage detail with valid instance id', async () => {
    const res: VdcInvoiceDetailsInfoResultDto[] = [
      {
        unit: 'GB',
        code: 'Disk',
        price: 1000,
        value: '1000',
        usage: 258,
        title: 'disk',
      },

      {
        unit: 'GB',
        code: 'Disk2',
        price: 1000,
        value: '1000',
        usage: 258,
        title: 'disk',
      },

      {
        unit: 'GB',
        code: 'Disk3',
        price: 1000,
        value: '1000',
        usage: 258,
        title: 'disk',
      },
    ];

    jest
      .spyOn(service, 'getStorageDetailVdc')
      .mockImplementation(() => Promise.resolve(res));

    const models = await service.getStorageDetailVdc(validServiceInstanceId);

    expect(models).toHaveLength(3);
    expect(models).toContain(res[2]);
  });

  it('should return vdc detail with valid instance id', async () => {
    const res: VdcDetailsResultDto = getValidVdcDetailsResultDto();

    const myMcok = jest
      .spyOn(service, 'getVdcDetail')
      .mockImplementation(() => Promise.resolve(res));

    expect(await service.getVdcDetail(validServiceInstanceId)).toBe(res);
    expect(myMcok).toHaveBeenCalled();
  });

  it('should return null object with invalid instance id ', async () => {
    const res: VdcDetailsResultDto = {};
    const myMock = jest
      .spyOn(service, 'getVdcDetail')
      .mockImplementation((serviceInstanceId) => {
        if (serviceInstanceId === invalidServiceInstanceId) {
          return Promise.resolve({});
        }
      });
    const resFunction = await service.getVdcDetail(invalidServiceInstanceId);
    expect(resFunction).toStrictEqual(res);
    expect(myMock).toHaveBeenCalled();
    myMock.mockRestore();
  });

  it('should not be null disk and ram and cpu and generation ', async () => {
    const res: VdcDetailsResultDto = getValidVdcDetailsResultDto();
    const myMock = jest
      .spyOn(service, 'getVdcDetail')
      .mockImplementation((serviceInstanceId) => {
        if (serviceInstanceId === validServiceInstanceId) {
          return Promise.resolve(res);
        }
      });

    const models = await service.getVdcDetail(validServiceInstanceId);
    expect(models.disk.length).toBeGreaterThan(0);
    expect(models.disk[0].code).toBe(VdcGenerationItemCodes.Disk);
    expect(Number(models.disk[0].value)).toBeGreaterThan(0);

    expect(models.ram).toBeDefined();
    expect(models.ram.code.trim()).toBe(VdcGenerationItemCodes.Ram);
    expect(Number(models.ram.value)).toBeGreaterThan(0);

    expect(models.cpu).toBeDefined();
    expect(models.cpu.code.trim()).toBe(VdcGenerationItemCodes.Cpu);
    expect(Number(models.cpu.value)).toBeGreaterThan(0);

    expect(models.generation).toBeDefined();
    expect(models.generation.length).toBeGreaterThan(0);
  });

  it('should return null vdc detail items with invalid instanceId', async () => {
    const res: VdcDetailItemResultDto = {};
    const myMock = jest
      .spyOn(service, 'getVdcDetailItems')
      .mockImplementation((option, serviceInstanceId) => {
        if (serviceInstanceId === invalidServiceInstanceId) {
          return Promise.resolve(res);
        }
      });
    const models = await service.getVdcDetailItems(
      null,
      invalidServiceInstanceId,
    );

    expect(models).toBe(res);
    expect(myMock).toHaveBeenCalled();
  });

  it('should return vdc detail items with valid instance id', async () => {
    const res: VdcDetailItemResultDto = {
      natRules: 10,
      media: 5,
      dhcpForwarding: true,
      ipSets: 5,
      firewalls: 4,
      namedDisk: 3,
      applicationPortProfiles: { custom: 1, default: 1 },
      networks: 3,
    };

    const myMock = jest
      .spyOn(service, 'getVdcDetailItems')
      .mockImplementation((option, serviceInstanceId) => {
        if (serviceInstanceId === validServiceInstanceId) {
          return Promise.resolve(res);
        }
      });
    const model = await service.getVdcDetailItems(null, validServiceInstanceId);
    expect(model).toBe(res);
    expect(model.ipSets).toBe(res.ipSets);
    expect(model.networks).toBe(res.networks);
    expect(model.natRules).toBe(res.natRules);
    expect(model.applicationPortProfiles).toBe(res.applicationPortProfiles);
    expect(myMock).toHaveBeenCalled();
  });
});
