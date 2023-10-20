import { Test, TestingModule } from '@nestjs/testing';
import { SessionsModule } from '../../base/sessions/sessions.module';
import { MainWrapperModule } from '../../../wrappers/main-wrapper/main-wrapper.module';
import { VdcModule } from '../vdc.module';
import { ServicePropertiesModule } from '../../base/service-properties/service-properties.module';
import { UserTableModule } from '../../base/crud/user-table/user-table.module';
import { OrganizationTableModule } from '../../base/crud/organization-table/organization-table.module';
import { VcloudWrapperModule } from '../../../wrappers/vcloud-wrapper/vcloud-wrapper.module';
import { InvoicesModule } from '../../base/invoice/invoices.module';
import { ServiceInstancesTableModule } from '../../base/crud/service-instances-table/service-instances-table.module';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { DatacenterModule } from '../../base/datacenter/datacenter.module';
import { CrudModule } from '../../base/crud/crud.module';
import { LoggerModule } from '../../../infrastructure/logger/logger.module';
import { EdgeGatewayModule } from '../../edge-gateway/edge-gateway.module';
import { NatModule } from '../../nat/nat.module';
import { VmModule } from '../../vm/vm.module';
import { forwardRef } from '@nestjs/common';
import { ServiceModule } from '../../base/service/service.module';
import { TasksModule } from '../../base/tasks/tasks.module';
import { OrganizationModule } from '../../base/organization/organization.module';
import { UserModule } from '../../base/user/user.module';
import { AbilityModule } from '../../base/security/ability/ability.module';
import { NetworksModule } from '../../networks/networks.module';
import { ServiceItemModule } from '../../base/service-item/service-item.module';
import { VdcDetailService } from './vdc-detail.service';
import { SessionsService } from '../../base/sessions/sessions.service';
import { VdcWrapperService } from '../../../wrappers/main-wrapper/service/user/vdc/vdc-wrapper.service';
import { VdcDetailFactoryService } from './vdc-detail.factory.service';
import { VdcDetailFecadeService } from './vdc-detail.fecade.service';
import { VdcInvoiceService } from './vdc-invoice.service';
import { ServicePropertiesService } from '../../base/service-properties/service-properties.service';
import { BASE_SERVICE_ITEM_SERVICE } from '../../base/service-item/interface/service/service-item.interface';
import { ServiceItemService } from '../../base/service-item/service/service-item.service';
import { BASE_VDC_INVOICE_SERVICE } from '../interface/service/base-vdc-invoice-service.interface';
import { VdcDetailModel } from '../interface/vdc-detail-model.interface';
import { VdcGenerationItemCodes } from '../../base/itemType/enum/item-type-codes.enum';
import { ServiceStatusEnum } from '../../base/service/enum/service-status.enum';
import { ServicePlanTypeEnum } from '../../base/service/enum/service-plan-type.enum';
import { VdcDetailsResultDto } from '../dto/vdc-details.result.dto';

