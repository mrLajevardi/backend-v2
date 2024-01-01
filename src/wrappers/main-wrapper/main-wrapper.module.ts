import { Module } from '@nestjs/common';
import { ApplicationPortProfileWrapperService } from './service/user/applicationPortProfile/application-port-profile-wrapper.service';
import { DhcpWrapperService } from './service/user/dhcp/dhcp-wrapper.service';
import { EdgeGatewayWrapperService } from './service/user/edgeGateway/edge-gateway-wrapper.service';
import { FirewallWrapperService } from './service/user/firewall/firewall-wrapper.service';
import { IpSetsWrapperService } from './service/user/ipSets/ip-sets-wrapper.service';
import { NatWrapperService } from './service/user/nat/nat-wrapper.service';
import { NetworkWrapperService } from './service/user/network/network-wrapper.service';
import { TaskWrapperService } from './service/user/tasks/task-wrapper.service';
import { VdcWrapperService } from './service/user/vdc/vdc-wrapper.service';
import { VmWrapperService } from './service/user/vm/vm-wrapper.service';
import { AdminEdgeGatewayWrapperService } from './service/admin/edgeGateway/admin-edge-gateway-wrapper.service';
import { AdminOrgWrapperService } from './service/admin/org/admin-org-wrapper.service';
import { AdminUserWrapperService } from './service/admin/user/admin-user-wrapper.service';
import { AdminVdcWrapperService } from './service/admin/vdc/admin-vdc-wrapper.service';
import { VcloudWrapperModule } from '../vcloud-wrapper/vcloud-wrapper.module';
import { VmCreateWrapperService } from './service/user/vm/vm-create-wrapper.service';
import { VmDeleteWrapperService } from './service/user/vm/vm-delete-wrapper.service';
import { VmGetWrapperService } from './service/user/vm/vm-get-wrapper.service';
import { VmUpdateWrapperService } from './service/user/vm/vm-update-wrapper.service';
@Module({
  imports: [VcloudWrapperModule],
  providers: [
    ApplicationPortProfileWrapperService,
    DhcpWrapperService,
    EdgeGatewayWrapperService,
    FirewallWrapperService,
    IpSetsWrapperService,
    NatWrapperService,
    NetworkWrapperService,
    TaskWrapperService,
    VdcWrapperService,
    VmWrapperService,
    VmCreateWrapperService,
    VmDeleteWrapperService,
    VmGetWrapperService,
    VmUpdateWrapperService,
    AdminEdgeGatewayWrapperService,
    AdminOrgWrapperService,
    AdminUserWrapperService,
    AdminVdcWrapperService,
  ],
  exports: [
    ApplicationPortProfileWrapperService,
    DhcpWrapperService,
    EdgeGatewayWrapperService,
    FirewallWrapperService,
    IpSetsWrapperService,
    NatWrapperService,
    NetworkWrapperService,
    TaskWrapperService,
    VdcWrapperService,
    VmWrapperService,
    VmCreateWrapperService,
    VmDeleteWrapperService,
    VmGetWrapperService,
    VmUpdateWrapperService,
    AdminEdgeGatewayWrapperService,
    AdminOrgWrapperService,
    AdminUserWrapperService,
    AdminVdcWrapperService,
  ],
})
export class MainWrapperModule {}
