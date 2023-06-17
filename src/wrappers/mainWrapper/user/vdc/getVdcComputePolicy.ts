const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
 * @param {String} authToken
 * @param {String} vdcId
 * @param {Number} page
 * @param {Number} pageSize
 * @return {Promise}
 */
async function userGetVdcComputePolicy(authToken, vdcId, page = 1, pageSize = 10) {
  const params = {
    page,
    pageSize,
  };
  const response = await new VcloudWrapper().posts('user.vdc.getVdcComputePolicy', {
    params,
    urlParams: {vdcId},
    headers: {Authorization: `Bearer ${authToken}`},
  });
  return Promise.resolve(response.data);
};

module.exports = userGetVdcComputePolicy;
