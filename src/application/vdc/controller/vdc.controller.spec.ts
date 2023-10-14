import { Test, TestingModule } from '@nestjs/testing';
import { VdcController } from './vdc.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { EdgeService } from '../service/edge.service';
import { NetworkService } from '../service/network.service';
import { OrgService } from '../service/org.service';
import { VdcService } from '../service/vdc.service';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { OrganizationModule } from 'src/application/base/organization/organization.module';
import { SessionsModule } from 'src/application/base/sessions/sessions.module';
import { UserModule } from 'src/application/base/user/user.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { ServicePropertiesModule } from 'src/application/base/service-properties/service-properties.module';
import { VdcFactoryService } from '../service/vdc.factory.service';
import { MainWrapperModule } from 'src/wrappers/main-wrapper/main-wrapper.module';
import { BASE_VDC_INVOICE_SERVICE } from '../interface/service/base-vdc-invoice-service.interface';
import { VdcInvoiceService } from '../service/vdc-invoice.service';
import { InvoicesModule } from 'src/application/base/invoice/invoices.module';
import { BASE_VDC_DETAIL_SERVICE } from '../interface/service/base-vdc-detail-service.interface';
import { VdcDetailService } from '../service/vdc-detail.service';
import { VdcDetailFactoryService } from '../service/vdc-detail.factory.service';
import { ServiceItemModule } from '../../base/service-item/service-item.module';
import { VdcDetailFecadeService } from '../service/vdc-detail.fecade.service';
import { NatModule } from 'src/application/nat/nat.module';
import { EdgeGatewayModule } from 'src/application/edge-gateway/edge-gateway.module';
import { VmModule } from 'src/application/vm/vm.module';
import { NetworksModule } from 'src/application/networks/networks.module';

describe('VdcController', () => {
  let controller: VdcController;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        CrudModule,
        LoggerModule,
        //TasksModule,
        SessionsModule,
        OrganizationModule,
        UserModule,
        ServicePropertiesModule,
        MainWrapperModule,
        InvoicesModule,
        ServiceItemModule,
        EdgeGatewayModule,
        NatModule,
        NetworksModule,
        VmModule,
      ],
      providers: [
        VdcService,
        OrgService,
        EdgeService,
        NetworkService,
        VdcFactoryService,
        VdcDetailFactoryService,
        {
          provide: BASE_VDC_INVOICE_SERVICE,
          useClass: VdcInvoiceService,
        },
        {
          provide: BASE_VDC_DETAIL_SERVICE,
          useClass: VdcDetailService,
        },
        VdcDetailFecadeService,
      ],

      controllers: [VdcController],
    }).compile();

    controller = module.get<VdcController>(VdcController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
