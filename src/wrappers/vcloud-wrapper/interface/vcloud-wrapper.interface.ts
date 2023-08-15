import { AdminEdgeGatewayEndpointService } from '../services/admin/edgeGateway/admin-edge-gateway-endpoint.service';
import { AdminOrgEndpointService } from '../services/admin/org/admin-org-endpoint.service';
import { AdminUserEndpointService } from '../services/admin/user/admin-user-endpoint.service';
import { AdminVdcEndpointService } from '../services/admin/vdc/admin-vdc-endpoint.service';
import { ApplicationPortProfileEndpointService } from '../services/user/edgeGateway/applicationPortProfile/application-port-profile-endpoint.service';
import { DhcpEndpointService } from '../services/user/edgeGateway/dhcp/dhcp-endpoint.service';
import { EdgeGatewayEndpointService } from '../services/user/edgeGateway/edge-gateway-endpoint.service';
import { FirewallEndpointService } from '../services/user/edgeGateway/firewall/firewall-endpoint.service';
import { IpSetsEndpointService } from '../services/user/edgeGateway/ipSets/ip-sets-endpoint.service';
import { NatEndpointService } from '../services/user/edgeGateway/nat/nat-endpoint.service';
import { NetworkEndpointService } from '../services/user/edgeGateway/network/network-endpoint.service';
import { TasksEndpointService } from '../services/user/tasks/tasksEndpoint.service';
import { VdcEndpointService } from '../services/user/vdc/vdc-endpoint.service';
import { VmEndpointService } from '../services/user/vm/vm-endpoint.service';

export interface VcloudWrapperInterface {
  VmEndpointService: VmEndpointService;
  VdcEndpointService: VdcEndpointService;
  TasksEndpointService: TasksEndpointService;
  EdgeGatewayEndpointService: EdgeGatewayEndpointService;
  ApplicationPortProfileEndpointService: ApplicationPortProfileEndpointService;
  DhcpEndpointService: DhcpEndpointService;
  FirewallEndpointService: FirewallEndpointService;
  IpSetsEndpointService: IpSetsEndpointService;
  NatEndpointService: NatEndpointService;
  NetworkEndpointService: NetworkEndpointService;
  AdminVdcEndpointService: AdminVdcEndpointService;
  AdminEdgeGatewayEndpointService: AdminEdgeGatewayEndpointService;
  AdminUserEndpointService: AdminUserEndpointService;
  AdminOrgEndpointService: AdminOrgEndpointService;
}
