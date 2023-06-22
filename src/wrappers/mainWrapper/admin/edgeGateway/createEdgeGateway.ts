import { getIPRange } from 'get-ip-range';
import { isNil } from 'lodash';
import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
import { getAvailableIpAddresses } from './getAvailableIpAddresses';
import { getExternalNetworks } from './getExternalNetworks';

export const createEdgeGateway = () => {
  /**
   * get external networks
   * @param {String} authToken
   * @param {Number} page
   * @param {Number} pageSize
   * @return {Promise}
   */
  async function findExternalNetwork(authToken, page = 1, pageSize = 25) {
    const network = await getExternalNetworks(authToken, page, pageSize);
    return Promise.resolve(network);
  }
  /**
   * check if theres is enough remaining ip and allocate ip to user
   * @param {String} externalNetworkId uplink id
   * @param {String} authToken
   * @param {Number} userIpCount
   * @return {Promise<Array>} list of allocated ips to user
   */
  async function ipAllocation(externalNetworkId, authToken, userIpCount) {
    const availableIp = await getAvailableIpAddresses(
      externalNetworkId,
      authToken,
    );
    let index = 0;
    if (isNil(availableIp)) {
      return Promise.reject(new Error('there is no ip remaining'));
    }
    const allocatedIPAddresses = [];
    let ipRange = availableIp[index];
    let ipAddresses = getIPRange(ipRange.startAddress, ipRange.endAddress);
    for (let remainingIp = userIpCount; remainingIp > 0; ) {
      if (ipAddresses.length > 0) {
        allocatedIPAddresses.push({
          startAddress: ipAddresses[0],
          endAddress: ipAddresses[0],
        });
        ipAddresses.shift();
        remainingIp--;
      } else {
        index++;
        ipRange = availableIp[index];
        ipAddresses = getIPRange(ipRange.startAddress, ipRange.endAddress);
      }
    }
    if (allocatedIPAddresses.length < userIpCount) {
      return Promise.reject(new Error('there is no ip remaining'));
    }
    return Promise.resolve(allocatedIPAddresses);
  }
  /**
   * create edge gateway for user
   * @param {Object} config
   * @param {String} config.name required
   * @param {String} config.vdcId required
   * @param {String} config.authToken required
   * @param {String} config.userIpCount number of user ip addresses
   * @return {Promise}
   */
  async function createEdge(config) {
    const network = await findExternalNetwork(config.authToken);
    const networkValue = network.values[0];
    const ipRange = await ipAllocation(
      networkValue.id,
      config.authToken,
      config.userIpCount,
    );
    const request = {
      name: config.name,
      description: '',
      ownerRef: {
        id: config.vdcId,
      },
      edgeGatewayUplinks: [
        {
          uplinkId: networkValue.id,
          uplinkName: networkValue.name,
          subnets: {
            values: [
              {
                gateway: networkValue.subnets.values[0].gateway,
                prefixLength: networkValue.subnets.values[0].prefixLength,
                dnsSuffix: null,
                dnsServer1: '',
                dnsServer2: '',
                ipRanges: {
                  values: ipRange,
                },
                enabled: true,
                totalIpCount: networkValue.subnets.values[0].totalIpCount,
                usedIpCount: networkValue.subnets.values[0].usedIpCount,
              },
            ],
          },
          dedicated: false,
        },
      ],
    };
    const options = {
      headers: {
        Authorization: `Bearer ${config.authToken}`,
      },
      body: request,
    };
    const edgeGateway = await new VcloudWrapper().posts(
      'admin.edgeGateway.createEdgeGateway',
      options,
    );
    return Promise.resolve({
      name: config.name,
      ipRange: ipRange,
      __vcloudTask: edgeGateway.headers['location'],
    });
  }
  return {
    createEdge,
  };
};
module.exports = createEdgeGateway;
