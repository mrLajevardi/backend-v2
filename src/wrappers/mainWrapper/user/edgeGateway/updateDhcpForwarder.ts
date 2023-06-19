const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const getEdgeGateway = require('../edgeGateway/getEdgeGateway');

/**
 * @param {Array} dhcpServers
 * @param {Boolean} enabled
 * @param {object} version
 * @param {string} edgeName
 * @param {string} authToken
 * @return {Promise}
 */
export async function updateDhcpForwarder(
  dhcpServers,
  enabled,
  version,
  edgeName,
  authToken,
) {
  const gateway = await getEdgeGateway(authToken);
  const gatewayId = gateway.values.filter((value) => value.name === edgeName)[0]
    .id;
  const request = {
    enabled,
    dhcpServers,
    version,
  };
  const options = {
    body: request,
    urlParams: {
      gatewayId,
    },
    headers: { Authorization: `Bearer ${authToken}` },
  };
  const dhcpForwarder = await new VcloudWrapper().posts(
    'user.edgeGateway.updateDhcpForwarder',
    options,
  );
  return Promise.resolve({
    __vcloudTask: dhcpForwarder.headers['location'],
  });
}
module.exports = updateDhcpForwarder;
