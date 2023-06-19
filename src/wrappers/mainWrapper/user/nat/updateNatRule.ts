const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const getEdgeGateway = require('../edgeGateway/getEdgeGateway');

/**
 * update nat rule
 * @param {Object} config
 * @param {String} config.authToken
 * @param {String} config.ruleId
 * @param {String} config.name
 * @param {String} config.dnatExternalPort
 * @param {String} config.externalAddresses
 * @param {String} config.internalAddresses
 * @param {String} config.internalPort
 * @param {String} config.snatDestinationAddresses
 * @param {Object} config.applicationPortProfile
 * @param {String} config.type
 * @param {String} edgeName edgeGateway name
 */
export async function userUpdateNatRule(config, edgeName) {
  const gateway = await getEdgeGateway(config.authToken);
  const gatewayId = gateway.values.filter((value) => value.name === edgeName)[0]
    .id;
  const request = {
    enabled: config.enabled,
    logging: config.logging,
    priority: config.priority,
    firewallMatch: config.firewallMatch,
    dnatExternalPort: config.dnatExternalPort,
    externalAddresses: config.externalAddresses,
    internalAddresses: config.internalAddresses,
    internalPort: config.internalPort,
    name: config.name,
    snatDestinationAddresses: config.snatDestinationAddresses,
    applicationPortProfile: config.applicationPortProfile,
    type: config.type,
    description: config.description,
    id: config.ruleId,
  };
  const options = {
    body: request,
    urlParams: {
      gatewayId,
      natId: config.ruleId,
    },
    headers: { Authorization: `Bearer ${config.authToken}` },
  };
  const nat = await new VcloudWrapper().posts('user.nat.updateNat', options);
  return Promise.resolve({
    __vcloudTask: nat.headers['location'],
  });
}
module.exports = userUpdateNatRule;
