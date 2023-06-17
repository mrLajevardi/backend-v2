const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
 * @param {String} authToken
 * @param {Number} page
 * @param {Number} pageSize
 * @return {Promise}
 */
async function userGetEdgeGateway(authToken, page = 1, pageSize = 25) {
  const options = {
    params: {
      page,
      pageSize,
    },
    headers: {Authorization: `Bearer ${authToken}`},
  };
  const edgeGateways = await new VcloudWrapper()
      .posts('user.edgeGateway.getEdgeGateway', options);
  return Promise.resolve(edgeGateways.data);
};

module.exports = userGetEdgeGateway;
