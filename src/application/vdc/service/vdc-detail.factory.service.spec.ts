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

    const vdcDetailModels: VdcDetailModel[] = [
      {
        code: VdcGenerationItemCodes.Ram,
        itemTypeId: 1,
        name: servicName,
        codeHierarchy: '1_2_3',
        daysLeft: daysLeft,
        max: 10,
        unit: 'GB',
        min: 4,
        status: status,
        value: '5',
        title: 'RAM',
        servicePlanType: servicePlanType,
        datacenterName: 'Amin',
      },
      {
        code: VdcGenerationItemCodes.Ram,
        itemTypeId: 2,
        name: servicName,
        codeHierarchy: '1_2_3',
        daysLeft: daysLeft,
        max: 10,
        unit: 'CORE',
        min: 4,
        status: status,
        value: '5',
        title: 'CPU',
        servicePlanType: servicePlanType,
        datacenterName: 'Amin',
      },
    ];
    const res: VdcDetailsResultDto = {};

    const model = await service.fillVdcDetailModel(vdcDetailModels, res);

    expect(res.serviceName).toBe(servicName);
    expect(res.daysLeft).toBe(daysLeft);
    expect(res.status).toBe(status);
    expect(res.servicePlanType).toBe(servicePlanType);

    expect(model.length).toBeGreaterThan(0);
    expect(model.length).toBe(vdcDetailModels.length);
  });

  it('should return null vdc model with null vdc detail model and null vdc details result dto ', async () => {
    const vdcDetailModels: VdcDetailModel[] = [];
    const res: VdcDetailsResultDto = {};

    const model = await service.fillVdcDetailModel(vdcDetailModels, res);

    expect(res).toHaveProperty('serviceName', undefined);
    expect(res.daysLeft).toBeUndefined();
    expect(res.status).toBeUndefined();
    expect(res.servicePlanType).toBe(undefined);

    // expect(model.length).toBeGreaterThan(0);
    // expect(model.length).toBe(vdcDetailModels.length);
  });
});
