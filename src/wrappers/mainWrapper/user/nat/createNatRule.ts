const HttpExceptions = require('../../../../exceptions/httpExceptions');
const {isEmpty} = require('../../../../utils/helpers');
const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const getEdgeGateway = require('../edgeGateway/getEdgeGateway');
/**
 *
 * @param {Object} config
 * @param {String} edgeName
 * @param {String} config.authToken
 * @param {String} config.name
 * @param {String} config.dnatExternalPort
 * @param {String} config.externalAddresses
 * @param {String} config.internalAddresses
 * @param {String} config.internalPort
 * @param {String} config.snatDestinationAddresses
 * @param {Object} config.applicationPortProfile
 * @param {String} config.type
 * @param {String} config.enabled
 */
const userCreateNatRule = async (config, edgeName) => {
  const gateway = await getEdgeGateway(config.authToken);
  if (isEmpty(gateway.values[0])) {
    return Promise.reject(new HttpExceptions().noIpIsAssigned());
  }
  const gatewayId = gateway.values.filter((value) => value.name === edgeName)[0].id;
  const request = {
    enabled: config.enabled,
    dnatExternalPort: config.dnatExternalPort,
    externalAddresses: config.externalAddresses,
    internalAddresses: config.internalAddresses,
    internalPort: config.internalPort,
    name: config.name,
    snatDestinationAddresses: config.snatDestinationAddresses,
    applicationPortProfile: config.applicationPortProfile,
    type: config.type,
    logging: config.logging,
    priority: config.priority,
    description: config.description,
    firewallMatch: config.firewallMatch,
  };
  const options = {
    headers: {Authorization: `Bearer ${config.authToken}`},
    body: request,
    urlParams: {gatewayId},
  };
  const nat = await new VcloudWrapper().posts('user.nat.createNat', options);
  return Promise.resolve({
    __vcloudTask: nat.headers['location'],
  });
};
module.exports = userCreateNatRule;
