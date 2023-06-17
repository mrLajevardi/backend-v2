const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const getEdgeGateway = require('../edgeGateway/getEdgeGateway');

/**
 * @param {Object} authToken
 * @param {String} ruleId,
 * @param {String} edgeName,
 * @return {Promise}
 */
async function userDeleteNatRule(authToken, ruleId, edgeName) {
  const gateway = await getEdgeGateway(authToken);
  const gatewayId = gateway.values.filter((value) => value.name === edgeName)[0].id;
  const options = {
    urlParams: {
      gatewayId,
      natId: ruleId,
    },
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
  const deletedNat = await new VcloudWrapper().posts('user.nat.deleteNat', options);
  return Promise.resolve({
    __vcloudTask: deletedNat.headers['location'],
  });
};
module.exports = userDeleteNatRule;
