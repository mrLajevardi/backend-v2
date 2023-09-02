import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import { VcloudWrapperService } from './vcloud-wrapper.service';
import { VmEndpointService } from '../services/user/vm/vm-endpoint.service';
import { VdcEndpointService } from '../services/user/vdc/vdc-endpoint.service';
import { TasksEndpointService } from '../services/user/tasks/tasksEndpoint.service';
import { EdgeGatewayEndpointService } from '../services/user/edgeGateway/edge-gateway-endpoint.service';
import { AdminVdcEndpointService } from '../services/admin/vdc/admin-vdc-endpoint.service';
import { ApplicationPortProfileEndpointService } from '../services/user/edgeGateway/applicationPortProfile/application-port-profile-endpoint.service';
import { DhcpEndpointService } from '../services/user/edgeGateway/dhcp/dhcp-endpoint.service';
import { FirewallEndpointService } from '../services/user/edgeGateway/firewall/firewall-endpoint.service';
import { IpSetsEndpointService } from '../services/user/edgeGateway/ipSets/ip-sets-endpoint.service';
import { NatEndpointService } from '../services/user/edgeGateway/nat/nat-endpoint.service';
import { NetworkEndpointService } from '../services/user/edgeGateway/network/network-endpoint.service';
import { AdminEdgeGatewayEndpointService } from '../services/admin/edgeGateway/admin-edge-gateway-endpoint.service';
import { AdminUserEndpointService } from '../services/admin/user/admin-user-endpoint.service';
import { AdminOrgEndpointService } from '../services/admin/org/admin-org-endpoint.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VcloudWrapperInterface } from '../interface/vcloud-wrapper.interface';
describe('VcloudWrapperService', () => {
  let service: VcloudWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        {
          provide: 'VCLOUD_WRAPPER',
          useFactory: (...wrappers: Provider[]): VcloudWrapperInterface => {
            let wrappersList: VcloudWrapperInterface;
            Object.assign(wrappersList, ...wrappers);
            return wrappersList;
          },
          inject: [
            VmEndpointService,
            VdcEndpointService,
            TasksEndpointService,
            EdgeGatewayEndpointService,
            ApplicationPortProfileEndpointService,
            DhcpEndpointService,
            FirewallEndpointService,
            IpSetsEndpointService,
            NatEndpointService,
            NetworkEndpointService,
            AdminVdcEndpointService,
            AdminEdgeGatewayEndpointService,
            AdminUserEndpointService,
            AdminOrgEndpointService,
          ],
        },
        VmEndpointService,
        VdcEndpointService,
        TasksEndpointService,
        EdgeGatewayEndpointService,
        ApplicationPortProfileEndpointService,
        DhcpEndpointService,
        FirewallEndpointService,
        IpSetsEndpointService,
        NatEndpointService,
        NetworkEndpointService,
        AdminVdcEndpointService,
        AdminEdgeGatewayEndpointService,
        AdminUserEndpointService,
        AdminOrgEndpointService,
        ConfigService,
        VcloudWrapperService,
      ],
    }).compile();

    service = module.get<VcloudWrapperService>(VcloudWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
