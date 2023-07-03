import { NoIpIsAssignedException } from 'src/infrastructure/exceptions/no-ip-is-assigned.exception';
import { isEmpty } from 'class-validator';
import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
import { getEdgeGateway } from '../edgeGateway/getEdgeGateway';
/**   
 * update dhcp
 * @param {String} authToken
 * @param {Array<Object>} dhcpPools eg:
    [{
    enabled: true,
        ipRange: {
            startAddress: 192.168.1.1,
            endAddress: 192.168.1.2
        }
    }]
 * @param {String} ipAddress ipAddress of gateway cidr
 * @param {Array} dnsServers  list of dns servers limit: 2
 * @param {Number} leaseTime  How long a DHCP IP will be leased out for
 * @param {String} networkId
 * @param {String} mode  EDGE, NETWORK and RELAY
 * @return {Promise}
 */
export async function userUpdateDhcp(
  authToken,
  dhcpPools,
  ipAddress,
  dnsServers,
  leaseTime,
  networkId,
  mode,
) {
  const gateway = await getEdgeGateway(authToken);
  if (isEmpty(gateway.values[0])) {
    return Promise.reject(new NoIpIsAssignedException());
  }
  const dhcp = await new VcloudWrapper().posts('user.dhcp.updateDhcp', {
    headers: { Authorization: `Bearer ${authToken}` },
    urlParams: {
      networkId,
    },
    body: {
      mode,
      ipAddress,
      leaseTime,
      enabled: true,
      dhcpPools,
      dnsServers,
    },
  });
  return Promise.resolve({
    __vcloudTask: dhcp.headers['location'],
  });
}
