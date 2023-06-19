const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const getEdgeGateway = require('../edgeGateway/getEdgeGateway');
/**
 * update network
 * @param {Object} config
 * @param {String} networkId
 * @param {String} edgeName
 * @param {String} config.name
 * @param {String} config.gateway
 * @param {String} config.dnsServer1
 * @param {String} config.dnsServer2
 * @param {String} config.dnsSuffix
 * @param {String} config.vdcId
 * @param {String} config.connectionTypeValue
 * @param {String} config.connectionType
 * @param {Object} config.ipRanges
 * @param {Array}  config.ipRanges.values
 * @param {Number} config.prefixLength
 * @param {String} config.authToken
 * @param {String} config.networkType
 */
export async function userUpdateNetwork(config, networkId, edgeName) {
  const gateway = await getEdgeGateway(config.authToken);
  const gatewayId = gateway.values.filter((value) => value.name === edgeName)[0]
    .id;
  let connection = null;
  if (config.networkType !== 'ISOLATED') {
    connection = {
      connectionType: config.connectionType,
      connectionTypeValue: config.connectionTypeValue,
      routerRef: {
        id: gatewayId,
      },
    };
  }
  const request = {
    description: config.description,
    name: config.name,
    networkType: config.networkType,
    subnets: {
      values: [
        {
          dnsServer1: config.dnsServer1,
          dnsServer2: config.dnsServer2,
          dnsSuffix: config.dnsSuffix,
          enabled: true,
          gateway: config.gateway,
          ipRanges: {
            values: config.ipRanges.values,
          },
          prefixLength: config.prefixLength,
        },
      ],
    },
    ownerRef: {
      id: config.vdcId,
    },
    connection,
  };
  const options = {
    body: request,
    urlParams: { networkId },
    headers: { Authorization: `Bearer ${config.authToken}` },
  };
  const updatedNetwork = await new VcloudWrapper().posts(
    'user.network.updateNetwork',
    options,
  );
  return Promise.resolve({
    __vcloudTask: updatedNetwork.headers['location'],
  });
}
