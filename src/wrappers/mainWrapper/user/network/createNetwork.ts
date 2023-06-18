import { NoIpIsAssignedException } from "src/infrastructure/exceptions/no-ip-is-assigned.exception";
import { isEmpty } from "class-validator";
const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const getEdgeGateway = require('../edgeGateway/getEdgeGateway');
/**
 * @param {Object} config
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
 * @return {Promise}
 */
export async function userCreateNetwork(config, edgeName = null) {
  let gateway = await getEdgeGateway(config.authToken);
  if (isEmpty(gateway.values[0])) {
    return Promise.reject(new NoIpIsAssignedException());
  }
  gateway = gateway.values.filter((value)=> value.name === edgeName);
  const gatewayId = gateway[0].id;
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
      values: [{
        dnsServer1: config.dnsServer1,
        dnsServer2: config.dnsServer2,
        dnsSuffix: config.dnsSuffix,
        enabled: true,
        gateway: config.gateway,
        ipRanges: {
          values: config.ipRanges.values,
        },
        prefixLength: config.prefixLength,
      }],
    },
    ownerRef: {
      id: config.vdcId,
    },
    connection,
  };
  const options = {
    headers: {Authorization: `Bearer ${config.authToken}`},
    body: request,
  };
  const createdNetwork = await new VcloudWrapper().posts('user.network.createNetwork', options);
  return Promise.resolve({
    __vcloudTask: createdNetwork.headers['location'],
  });
};

module.exports = userCreateNetwork;
