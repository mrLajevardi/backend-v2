const HttpExceptions = require('../../../../exceptions/httpExceptions');
const {isEmpty} = require('../../../../utils/helpers');
const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const getEdgeGateway = require('../edgeGateway/getEdgeGateway');
/**
 * get a list of nats
 * @param {String} authToken
 * @param {Number} pageSize
 * @param {String} cursor
 * @param {String} edgeName
 * @return {Promise}
 */
async function userGetNatRuleList(authToken, pageSize = 1, cursor = '', edgeName) {
  const gateway = await getEdgeGateway(authToken);
  if (isEmpty(gateway.values[0])) {
    return Promise.reject(new HttpExceptions().noIpIsAssigned());
  }
  const gatewayId = gateway.values.filter((value) => value.name === edgeName)[0].id;
  const params = {
    pageSize,
    cursor,
  };
  const natRules = await new VcloudWrapper().posts('user.nat.getNatList', {
    params,
    headers: {Authorization: `Bearer ${authToken}`},
    urlParams: {gatewayId},
  });
  return Promise.resolve(natRules);
};

module.exports = userGetNatRuleList;
