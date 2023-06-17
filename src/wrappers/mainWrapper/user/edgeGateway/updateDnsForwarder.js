const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const getEdgeGateway = require('../edgeGateway/getEdgeGateway');

/**
 * update dns forwarder
 * @param {Object} config
 * @param {Boolean} config.enabled
 * @param {Array} config.upstreamServers
 * @param {String} config.displayName
 * @param {String} config.authToken
//  * @param {String} config.ruleId
 * @param {String} edgeName edgeGateway name
 */
async function updateDnsForwarder(config, edgeName) {
  const gateway = await getEdgeGateway(config.authToken);
  const gatewayId = gateway.values.filter((value) => value.name === edgeName)[0]
      .id;
  const request = {
    enabled: config.enabled,
    listenerIp: null,
    defaultForwarderZone: {
      displayName: config.displayName,
      upstreamServers: config.upstreamServers,
    },
    conditionalForwarderZones: null,
    version: null,
    snatRuleEnabled: null,
  };
  const options = {
    body: request,
    urlParams: {
      gatewayId,
    },
    headers: {Authorization: `Bearer ${config.authToken}`},
  };
  const dnsForwarder = await new VcloudWrapper().posts(
      'user.edgeGateway.updateDnsForwarder',
      options,
  );
  return Promise.resolve({
    __vcloudTask: dnsForwarder.headers['location'],
  });
}
module.exports = updateDnsForwarder;