describe('VdcDetailFactoryService', () => {
  let module: TestingModule;
  let service: VdcDetailFactoryService;
  const validServiceInstanceId = '3C0E83BA-7883-445F-9BC4-1EFCA602CC51';
  const inValidServiceInstanceId = 'asdkal;dksa5456878adasd';

  function getVdcDetailModel(): VdcDetailModel[] {
    return [
      {
        code: VdcGenerationItemCodes.Ram,
        itemTypeId: 1,
        name: 'TEST_SERVICE',
        codeHierarchy: '1_2_3',
        daysLeft: 44,
        max: 10,
        unit: 'GB',
        min: 4,
        status: ServiceStatusEnum.Success,
        value: '5',
        title: 'RAM',
        servicePlanType: ServicePlanTypeEnum.Static,
        datacenterName: 'Amin',
      },
      {
        code: VdcGenerationItemCodes.Ram,
        itemTypeId: 2,
        name: 'TEST_SERVICE',
        codeHierarchy: '1_2_3',
        daysLeft: 44,
        max: 10,
        unit: 'CORE',
        min: 4,
        status: ServiceStatusEnum.Success,
        value: '5',
        title: 'CPU',
        servicePlanType: ServicePlanTypeEnum.Static,
        datacenterName: 'Amin',
      },
    ];
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
        VdcInvoiceService,
        ServicePropertiesService,
        {
          provide: BASE_SERVICE_ITEM_SERVICE,
          useClass: ServiceItemService,
        },
        {
          provide: BASE_VDC_INVOICE_SERVICE,
          useClass: VdcInvoiceService,
        },
      ],
      exports: [BASE_VDC_INVOICE_SERVICE],
    }).compile();

    service = module.get<VdcDetailFactoryService>(VdcDetailFactoryService);
  });
  afterAll(async () => {
    await module.close();
  });

  it('should return vdc model with vdc detail model and Vdc details result dto ', async () => {
    const servicName = 'TEST_SERVICE';
    const daysLeft = 44;
    const status = ServiceStatusEnum.Success;
    const servicePlanType = ServicePlanTypeEnum.Static;

    const vdcDetailModels = getVdcDetailModel();
    const res: VdcDetailsResultDto = {};

    const model = await service.fillVdcDetailModel(vdcDetailModels, res);

    expect(res.serviceName).toBe(vdcDetailModels[0].name);
    expect(res.daysLeft).toBe(vdcDetailModels[0].daysLeft);
    expect(res.status).toBe(vdcDetailModels[0].status);
    expect(res.servicePlanType).toBe(vdcDetailModels[0].servicePlanType);

    expect(model.length).toBeGreaterThan(0);
    expect(model.length).toBe(vdcDetailModels.length);
  });

  it('should return null vdc model with null vdc detail model and null vdc details result dto ', async () => {
    const vdcDetailModels: VdcDetailModel[] = [];
    const res: VdcDetailsResultDto = {};

    const model = await service.fillVdcDetailModel(vdcDetailModels, res);

    expect(res.daysLeft).toBeUndefined();
    expect(res.serviceName).toBeUndefined();
    expect(res.status).toBeUndefined();
    expect(res.servicePlanType).toBe(undefined);
    expect(model).toHaveLength(0);
  });

  it('should return status of vdc item that have many options ', async () => {
    const res = {
      countOfNetworks: 3,
      countOfNat: 3,
      countOfFireWalls: 3,
      countOfIpSet: 3,
      countOfApplicationPort: { default: 0, custom: 0 },
      countOfNamedDisk: 3,
      countOfFiles: 3,
      statusOfDhcpForwarderStatus: true,
    };

    jest
      .spyOn(service, 'getStatusOfVdcItems')
      .mockImplementation((option, serviceInstanceId) => {
        if (serviceInstanceId == validServiceInstanceId) {
          return Promise.resolve(res);
        }
      });

    const model = await service.getStatusOfVdcItems(
      null,
      validServiceInstanceId,
    );

    expect(model).toHaveProperty('countOfNamedDisk');
    expect(model).toHaveProperty('countOfFiles');
    expect(model).toHaveProperty('statusOfDhcpForwarderStatus');
    expect(model).toHaveProperty('countOfFireWalls');
    expect(model.countOfNamedDisk).toBeGreaterThan(0);
    expect(model.countOfFiles).toBeGreaterThan(0);
    expect(model.countOfFireWalls).toBeGreaterThan(0);
  });

  it('should return status of vdc item that have no options ', async () => {
    const res = {
      countOfNetworks: 0,
      countOfNat: 0,
      countOfFireWalls: 0,
      countOfIpSet: 0,
      countOfApplicationPort: { default: 0, custom: 0 },
      countOfNamedDisk: 0,
      countOfFiles: 0,
      statusOfDhcpForwarderStatus: true,
    };

    jest
      .spyOn(service, 'getStatusOfVdcItems')
      .mockImplementation((option, serviceInstanceId) => {
        if (serviceInstanceId == validServiceInstanceId) {
          return Promise.resolve(res);
        }
      });

    const model = await service.getStatusOfVdcItems(
      null,
      validServiceInstanceId,
    );

    expect(model).toHaveProperty('countOfNamedDisk');
    expect(model).toHaveProperty('countOfFiles');
    expect(model).toHaveProperty('statusOfDhcpForwarderStatus');
    expect(model).toHaveProperty('countOfFireWalls');
    expect(model.countOfNamedDisk).toBe(0);
    expect(model.countOfFiles).toBe(0);
    expect(model.countOfFireWalls).toBe(0);
  });

  it('should not return status of vdc item with invalid instance id', async () => {
    const res = {
      countOfNetworks: undefined,
      countOfNat: undefined,
      countOfFireWalls: undefined,
      countOfIpSet: undefined,
      countOfApplicationPort: { default: undefined, custom: undefined },
      countOfNamedDisk: undefined,
      countOfFiles: undefined,
      statusOfDhcpForwarderStatus: undefined,
    };

    jest
      .spyOn(service, 'getStatusOfVdcItems')
      .mockImplementation((option, serviceInstanceId) => {
        if (serviceInstanceId == inValidServiceInstanceId) {
          return Promise.resolve(res);
        }
      });

    const model = await service.getStatusOfVdcItems(
      null,
      validServiceInstanceId,
    );

    expect(model).toBeUndefined();
  });

  it('should return vdc detail model with valid instance id', () => {
    const vdcDetailModel = getVdcDetailModel();
  });
});
