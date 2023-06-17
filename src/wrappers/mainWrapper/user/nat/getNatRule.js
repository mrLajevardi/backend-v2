const HttpExceptions = require('../../../../exceptions/httpExceptions');
const {isEmpty} = require('../../../../utils/helpers');
const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const getEdgeGateway = require('../edgeGateway/getEdgeGateway');
/**
 * get a single nat rule
 * @param {String} authToken
 * @param {String} ruleId
 * @param {String} edgeName edgeGateway name
 * @return {Promise}
 */
async function userGetNatRule(authToken, ruleId, edgeName) {
  const gateway = await getEdgeGateway(authToken);
  if (isEmpty(gateway.values[0])) {
    return Promise.reject(new HttpExceptions().noIpIsAssigned());
  }
  const gatewayId = gateway.values.filter((value) => value.name === edgeName)[0].id;
  const options = {
    urlParams: {
      gatewayId,
      natId: ruleId,
    },
    headers: {Authorization: `Bearer ${authToken}`},
  };
  const natRule = await new VcloudWrapper().posts('user.nat.getNat', options);
  return Promise.resolve(natRule.data);
};

module.exports = userGetNatRule;
