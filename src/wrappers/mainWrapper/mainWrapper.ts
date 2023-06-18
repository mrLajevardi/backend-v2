const adminEdgeGatewayWrapper = require('./admin/edgeGateway/adminEdgeGatewayWrapper');
const adminOrgWrapper = require('./admin/org/adminOrgWrapper');
const adminUserWrapper = require('./admin/user/adminUserWrapper');
const adminVdcWrapper = require('./admin/vdc/adminVdcWrapper');
const applicationPortProfilesWrapper = require(
    './user/applicationPortProfile/applicationPortProfileWrapper',
);
const dhcpWrapper = require('./user/dhcp/dhcpWrapper');
const edgeGatewayWrapper = require('./user/edgeGateway/edgeGatewayWrapper');
const firewallWrapper = require('./user/firewall/firewallWrapper');
const ipSetsWrapper = require('./user/ipSets/ipSetsWrapper');
const natWrapper = require('./user/nat/natWrapper');
const networkWrapper = require('./user/network/networkWrapper');
const tasksWrapper = require('./user/tasks/tasksWrapper');
const vdcWrapper = require('./user/vdc/vdcWrapper');
const vmWrapper = require('./user/vm/vmWrapper');

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

module.exports = mainWrapper;
