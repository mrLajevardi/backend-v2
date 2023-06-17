const HttpExceptions = require('../../../../exceptions/httpExceptions');
const {isEmpty} = require('../../../../utils/helpers');
const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const getEdgeGateway = require('../edgeGateway/getEdgeGateway');
/**
 * update all firewall rules
 * @param {String} authToken
 * @param {Object} config
 * @param {String} edgeName
 * @return {Promise}
 */
async function userUpdateFirewallList(authToken, config, edgeName) {
  const gateway = await getEdgeGateway(authToken);
  if (isEmpty(gateway.values[0])) {
    return Promise.reject(new HttpExceptions().noIpIsAssigned());
  }
  const gatewayId = gateway.values.filter((value) => value.name === edgeName)[0].id;
  const requestBody = {
    userDefinedRules: config,
  };
  const firewall = await new VcloudWrapper().posts('user.firewall.updateFirewallList', {
    headers: {Authorization: `Bearer ${authToken}`},
    urlParams: {gatewayId},
    body: requestBody,
  });
  return Promise.resolve({
    __vcloudTask: firewall.headers['location'],
  });
}

module.exports = userUpdateFirewallList;
