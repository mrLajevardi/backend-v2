import { adminEdgeGatewayWrapper } from './admin/edgeGateway/adminEdgeGatewayWrapper';
import { adminOrgWrapper } from './admin/org/adminOrgWrapper';
import { adminUserWrapper } from './admin/user/adminUserWrapper';
import { adminVdcWrapper } from './admin/vdc/adminVdcWrapper';
import { applicationPortProfilesWrapper } from './user/applicationPortProfile/applicationPortProfileWrapper';
import { dhcpWrapper } from './user/dhcp/dhcpWrapper';
import { edgeGatewayWrapper } from './user/edgeGateway/edgeGatewayWrapper';
import { firewallWrapper } from './user/firewall/firewallWrapper';
import { ipSetsWrapper } from './user/ipSets/ipSetsWrapper';
import { natWrapper } from './user/nat/natWrapper';
import { networkWrapper } from './user/network/networkWrapper';
import { tasksWrapper } from './user/tasks/tasksWrapper';
import { vdcWrapper } from './user/vdc/vdcWrapper';
import { vmWrapper } from './user/vm/vmWrapper';

export const mainWrapper = {
  admin: {
    edgeGateway: adminEdgeGatewayWrapper,
    org: adminOrgWrapper,
    user: adminUserWrapper,
    vdc: adminVdcWrapper,
  },
  user: {
    applicationPortProfile: applicationPortProfilesWrapper,
    edgeGateway: edgeGatewayWrapper,
    firewall: firewallWrapper,
    ipSets: ipSetsWrapper,
    nat: natWrapper,
    network: networkWrapper,
    tasks: tasksWrapper,
    vdc: vdcWrapper,
    vm: vmWrapper,
    dhcp: dhcpWrapper,
  },
};
