const lodash = require('lodash');
const {default: axios} = require('axios');
const {isNil} = require('lodash');
const https = require('https');
const networkEndpoints = require('./user/edgeGateway/network/networkEndpoints');
const tasksEndpoints = require('./user/tasks/tasksEndpoints');
const natEndpoints = require('./user/edgeGateway/nat/natEndPoints');
const firewallEndpoints = require('./user/edgeGateway/firewall/firewallEndpoints');
const ipSetsEndpoints = require('./user/edgeGateway/ipSets/ipSetsEndpoints');
const edgeGatewayEndpoints = require('./user/edgeGateway/edgeGatewayEndpoints');
const vdcEndpoints = require('./user/vdc/vdcEndpoints');
const applicationPortProfilesEndpoints = require(
    `./user/edgeGateway/applicationPortProfiles/applicationPortProfilesEndpoints`,
);
const adminEdgeGatewayEndpoints = require('./admin/edgeGateway/adminEdgeGatewayEndpoints');
const adminOrgEndpoints = require('./admin/org/adminOrgEndpoints');
const adminVdcEndpoints = require('./admin/vdc/adminVdcEndpoints');
const userEndpoints = require('./admin/user/userEndpoints');
const vmEndpoints = require('./user/vm/vmEndpoints');
const dhcpEndpoints = require('./user/edgeGateway/dhcp/dhcpEndpoints');
const Wrapper = require('../wrapper');
const {baseUrl} = require('../wrapper');
/**
 ** this wrapper directly send request to vcloud server
 */
class VcloudWrapper extends Wrapper {
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
    const baseUrl = 'https://172.20.34.34:444';
    super(httpsAgent, endPoints, baseUrl);
  }
}

module.exports = VcloudWrapper;
