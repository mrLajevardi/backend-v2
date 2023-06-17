const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
 * creates dhcp binding
 * @param {String} authToken
 * @param {String} networkId
 * @param {Object} config
 * @param {String} config.name
 * @param {String} config.ipAddress
 * @param {String} config.description
 * @param {String} config.macAddress
 * @param {Number} config.leaseTime in seconds
 * @param {Array<String>} config.dnsServers
 * @param {Object} config.dhcpV4BindingConfig
 * @param {String} config.dhcpV4BindingConfig.gatewayIpAddress
 * @param {String} config.dhcpV4BindingConfig.hostName
 * @return {Promise}
 */
async function userCreateDhcpBinding(authToken, networkId, config) {
  const dhcp = await new VcloudWrapper().posts('user.dhcp.createDhcpBinding', {
    headers: {Authorization: `Bearer ${authToken}`},
    urlParams: {
      networkId,
    },
    body: {
      bindingType: 'IPV4',
      name: config.name,
      description: config.description,
      leaseTime: config.leaseTime,
      macAddress: config.macAddress,
      ipAddress: config.ipAddress,
      dnsServers: config.dnsServers,
      dhcpV4BindingConfig: config.dhcpV4BindingConfig,
    },
  });
  return Promise.resolve({
    __vcloudTask: dhcp.headers['location'],
  });
}

module.exports = userCreateDhcpBinding;
