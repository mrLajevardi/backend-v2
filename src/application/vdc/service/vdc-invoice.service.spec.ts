import { VdcInvoiceService } from './vdc-invoice.service';
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
import { ServicePropertiesService } from '../../base/service-properties/service-properties.service';
import { BASE_SERVICE_ITEM_SERVICE } from '../../base/service-item/interface/service/service-item.interface';
import { ServiceItemService } from '../../base/service-item/service/service-item.service';
import { VdcInvoiceDetailsResultDto } from '../dto/vdc-invoice-details.result.dto';
import { BASE_VDC_INVOICE_SERVICE } from '../interface/service/base-vdc-invoice-service.interface';
import { VdcDetailsResultDto } from '../dto/vdc-details.result.dto';
import { VdcGenerationItemCodes } from '../../base/itemType/enum/item-type-codes.enum';
import { ServicePlanTypeEnum } from '../../base/service/enum/service-plan-type.enum';
import { ServiceStatusEnum } from '../../base/service/enum/service-status.enum';

describe('VdcInvoiceService', () => {
  let service: VdcInvoiceService;
  let module: TestingModule;
  const validInvoiceId = '12345';
  const inValidInvoiceId = '1234asda5';
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

    service = module.get<VdcInvoiceService>(VdcInvoiceService);
  });
  afterAll(async () => {
    await module.close();
  });

  it('should return null vdc invoice detail with invalid invoice id ', async () => {
    const res: VdcInvoiceDetailsResultDto = {};

    const myMock = jest
      .spyOn(service, 'getVdcInvoiceDetail')
      .mockImplementation((invoiceId) => {
        if (invoiceId == inValidInvoiceId) return Promise.resolve(res);
      });
    const model = await service.getVdcInvoiceDetail(inValidInvoiceId);

    expect(model).toBe(res);
    expect(myMock).toHaveBeenCalledWith(inValidInvoiceId);
  });

  it('should return vdc invoice detail with valid invoice id', async () => {
    const res: VdcInvoiceDetailsResultDto = getValidVdcDetailsResultDto();

    const myMock = jest
      .spyOn(service, 'getVdcInvoiceDetail')
      .mockImplementation((invoiceId) => {
        if (invoiceId == validInvoiceId) {
          return Promise.resolve(res);
        }
      });

    const model = await service.getVdcInvoiceDetail(validInvoiceId);

    expect(model).toBe(res);
    // expect(myMock).toHaveBeenCalled();
    expect(myMock).toHaveBeenCalledWith(validInvoiceId);
  });
});
