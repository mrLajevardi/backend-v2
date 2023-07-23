import * as https from 'https';
import { networkEndpoints } from './user/edgeGateway/network/networkEndpoints';
import { tasksEndpoints } from './user/tasks/tasksEndpoints';
import { natEndpoints } from './user/edgeGateway/nat/natEndPoints';
import { firewallEndpoints } from './user/edgeGateway/firewall/firewallEndpoints';
import { ipSetsEndpoints } from './user/edgeGateway/ipSets/ipSetsEndpoints';
import { edgeGatewayEndpoints } from './user/edgeGateway/edgeGatewayEndpoints';
import { vdcEndpoints } from './user/vdc/vdcEndpoints';
import { applicationPortProfilesEndpoints } from './user/edgeGateway/applicationPortProfiles/applicationPortProfilesEndpoints';
import { adminEdgeGatewayEndpoints } from './admin/edgeGateway/adminEdgeGatewayEndpoints';
import { adminOrgEndpoints } from './admin/org/adminOrgEndpoints';
import { adminVdcEndpoints } from './admin/vdc/adminVdcEndpoints';
import { userEndpoints } from './admin/user/userEndpoints';
import { vmEndpoints } from './user/vm/vmEndpoints';
import { dhcpEndpoints } from './user/edgeGateway/dhcp/dhcpEndpoints';
import { Wrapper } from '../wrapper';
// import { baseUrl } from '../wrapper';
/**
 ** this wrapper directly send request to vcloud server
 */
export class VcloudWrapper extends Wrapper {
  /**
   * initialize endpoints object
   */
  constructor() {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    const endPoints = {
      user: {
        tasks: tasksEndpoints,
        network: networkEndpoints,
        dhcp: dhcpEndpoints,
        nat: natEndpoints,
        firewall: firewallEndpoints,
        ipSets: ipSetsEndpoints,
        edgeGateway: edgeGatewayEndpoints,
        vdc: vdcEndpoints,
        applicationPortProfiles: applicationPortProfilesEndpoints,
        vm: vmEndpoints,
      },
      admin: {
        edgeGateway: adminEdgeGatewayEndpoints,
        org: adminOrgEndpoints,
        vdc: adminVdcEndpoints,
        user: userEndpoints,
      },
    };
    const baseUrl = 'https://labvpc.aradcloud.com';
    super(httpsAgent, endPoints, baseUrl);
  }
}
